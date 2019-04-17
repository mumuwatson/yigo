import AppDispatcher from 'yes/dist/dispatchers/AppDispatcher';
import { Svr, setSession, setUserInfo } from 'yes-core';
import { Logined as logined } from 'yes/dist/actions/AppStatusAction';
import URI from 'urijs';
import qs from 'qs';
import { Util } from 'yes';
import projectCfg from '../config/project';

export const getSsoToken = () => {
    return new Promise((resolve, reject) => {
        try {
            // if (__DEV__) {
            // resolve('T2995738966361088');
            // } else {
            cordova.exec((data) => {
                localStorage.setItem('ssoToken', data.ssoToken);
                resolve(data.ssoToken);
            }, (data) => {
                reject(data);
            }, 'MideaUser', 'getUser', []);
            // }
        } catch (e) {
            reject(e);
        }
    }, false);
};

export const exitApp = () => {
    cordova.exec((success) => {
    }, (error) => {
    }, 'MideaCommon', 'exit', []);
};

export const getExtra = () => {
    return new Promise((resolve, reject) => {
        cordova.exec((data) => {
            resolve(data.extra);
        }, (error) => {
            reject(error);
        }, 'MideaCommon', 'getExtra', [projectCfg.appId]);
    });
};

export const login = async () => {
    const ssoToken = await getSsoToken();
    const resp = await fetch(`${Svr.SvrMgr.ServletURL}/../trinasolarlogin?ssoToken=${ssoToken}`, {
        credentials: 'include',
    });
    const result = await resp.json();
    if (result.success) {
        await setSession(result.clientID);
        const userInfo = {
            id: result.userID,
            name: result.userName,
            clientID: result.clientID,
        };
        await setUserInfo(userInfo);
        await Svr.SvrMgr.syncServerDate();
        AppDispatcher.dispatch(logined(userInfo));
    } else {
        throw result.error;
    }
};
const mineTypes = [{ ext: 'doc', minetype: 'application/msword' },
{ ext: 'docx', minetype: 'application/msword' },
{ ext: 'pdf', minetype: 'application/pdf' },
{ ext: 'ppt', minetype: 'application/vnd.ms-powerpoint' },
{ ext: 'xls', minetype: 'application/vnd.ms-excel' },
{ ext: 'xlsx', minetype: 'application/vnd.ms-excel' },
{ ext: 'rtf', minetype: 'application/rtf' },
{ ext: 'txt', minetype: 'text/plain' },
{ ext: 'png', minetype: 'image/png' },
{ ext: 'jpg', minetype: 'image/jpeg' },
{ ext: 'jpeg', minetype: 'image/jpeg' },
{ ext: 'apk', minetype: 'application/vnd.android.package-archive' },
];

const getMineType = function (file) {
    if (!file)
        return null;
    var minetype = mineTypes.find(function (item) {
        return file.endsWith(item.ext);
    });
    return minetype ? minetype.minetype : '*/*';
};
const getFileName = function (_url) {
    const txt = _url.split('/').pop();
    var timestamp = Date.parse(new Date());
    var newname = timestamp + '.' + txt.split('.').slice(-1).toString();
    return newname;
};

function isChineseChar(str) {
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return reg.test(str);
}

const downloadFile = function (_url) {
    return new Promise((resolve, reject) => {
        const fileName = getFileName(_url);
        var onFileSystemSuccess = function (fileSystem) {
            var fs = null;
            if (cordova.platformId === "android") {
                fs = fileSystem;
            } else {
                fs = fileSystem.root;
            }
            fs.getFile(
                fileName, { create: true, exclusive: false },
                function gotFileEntry(fileEntry) {
                    fileEntry.remove();
                    var ft = new FileTransfer();

                    var uri = _url;
                    if (isChineseChar(_url)) {
                        uri = encodeURI(_url);
                    }
                    // var uri = encodeURI(_url);
                    // if (cordova.platformId === 'android') {
                    //     uri = _url;
                    // }
                    ft.download(uri, fileEntry.nativeURL, function (entry) {
                        var minetype = getMineType(fileName);
                        resolve();
                        cordova.plugins.fileOpener2.open(
                            entry.toURL(),
                            minetype
                        );
                    }, function (error) {
                        // console.log(error);
                        reject(error.getMessage());
                    },
                        false);
                });
        };
        var onError = function (error) {
            // console.log(error);
            reject(error);
        }
        if (cordova.platformId === "android") {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, onFileSystemSuccess, onError);
        } else {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onError);
        }
    })
};
// if (!__DEV__) {
AppDispatcher.register((action) => {
    switch (action.type) {
        case 'preview':
            console.log(action.url);
            let url = action.url;
            if (action.url.includes('open.js')) {
                const uriParser = new URI(action.url);
                const queryParser = qs.parse(uriParser.query());
                url = `a/cms2-yigo2-adapter/cms/view-yigo-file/${queryParser['filePath']}`;
            }
            // url = path.resolve(Svr.SvrMgr.ServletURL, `../${url}`);
            url = `${Svr.SvrMgr.ServerURL}/${url}`;
            console.log(url);
            setTimeout(() => {
                Util.safeExec(async () => {
                    await downloadFile(url);
                });
            }, 0);
            // downloadFile(url);
            break;
        default:
    }
});
// }
