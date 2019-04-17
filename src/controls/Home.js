import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Image } from 'react-native';
import { Components, History, IndexedDBCacheAdapter } from 'yes-platform';
import { I18nManager } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import AwesomeFontIcon from 'react-native-vector-icons/FontAwesome';
import { intlShape, FormattedMessage } from 'react-intl';
import TodoBadget from './TodoBadget';
import todoImg from '../img/myTodo.svg';
import frommeImg from '../img/fromme.svg';
import Icon from '../font/IconFont';
import { refreshTodoList, refreshRejectList } from '../store/actions';

const styles = StyleSheet.create({
    NavTitle: {
        color: 'black',
        justifyContent: 'center',
        display: 'flex',
        flex: 1,
    },
    HeadBackground: {
        backgroundPosition: 'top',
    },
    BackButton: {
        height: 24,
        width: 24,
        margin: 16,
        fontSize: 36,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#008CD7',
        display: 'flex',
        resizeMode: 'contain',
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    Image: {
        height: 30,
        paddingRight: 6,
    },
    BackImage: {
        backgroundPosition: '0 -56',
    },
    Text: {
        paddingTop: 10,
    },
    Container: {
        flexDirection: 'column',
        backgroundColor: '#EFEFF4',
    },
    NavView: {
        flexDirection: 'row',
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    NavItemContainer: {
        flex: 1,
        paddingLeft: 16,
    },
    NavItem: {
        borderRadius: 4,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    Category: {
        backgroundColor: 'white',
        paddingTop: 40,
    },
    CategoryTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    CategoryDesc: {
        fontSize: 12,
        color: '#8B8B8D',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    CategoryTitleContainer: {
        flexDirection: 'row',
        position: 'absolute',
        left: 12,
        top: 10,
    },
    EntryContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        paddingBottom: 20,
    },
    Entry: {
        width: '25%',
        alignItems: 'center',
    },
    EntryIcon: {
        width: 45,
        height: 45,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    EntryText: {
        paddingTop: 12,
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
    },
    SmallText: {
        fontSize: 12,
        color: '#8B8B8D',
    },
    Toggle: {
        position: 'absolute',
        right: 12,
        top: 10,
    },
    view: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flex: 1,
    }
});

const entries = [
    {
        category: '仓储测试',
        open: true,
        items: [
            {
                icon: 'icon-icon-qingjiashenqing',
                text: '入库通知单',
                enable: true,
                formKey: 'V_InboundNoticeView',
                colorTop: '#FFC400 0%',
                colorBottom: '#FF9100 100%',
                color: '#3F9CFB',
            },
            {
                icon: 'icon-DropsATaxi_flow',
                text: '库存汇总查询',
                enable: true,
                formKey: 'OutboundNoticeReport',
                colorTop: '#FFC400 0%',
                colorBottom: '#FF9100 100%',
                color: '#3F9CFB',
            },
            {
                icon: 'icon-icon-chalvshenqingbaoxiaodan',
                text: 'Business Trip',
                formKey: 'B_TravelExpenseApply',
                enable: false,
                colorTop: '#FF5D0D 0%',
                colorBottom: '#FF9800 100%',
                color: '#17C295',
            },
        ],
    },
    // {
    //     category: '人事管理',
    //     items: [
    //         {
    //             icon: '',
    //             text: '招聘',
    //             color: '',
    //             colorTop: '',
    //             colorBottom: '',
    //         },
    //         {
    //             icon: '',
    //             text: '转正',
    //             color: '',
    //             colorTop: '',
    //             colorBottom: '',
    //         },
    //         {
    //             icon: '',
    //             text: '考核',
    //             color: '',
    //             colorTop: '',
    //             colorBottom: '',
    //         },
    //         {
    //             icon: '',
    //             text: '离职',
    //             color: '',
    //             colorTop: '',
    //             colorBottom: '',
    //         },
    //     ],
    // },
];

export default class Home extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: <FormattedMessage id="BPM" />,
            headerLeft: (
                <HeaderBackButton backImage={<AwesomeFontIcon style={styles.BackButton} name='angle-left' />}  title="返回" />
            ),
            headerTitleStyle: styles.NavTitle,
            // headerBackground: HomeBackground,
            // headerBackground: (
            //     <Image
            //         style={[StyleSheet.absoluteFill, styles.HeadBackground]}
            //         source={{ uri: HomeBackground }}
            //     />
            // ),
            headerStyle: {
                backgroundColor: 'white',
                color: 'white',
                // backgroundImage: '',
            },
        };
    };

    static contextTypes = {
        intl: intlShape,
    };
    state = {
        entries,
    }
    
    componentWillMount() {
        setTimeout(this.refreshBadget, 0);
    }
    componentDidMount() {
        this.timer = setInterval(this.refreshBadget, 120 * 1000);
        this.props.navigation.addListener('action', ({ action }) => {
            if (action.type === 'Navigation/BACK') {
                exitApp();
            }
        });
        IndexedDBCacheAdapter.clear('form');
        IndexedDBCacheAdapter.clear('formdata');
        IndexedDBCacheAdapter.clear('formrights');
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    refreshBadget = () => {
        refreshTodoList();
        refreshRejectList();
    }
    openTodoList = () => {
        console.time('opentodolist');
        History.push('card/TodoList');
        console.timeEnd('opentodolist');
    }
    openSendList = () => {
        History.push('card/SendList');
    }
    newForm = (entry) => {
        if (entry.enable) {
            History.push(`card/YES/${entry.formKey}/-1/DEFAULT`);
        }
    }
    openFocusList = () => {
        const modal = Modal.alert(this.formatMessage('提示'),
            this.formatMessage('该功能暂未开放'), [{
                text: this.formatMessage('OK'),
                onPress: () => modal.close(),
            }]);
    }
    toggleCategory = (category) => {
        const cat = this.state.entries.find((item) => item.category === category);
        if (cat) {
            cat.open = !cat.open;
        }
        this.setState({
            entries: this.state.entries,
        });
    }
    formatMessage = (msg) => {
        if (this.context.intl && msg) {
            return this.context.intl.formatMessage({ id: msg });
        }
        return msg;
    }

    render() {
        return (
            // <BillForm>
            <ScrollView style={styles.Container}>
                <View style={styles.NavView}>
                    {/* <Image style={[StyleSheet.absoluteFill, styles.BackImage]} source={{ uri: HomeBackground }} /> */}
                    <TouchableOpacity style={styles.NavItemContainer} onPress={this.openTodoList}>
                        <View style={styles.NavItem}>
                            <TodoBadget>
                                <img alt="" style={{ height: 30 }} src={todoImg} />
                            </TodoBadget>
                            <Text style={styles.Text}>{this.context.intl.formatMessage({ id: 'Todos' })}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.NavItemContainer} onPress={this.openSendList}>
                        <View style={styles.NavItem}>
                            <AwesomeFontIcon style={{ color: '#FF9500', fontSize: 29 }} name="send" />
                            <Text style={styles.Text}>{this.context.intl.formatMessage({ id: 'Sent' })}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.NavItemContainer} onPress={this.openFocusList}>
                        <View style={styles.NavItem}>
                            <img alt="" style={{ height: 30 }} src={frommeImg} />
                            <Text style={styles.Text}>{this.context.intl.formatMessage({ id: 'Focused' })}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.entries.map((category) =>
                        (
                            <View style={styles.Category}>
                                <View style={styles.CategoryTitleContainer}>
                                    <Text style={styles.CategoryTitle}>{this.context.intl.formatMessage({ id: category.category })}</Text>
                                </View>
                                <TouchableOpacity style={styles.Toggle} onPress={() => this.toggleCategory(category.category)}>
                                    <Text style={styles.SmallText}>{category.open ? '-' : '+'}</Text>
                                </TouchableOpacity>
                                {category.open ? <View style={styles.EntryContainer}>
                                    {
                                        category.items.map((entry) =>
                                            (
                                                <TouchableOpacity style={styles.Entry} onPress={() => this.newForm(entry)}>
                                                    <View style={[styles.EntryIcon, { backgroundColor: entry.color }]}>
                                                        <Icon
                                                            name={entry.icon}
                                                            size={20}
                                                            color={'#FFFFFF'}
                                                        />
                                                    </View>
                                                    <View style={styles.EntryText}>
                                                        <Text>{this.context.intl.formatMessage({ id: entry.text })}</Text>
                                                        {!entry.enable ? <Text style={styles.CategoryDesc}>({this.context.intl.formatMessage({ id: 'Comming' })})</Text> : null}
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        )
                                    }
                                </View> : null}
                            </View>
                        )
                    )
                }
            </ScrollView>
            // </BillForm>
        );
    }
}