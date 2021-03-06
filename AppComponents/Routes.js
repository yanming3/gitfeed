'use strict';

import React from 'react';
import {
    Navigator,
    TouchableOpacity,
    StyleSheet,
    PixelRatio,
    Text,
    TextInput,
    View,
    BackAndroid,
    Platform,
    Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../commonComponents/Colors';
const NavigatorNavigationBarStyle = require('./GHNavigatorBarStyle');
import UserComponent from './UserComponent';
import GHWebComponent from './GithubWebComponent';
import UserListComponent from './UserListComponent';
import FeedComponent from './FeedComponent';
import LoginComponent from './LoginComponent';
import OrgComponent from './OrgComponent';
import PersonalComponent from './PersonalComponent';
import SettingsComponent from './SettingsComponent';
import RepoListComponent from './RepoListComponent';
import ExploreComponent from './ExploreComponent';
import SearchComponent from './SearchComponent';
import ShowCaseItem from './ShowcaseItem';
import FamousComponent from './FamousComponent';
import EditProfileComponent from './EditProfileComponent';


const ScreenWidth = Dimensions.get('window').width;
const NavigationBarRouteMapper = {
    LeftButton: function (route, navigator, index, navState) {
        if (index === 0 || route.id === 'login') {
            return null;
        } else if (route.id == 'editprofile') {
            return (
                <TouchableOpacity onPress={route.pressCancel}>
                    <Text style={[styles.navBarText, {marginRight: 10,marginLeft:10}]}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Icon
                    name='ios-arrow-back'
                    size={30}
                    style={{marginTop: 8}}
                    color={Colors.blue}
                />
            </TouchableOpacity>
        );
    },

    RightButton: function (route, navigator, index, navState) {
        let rightButton;
        switch (route.id) {
            case 'login':
            {
                rightButton = (
                    <TouchableOpacity onPress={() => navigator.pop()}>
                        <Text style={[styles.navBarText, {marginRight: 10}]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                )
            }
                break;
            case 'editprofile':
                rightButton = (
                    <TouchableOpacity onPress={route.pressSave}>
                        <Text style={[styles.navBarText, {marginRight: 10}]}>
                            Save
                        </Text>
                    </TouchableOpacity>
                )
                break;
            case 'web':
                if (Platform.OS === 'ios') {
                    rightButton = (
                        <TouchableOpacity
                            onPress={route.onShare}
                            style={{width: 40, height: 40}}>
                            <Icon
                                name='share'
                                size={30}
                                style={{paddingLeft: 10, marginTop: 8}}
                                color={Colors.blue}
                            />
                        </TouchableOpacity>
                    )
                }
                break;
            default:
        }

        return rightButton;
    },

    Title: function (route, navigator, index, navState) {
        let title;
        switch (route.id) {
            case 'feed':
                title = 'Feed';
                break;
            case 'repo':
                title = route.obj.name;
                break;
            case 'user':
                title = route.obj.login;
                break;
            case 'web':
                title = route.obj.title;
                break;
            case 'userList':
                title = route.obj.title;
                break;
            case 'login':
                title = route.title;
                break;
            case 'org':
                title = 'org';
                break;
            case 'me':
                title = 'Me';
                break;
            case 'watching':
                title = 'Watching';
                break;
            case 'settings':
                title = "Settings";
                break;
            case 'repos':
                title = route.obj.title;
                break;
            case 'explore':
                title = 'Popular Repos';
                break;
            case 'search':
                title = 'search';
                break;
            case 'showcase':
                title = route.obj.name;
                break;
            case 'famous':
                title = 'Popular Users';
                break;
            case 'editprofile':
                title = 'Edit Profile';
                break;
        }

        const searchPlaceholder = 'Search users, repos';
        if (title == 'Feed') {
            return (
                <TouchableOpacity
                    style={[styles.searchBar, {justifyContent: 'center'}]}
                    onPress={() => {
                            if (route.id == 'feed') {
                              navigator.push({id: 'search'});
                            }
                                }}>
                    <Icon
                        name={'ios-search'}
                        size={20}
                        style={styles.searchIcon}
                        color={Colors.black}
                    />
                    <Text style={[styles.textInput, {alignSelf: 'center', flex: 0}]}>
                        {searchPlaceholder}
                    </Text>
                </TouchableOpacity>
            )
        } else if (title == 'search') {
            let fontSize = 14;
            if (Platform.OS == 'android') {
                fontSize = 12;
            }
            return (
                <View style={[styles.searchBar, {width: ScreenWidth - 40, marginLeft: 40}]}>
                    <Icon
                        name={'ios-search'}
                        size={20}
                        style={styles.searchIcon}
                        color={Colors.black}
                    />
                    <TextInput
                        style={[styles.textInput, {fontSize: fontSize}]}
                        placeholder={searchPlaceholder}
                        autoFocus={true}
                        onChangeText={route.sp.onChangeText}
                        onSubmitEditing={route.sp.onSubmitEditing}
                        clearButtonMode={'while-editing'}
                    />
                </View>
            )
        } else {
            return (
                <Text style={[styles.navBarText,
                      styles.navBarTitleText,
                      {width: 250, height: 40, textAlign: 'center'}]}
                      numberOfLines={1}>
                    {title}
                </Text>
            );
        }
    },
};

const routes = {
    navigator(initialRoute) {
        return (
            <Navigator
                initialRoute={{id: initialRoute}}
                renderScene={this.renderScene}
                configureScene={(route) => {
                          return route.sceneConfig||Navigator.SceneConfigs.FloatFromRight;
                        }}
                navigationBar={
					<Navigator.NavigationBar
						routeMapper={NavigationBarRouteMapper}
						style={styles.navBar}
                        navigationStyles={NavigatorNavigationBarStyle}
					/>
				}
                tabLabel={this._tabObjForRoute(initialRoute)}
            />
        );
    },

    _tabObjForRoute(routeName) {
        let tab = {tabName: 'Feed', iconName: 'ios-home'};
        switch (routeName) {
            case 'feed':
                tab = {tabName: 'Feed', iconName: 'ios-home'};
                break;
            case 'explore':
                tab = {tabName: 'Explore', iconName: 'ios-flame'};
                break;
            case 'famous':
                tab = {tabName: 'Famous', iconName: 'ios-people'};
                break;
            case 'me':
                tab = {tabName: 'Me', iconName: 'ios-person'};
                break;
        }

        return tab;
    },

    renderScene(route, navigator) {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (navigator && navigator.getCurrentRoutes().length > 1) {
                navigator.pop();
                return true;
            }
            return false;
        });

        switch (route.id) {
            case 'user':
                return <UserComponent user={route.obj} navigator={navigator}/>;
            case 'web':
                return (
                    <GHWebComponent
                        webURL={route.obj.html}
                        param={route.obj}
                        navigator={navigator}
                        route={route}/>
                );
            case 'userList':
                return <UserListComponent userListURL={route.obj.url} navigator={navigator}/>;
            case 'login':
                return (
                    <LoginComponent
                        navigator={navigator}
                        nextPromise={route.nextPromiseFunc}
                    />
                )
            case 'org':
                return <OrgComponent navigator={navigator} org={route.obj}/>;
            case 'feed':
                return <FeedComponent navigator={navigator}/>;
            case 'famous':
                return <FamousComponent navigator={navigator}/>;
            case 'explore':
                return <ExploreComponent navigator={navigator}/>;
            case 'me':
                return <PersonalComponent navigator={navigator}/>;
            case 'settings':
                return <SettingsComponent navigator={navigator}/>;
            case 'repos':
                return <RepoListComponent navigator={navigator} repoListURL={route.obj.url}/>;
            case 'search':
                return <SearchComponent navigator={navigator} route={route}/>;
            case 'showcase':
                return <ShowCaseItem navigator={navigator} showcase={route.obj}/>;
            case 'editprofile':
                return <EditProfileComponent navigator={navigator} route={route}/>;
        }

        return null;
    }
}

const styles = StyleSheet.create({
    messageText: {
        fontSize: 17,
        fontWeight: '500',
        padding: 15,
        marginTop: 50,
        marginLeft: 15,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#CDCDCD',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '500',
    },
    navBar: {
        backgroundColor: 'white',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 0.5,
    },
    navBarText: {
        fontSize: 16,
        marginVertical: 10,
    },
    navBarTitleText: {
        color: Colors.blue,
        fontWeight: '500',
        marginVertical: 11,
    },
    navBarLeftButton: {
        paddingLeft: 10,
        width: 40,
        height: 40,
    },
    navBarRightButton: {
        paddingRight: 10,
    },
    navBarButtonText: {
        color: Colors.blue,
    },
    scene: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#EAEAEA',
    },
    searchBar: {
        padding: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: ScreenWidth - 10,
        height: 35,
        // borderWidth: 1,
        // borderColor: Colors.borderColor,
        borderRadius: 4,
        margin: 5,
        backgroundColor: Colors.backGray,
    },
    searchIcon: {
        marginLeft: 3,
        marginRight: 3,
        width: 20,
        height: 20
    },
    textInput: {
        fontSize: 14,
        alignSelf: 'stretch',
        flex: 1,
        color: Colors.black,
    },
});

module.exports = routes;
