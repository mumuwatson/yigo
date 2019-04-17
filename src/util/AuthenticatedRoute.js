/*
 * @Author: gmf
 * @Date:   2016-03-08 15:27:21
 * @Last Modified by:   gmf
 * @Last Modified time: 2017-02-20 09:15:19
 */

import React, { Component } from 'react';
import AppStatus from 'yes/dist/stores/AppStatus';
import { Container } from 'flux/utils';
// import { UIOptCenter } from '../../yes_ext';
import { Svr, getUserInfo, loadHistory, setSession, setUserInfo } from 'yes-core';
import { Logined as logined, Logouted as logouted } from 'yes/dist/actions/AppStatusAction';
import AppDispatcher from 'yes/dist/dispatchers/AppDispatcher';
// import { getUserInfo, loadHistory, setSession } from 'yes/dist/session';
import { exitApp, login } from './trinasolarApi';
import { LoadingComp } from 'yes-platform';
import { Modal } from 'antd-mobile';
import { intlShape, FormattedMessage } from 'react-intl';

let modalShow = false;
const AuthenticatedRoute = (BaseComponent, LoginComponent, key) => {
    class AuthenticatedComponent extends Component {
        static getStores() {
            return [AppStatus];
        }

        static calculateState() {
            return {
                state: AppStatus.getState(),
            };
        }

        static contextTypes = {
            intl: intlShape,
        };
        async componentDidMount() {
            await loadHistory();
            // 这里需要与服务器进行环境同步，主要是根据当前前台的cookie
            // 读取后台对应的登录信息,
            if (!this.state.state.get('inited')) {
                // try {
                //     // await loadHistory();
                //     // await UIOptCenter.checkLogin();
                //     // await Svr.SvrMgr.loadTreeMenu();
                //     // 能执行到这里说明缓存中的session没有过期，可以拿出来直接使用
                //     const userinfo = getUserInfo();
                //     AppDispatcher.dispatch(logined(userinfo));
                // } catch (ex) {
                // AppDispatcher.dispatch(logouted());
                try {
                    await login();
                } catch (e) {
                    Modal.alert(this.formatMessage('Error'), this.formatMessage(e || 'Server is unreachable!'), [
                        { text: 'OK', onPress: exitApp },
                    ]);
                    // exitApp();
                }
                // }
            }
            this.dispatcher = AppDispatcher.register((action) => {
                switch (action.type) {
                    case 'LOGOUTED':
                        if (modalShow) {
                            return;
                        }
                        modalShow = true;
                        Modal.alert(this.formatMessage('Session Lost'), this.formatMessage('What to do?'), [
                            { text: this.formatMessage('Exit'), onPress: this.exitApp },
                            { text: this.formatMessage('Relogin'), onPress: this.login },
                        ]);
                        break;
                    default:
                }
            });
        }

        componentWillUnmount() {
            AppDispatcher.unregister(this.dispatcher);
        }

        exitApp = () => {
            modalShow = false;
            exitApp();
        }

        login = () => {
            modalShow = false;
            login();
        }

        formatMessage = (msg) => {
            return this.context.intl.formatMessage({ id: msg });
        }

        render() {
            if (this.state.state.get('inited') && AppStatus.isLogined()) {
                return (<BaseComponent {...this.props} />);
                // if (__DEV__) {
                //     return (<LoginComponent {...this.props} />);
                // } else {
                // Modal.alert('Session丢失', '请选择操作', [
                //     { text: '退出', onPress: exitApp },
                //     { text: '重新登录', onPress: login },
                // ]);
                // return null;
                // }
            }
            return <LoadingComp icon="loading" show>{this.formatMessage('initializing...')}</LoadingComp>;
        }
    }
    const result = Container.create(AuthenticatedComponent);
    if (key) {
        result.prototype.key = key;
    }
    return result;
};
export default AuthenticatedRoute;
