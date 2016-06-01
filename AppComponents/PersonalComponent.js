'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    Image,
    Navigator,
    Platform,
} from 'react-native';

import GHService from '../networkService/GithubServices';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../commonComponents/Colors';
import SettingCell from './SettingsCell';


const ICON_SIZE = 20;

export default class PersonComponent extends Component {
    pressLogin = ()=> {
        const isLogined = GHService.isLogined();
        if (isLogined) return;

        this.props.navigator.push({
            id: 'login',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            title: 'Please Login now',
        });

    }

    onEditProfile = ()=> {
        if (GHService.isLogined()) {
            this.props.navigator.push({id: 'editprofile'});
        } else {
            this.props.navigator.push({
                id: 'login',
                title: 'Edit need login',
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            });
        }
    }

    render() {
        const user = GHService.currentUser();
        const isLogined = GHService.isLogined();
        const stateText = isLogined ? 'Logined' : 'Better Press to Login';
        const stateColor = isLogined ? Colors.green : 'orange';
        const avatarURL = user.avatar || 'a';

        let top = 0;
        if (Platform.OS === 'android') {
            top = 44;
        }

        return (
            <ScrollView
                style={[styles.container, {marginTop: top}]}
                automaticallyAdjustContentInsets={false}
                contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
                contentOffset={{x:0, y:-64}}
            >
                <TouchableHighlight
                    underlayColor={Colors.lightGray}
                    style={styles.userTouch}
                    onPress={() => this.props.navigator.push({id: 'user', obj: user})}>
                    <View style={styles.user}>
                        <Image
                            source={{uri: avatarURL}}
                            style={styles.avatar}
                            onLoadEnd={this.avatarLoadEnd}/>
                        <View style={styles.nameInfo}>
                            <Text style={styles.name}>
                                {user.login}
                            </Text>
                        </View>
                        <Text
                            style={[styles.loginState, {color: stateColor}]}
                            onPress={this.pressLogin}>
                            {stateText}
                        </Text>
                        <Icon
                            name='ios-arrow-dropright'
                            size={ICON_SIZE}
                            iconStyle={styles.arrow}
                            color={Colors.textGray}/>
                    </View>
                </TouchableHighlight>
                <SettingCell
                    iconName={'ios-eye'}
                    iconColor={Colors.blue}
                    settingName={'个人资料'}
                    onPress={this.onEditProfile}
                />
                <SettingCell settingName={'设置'}
                             onPress={() => this.props.navigator.push({id: 'settings'})}
                />
            </ScrollView>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0EFF5',
        flex: 1,
    },
    userTouch: {
        marginTop: 20,
    },
    user: {
        padding: 8,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EDECF1',
    },
    avatar: {
        backgroundColor: Colors.lightGray,
        borderRadius: 2,
        width: 48,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 0.5,
    },
    nameInfo: {
        flexDirection: 'column',
        marginLeft: 8,
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        color: 'black',
        fontSize: 17,
    },
    arrow: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        marginRight: 10
    },
    settings: {
        height: 44,
    },
    loginState: {
        marginRight: 5,
    }
});
