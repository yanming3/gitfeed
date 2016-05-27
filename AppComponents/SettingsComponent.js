var React = require('react');
var ReactNative = require('react-native');
const GHService = require('../networkService/GithubServices');
const CommonComponents = require('../commonComponents/CommonComponents');
const Colors = require('../commonComponents/Colors');
const SettingComponent = require('./SettingsCell');
const GFDiskCache = require('../iosComponents/GFDiskCache');

const {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    Linking,
    Alert,
    Platform,
    } = ReactNative;

const PersonComponent = React.createClass({
    getInitialState() {
        return {
            cachedSize: null,
            appVersion: '',
            appBuild: '',
            appStoreURL: '',
        };
    },

    componentWillMount() {
        GFDiskCache.getDiskCacheCost((size) => {
            this.setState({
                cachedSize: size,
            });
        });
    },

    onShare() {
        if (Platform.OS === 'android') {
            return;
        }

        const message = 'This Github app is awesome';
        ActionSheetIOS.showShareActionSheetWithOptions({
                message: message,
                url: 'https://appsto.re/cn/jhzxab.i',
            },
            () => {
            },
            () => {
            });
    },

    pressLogout() {
        const title = 'Are you sure to leave?';

        if (Platform.OS === 'android') {
            Alert.alert(
                title,
                null,
                [
                    {text: 'logout', onPress: () => GHService.logout()},
                    {text: 'cancel', onPress: () => console.log('Bar Pressed!')}
                ]
            )
        } else if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({
                    title: '确定退出?',
                    options: ['确定', '取消'],
                    cancelButtonIndex: 1,
                    destructiveButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex == 0) {
                        GHService.logout();
                    }
                });
        }
    },

    onRate() {
        const rURL = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=1079873993&pageNumber=0&sortOrdering=2&mt=8'
        Linking.openURL(rURL);
    },

    pressLogout() {
        ActionSheetIOS.showActionSheetWithOptions({
                title: 'Are you sure to leave?',
                options: ['logout', 'cancel'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
            },
            (buttonIndex) => {
                if (buttonIndex == 0) {
                    GHService.logout();
                }
            });
    },

    onOpenAuthor() {
        const user = {
            url: 'https://api.github.com/users/yanming3',
            login: 'yanming3'
        };

        this.props.navigator.push({id: 'user', obj: user});
    },

    render() {
        const isLogined = GHService.isLogined();
        const logoutColor = isLogined ? Colors.red : 'orange';

        let top = 0;
        if (Platform.OS === 'android') {
            top = 44;
        }

        return (
            <ScrollView
                style={[styles.container, {marginTop: top}]}
                automaticallyAdjustContentInsets={false}
                contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
                contentOffset={{x:0, y:-64}}>
                <SettingComponent
                    iconName={'ios-trash'}
                    iconColor={Colors.blue}
                    settingName={'清空缓存'}
                    onPress={() => {GFDiskCache.clearDiskCache((size) => {
                        this.setState({
                          cachedSize: size,
                        });
                })}}/>
                <SettingComponent
                    iconName={'ios-share'}
                    iconColor={Colors.green}
                    settingName={'分享'}
                    onPress={this.onShare}
                />
                <SettingComponent
                    iconName={'ios-star'}
                    iconColor={'#FDCC4F'}
                    settingName={'建议'}
                    onPress={this.onRate}
                />
                <SettingComponent
                    iconName={'ios-browsers'}
                    iconColor={Colors.purple}
                    settingName={'关于'}
                    onPress={this.onOpenAuthor}
                />
                <TouchableOpacity
                    style={[styles.logout, {backgroundColor: logoutColor}]}
                    onPress={this.pressLogout}>
                    <Text style={styles.logoutText}>
                        登出
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0EFF5',
        flex: 1,
    },
    logout: {
        height: 44,
        borderRadius: 3,
        margin: 10,
        marginTop: 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    }
});

module.exports = PersonComponent;
