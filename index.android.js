'use strict';

import React,{Component} from 'react';

import {
    Text,
    AppRegistry,
} from 'react-native';

//const CODE_PUSH_PRODUCTION_KEY = "7sCNpYjMHV89MyTvVwu5bhvWRQcLE1Z_BgAMb";
//const codePush = require('react-native-code-push');

const Routes = require('./AppComponents/Routes');
const RootTab = require('./AppComponents/RootTabComponent');
const GHService = require('./networkService/GithubServices');
const CommonComponents = require('./commonComponents/CommonComponents');
const OnboardComponent = require('./AppComponents/OnboardComponent');
const LoginComponent = require('./AppComponents/LoginComponent');

const FeedComponent = require('./AppComponents/FeedComponent');


const LoginState = {
    pending: 0,
    onboard: 1,
    unOnboard: 2,
    needLogin: 3,
}

class GitFeedApp extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            userState: LoginState.pending,
        };
    }


    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    componentWillMount = ()=> {
        GHService.queryLoginState()
            .then(value => {
                let lst = LoginState.pending;
                if (value.login.length > 0) {
                    lst = LoginState.onboard;
                } else {
                    lst = LoginState.unOnboard;
                }

                console.log('login userstate is: ' + JSON.stringify(lst));

                this.setState({
                    userState: lst,
                });
            })

        GHService.addListener('didLogout', () => {
            this.setState({
                userState: LoginState.unOnboard,
            });
        });
    }
    componentWillUnmount = ()=> {
        GHService.removeAllListeners('didLogout');
    }

    didOnboard = (user, needLogin)=> {
        let lst = user == null ? LoginState.unOnboard : LoginState.onboard;
        if (needLogin) lst = LoginState.needLogin;
        this.setState({
            userState: lst,
        });
    }

    didLogin = ()=> {
        this.setState({
            userState: LoginState.onboard,
        });
    }

    render() {
        let cp;
        switch (this.state.userState) {
            case LoginState.pending:
            {
                cp = CommonComponents.renderLoadingView();
            }
                break;
            case LoginState.onboard:
            {
                cp = <RootTab />;
            }
                break;
            case LoginState.unOnboard:
            {
                cp = <OnboardComponent didOnboard={this.didOnboard}/>;
            }
                break;
            case LoginState.needLogin:
            {
                cp = <LoginComponent didLogin={this.didLogin}/>;
            }
                break;
        }

        return cp;
    }
}

AppRegistry.registerComponent('GitFeed', () =>GitFeedApp);
