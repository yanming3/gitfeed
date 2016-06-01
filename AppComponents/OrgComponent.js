'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
} from 'react-native';

import GHService from '../networkService/GithubServices';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../commonComponents/Colors';
import RefreshListView from './RefreshListView';
import  RepoCell from './RepoCell';
import UserCell from './UserCell';


const ICON_SIZE = 18;

export default class OrgComponent extends Component {
    static propTypes = {
        org: PropTypes.object,
    }

    handleReloadData = (value)=> {
        return value.json();
    }

    reloadReopPath = ()=> {
        const org = this.props.org;
        const apiPath = GHService.apiPath + '/orgs/' + org.login + '/repos';
        return apiPath;
    }

    reloadUserPath = ()=> {
        const org = this.props.org;
        const apiPath = GHService.apiPath + '/orgs/' + org.login + '/members';

        return apiPath;
    }

    renderRepoRow = (rowData, sectionID, rowID, highlightRow)=> {
        return <RepoCell key={rowID} repo={rowData} navigator={this.props.navigator}/>;
    }

    renderUserRow = (rowData, sectionID, rowID, highlightRow)=> {
        return <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>;
    }

    render() {
        let top = 64;
        if (Platform.OS === 'android') {
            top = 44;
        }

        return (
            <View style={{backgroundColor: 'white', marginTop: top, flex: 1}}>
                <AboutComponent user={this.props.org} navigator={this.props.navigator}/>
                <ScrollableTabView>
                    <RefreshListView
                        enablePullToRefresh={false}
                        tabLabel="Repos"
                        renderRow={this.renderRepoRow}
                        reloadPromisePath={this.reloadReopPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                        renderErrorPlaceholder={this.renderRepoError}
                    >
                    </RefreshListView>
                    <RefreshListView
                        enablePullToRefresh={false}
                        tabLabel="Members"
                        renderRow={this.renderUserRow}
                        reloadPromisePath={this.reloadUserPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                        renderErrorPlaceholder={this.renderUserError}
                    >
                    </RefreshListView>
                </ScrollableTabView>
            </View>
        )
    }
};

class AboutComponent extends Component {
    static propTypes = {
        user: PropTypes.object,
    }

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            user: this.props.user,
        };
    }


    onPressEmail = ()=> {
        console.log('press email');
    }

    onPressBlog = ()=> {
        const blog = {
            html: this.state.user.blog,
            title: this.state.user.login + "'s blog"
        }
        this.props.navigator.push({id: 'web', obj: blog})
    }

    componentDidMount = ()=> {
        GHService.fetchPromise(this.props.user.url)
            .then(value => {
                const resUser = JSON.parse(value._bodyInit);
                const detailUser = Object.assign(this.state.user, resUser);
                this.setState({
                    user: detailUser,
                });
            })
    }

    render() {
        const user = this.state.user;

        let userCompany;
        if (user.company) {
            userCompany = (
                <View style={styles.iconTextContainer}>
                    <Icon
                        name='ios-people-outline'
                        size={ICON_SIZE}
                        style={styles.icon}
                        color={Colors.textGray}/>
                    <Text style={styles.profileInfoLocation}>{user.company}</Text>
                </View>
            )
        }

        let userLocation;
        if (user.location) {
            userLocation = (
                <View style={styles.iconTextContainer}>
                    <Icon
                        name='ios-location-outline'
                        size={ICON_SIZE}
                        style={styles.icon}
                        color={Colors.textGray}/>
                    <Text style={styles.profileInfoLocation}>{user.location}</Text>
                </View>
            )
        }

        let userEmail;
        if (user.email) {
            userEmail = (
                <View style={styles.iconTextContainer}>
                    <Icon
                        name='ios-email-outline'
                        size={ICON_SIZE}
                        style={styles.icon}
                        color={Colors.textGray}/>
                    <Text
                        style={styles.profileInfoEmailAndSite}
                        onPress={this.onPressEmail}
                    >{user.email}</Text>
                </View>
            )
        }

        let userBlog;
        if (user.blog) {
            userBlog = (
                <View style={styles.iconTextContainer}>
                    <Icon
                        name='social-rss-outline'
                        size={ICON_SIZE}
                        style={styles.icon}
                        color={Colors.textGray}/>
                    <Text
                        style={styles.profileInfoEmailAndSite}
                        onPress={this.onPressBlog}
                    >{user.blog}</Text>
                </View>
            )
        }

        let userJoined;
        if (user.created_at) {
            const date = new Date(user.created_at).toISOString().slice(0, 10);
            const joined = 'Joined on ' + date;
            userJoined = (
                <View style={styles.iconTextContainer}>
                    <Icon
                        name='ios-clock-outline'
                        size={ICON_SIZE}
                        style={styles.icon}
                        color={Colors.textGray}/>
                    <Text style={styles.profileInfoLocation}>{joined}</Text>
                </View>
            )
        }

        return (
            <View style={[styles.scvContainerStyle]} {...this.props}>
                <View style={styles.profile}>
                    <Image style={styles.profileImage} source={{uri: user.avatar_url}}/>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileInfoName}>{user.name}</Text>
                        <Text style={styles.profileInfoNickName}>{user.login}</Text>
                        {userCompany}
                        {userLocation}
                        {userEmail}
                        {userBlog}
                        {userJoined}
                    </View>
                </View>
            </View>
        )
    }
}
;

var styles = StyleSheet.create({
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        marginRight: 3,
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scvContainerStyle: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    profile: {
        padding: 15,
        flexDirection: 'row',
        alignSelf: 'stretch',
        paddingBottom: 0,
    },
    profileImage: {
        width: 110,
        height: 110,
        backgroundColor: '#f0f8ff',
        borderRadius: 3,
    },
    profileInfo: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        marginLeft: 15,
        justifyContent: 'space-between',
        paddingBottom: 5,
    },
    profileInfoName: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 3,
    },
    profileInfoNickName: {
        color: 'gray',
        fontSize: 12,
        marginBottom: 10,
    },
    profileInfoLocation: {
        color: 'black',
        fontSize: 12,
    },
    profileInfoEmailAndSite: {
        color: Colors.blue,
        fontSize: 12,
    },
});
