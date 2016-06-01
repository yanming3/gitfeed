'use strict';

import {
    AsyncStorage,
    Navigator,
    DeviceEventEmitter,
} from 'react-native';

const config = require('../config');
const base64 = require('base-64');


const API_PATH = 'https://api.github.com';
const AUTH_URL_PATH = API_PATH + '/authorizations';
const GH_USER_KEY = 'GH_USER_KEY';
const SHOW_CASE_PATH = 'http://trending.codehub-app.com/v2/showcases';
const SHOW_CASE_KEY = "SHOW_CASE";

const EMPTY_TOKEN = {
    id: '',
    token: ''
};
const EMPTY_USER = {
    login: '',
    password: '',
    avatar: '',
    userId: '',
    url: '',
    tokenInfo: EMPTY_TOKEN,
};
let GLOBAL_USER = EMPTY_USER;

/*
 User has two state:
 1. onboard (just enter username)
 2. login (will has the accessToken)
 */
export default class GithubService {

    static get apiPath() {
        return API_PATH;
    }

    static get feedsPath() {
        return GithubService.apiPath + '/users/' + GLOBAL_USER.login + '/received_events';
    }

    static get famousPath() {
        return GithubService.apiPath + '/search/users?q=';
    }

    static loadCache(cacheKey) {
        return AsyncStorage.getItem(cacheKey);
    }

    static saveCache(cacheKey, obj) {
        return AsyncStorage.setItem(cacheKey, JSON.stringify(obj));
    }

    static loadShowCasesWithCache() {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(SHOW_CASE_KEY)
                .then(result => {
                    if (result) {
                        console.log("find showCases in cache");
                        resolve(JSON.parse(result));
                    }
                    else {
                        console.log("no find showCases in cache,do network query!");
                        fetch(SHOW_CASE_PATH)
                            .then(response=>response.json()).then(responseData=> {
                            resolve(responseData);
                        }).catch(err=> {
                            reject(err);
                        });
                    }
                })
                .catch(err => {
                    console.error('loadShowCasesWithCache error: ', err);
                    reject(err);
                });
        });
    }


    static queryLoginState() {
        return (
            AsyncStorage.getItem(GH_USER_KEY)
                .then(result => {
                    if (result) {
                        console.log('user in cache is:', result);
                        GLOBAL_USER = JSON.parse(result);
                    }
                    return GLOBAL_USER;
                })
                .catch(err => {
                    console.error('queryLoginState error: ', err);
                })
        );
    }

    static onboard(username) {
        const path = GithubService.apiPath + '/users/' + username.trim();
        const validPromise = this.fetchPromise(path);
        return validPromise.then(response => {
            console.log("onboard response is:", response);

            const status = response.status;
            const isValid = status < 400;
            response.json().then(
                responseData=> {
                    if (isValid) {
                        GLOBAL_USER.login = responseData.login;
                        GLOBAL_USER.avatar = responseData.avatar_url;
                        GLOBAL_USER.userId = responseData.id;
                        GLOBAL_USER.url = responseData.url;
                        Object.assign(GLOBAL_USER, responseData);
                        this._setNeedSaveGlobalUser();
                        return GLOBAL_USER;
                    }
                    else {
                        GLOBAL_USER.login = username;
                        const bodyMessage = responseData.message;
                        throw new Error(bodyMessage);
                    }
                }
            );

        });
    }

    static isLogined() {
        return GithubService._isOnboard() && GLOBAL_USER.tokenInfo.token.length > 0;
    }

    static login(name, pwd) {
        const bytes = name.trim() + ':' + pwd.trim();
        const encoded = base64.encode(bytes);
        let that = this;
        return (
            fetch(AUTH_URL_PATH, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + encoded,
                    'User-Agent': 'GithubFeed',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    'client_id': config.GithubClientId,
                    'client_secret': config.GithubClientSecret,
                    'scopes': config.scopes,
                    'note': 'not abuse'
                })
            })
                .then(response=> {
                    console.log("login response is:", response);
                    const isValid = response.status < 400;
                    response.json(responseData=> {
                        if (isValid) {
                            GLOBAL_USER.Login = name;
                            GLOBAL_USER.password = pwd;
                            GLOBAL_USER.url = responseData.url;
                            GLOBAL_USER.tokenInfo = {id: responseData.id, token: responseData.token};
                            return that.getUserInfo(GLOBAL_USER.Login);
                        } else {
                            throw new Error(responseData.message);
                        }
                    });

                })
        );
    }

    static getUserInfo(name) {
        const path = GithubService.apiPath + '/users/' + name.trim();
        let that = this;
        return fetch(path, {
            headers: this.tokenHeader(),
        }).then(response=> {
            console.log("query user response is:", response);
            const status = response.status;
            const isValid = status < 400;
            response.json().then(responseData=> {
                if (isValid) {
                    GLOBAL_USER.login = responseData.login;
                    GLOBAL_USER.avatar = responseData.avatar_url;
                    GLOBAL_USER.userId = responseData.id;
                    GLOBAL_USER.url = responseData.url;
                    Object.assign(GLOBAL_USER, responseData);

                    return that._setNeedSaveGlobalUser();
                }
            });
        }).catch(err=> {
            console.error("query user error:", err);
        });
    }

    static logout(cb) {
        fetch(AUTH_URL_PATH + '/' + GLOBAL_USER.tokenInfo.id, {
            method: 'DELETE',
            headers: this.tokenHeader()
        }).then(response=> {
            GLOBAL_USER = EMPTY_USER;
            AsyncStorage.removeItem(GH_USER_KEY);

            cb && cb();

            DeviceEventEmitter.emit('didLogout');
        })
            .catch(err => {
                console.error('logout err is: ', err);
            });
    }

    static tokenHeader() {
        let tHeader = {
            'User-Agent': config.userAgent,
            'Accept': 'application/vnd.github.v3+json'
        }
        if (this.isLogined()) {
            tHeader.Authorization = 'token ' + GLOBAL_USER.tokenInfo.token;
        }
        return tHeader;
    }


    static checkNeedLoginWithPromise(promiseFunc, navigator) {
        if (!this.isLogined()) {
            navigator.push({
                id: 'login',
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                title: 'Action need login',
                nextPromiseFunc: promiseFunc,
            });
        } else {
            return promiseFunc();
        }
    }

    static currentUser() {
        return GLOBAL_USER;
    }

    static fetchPromise(url, method = 'GET') {
        return fetch(url, {
            method: method,
            headers: this.tokenHeader(),
        });
    }

    static repoStarQuery(repo, action) {
        const path = GithubService.apiPath + '/user/starred/' + repo;
        const method = action || 'GET';
        return this.fetchPromise(path, method);
    }

    static repoWatchQuery(repo, action) {
        let path = GithubService.apiPath + '/repos/' + repo + '/subscription';
        const method = action || 'GET';

        if (method != 'GET') {
            path = GithubService.apiPath + '/user/subscriptions' + '/' + repo;
        }
        return this.fetchPromise(path, method);
    }

    static userFollowQuery(targetUser, action) {
        let path = GithubService.apiPath + '/users/' + GLOBAL_USER.login + '/following' + targetUser;
        const method = action || 'GET';
        if (this.isLogined() || method !== 'GET') {
            path = API_PATH + '/user/following/' + targetUser;
        }
        return this.fetchPromise(path, method);
    }


    static starredRepos(username) {
        if (username.length == 0) {
            console.error('username is empty!', username);
            return;
        }
        const path = GithubService.apiPath + '/' + username + '/starred';
        return this.fetchPromise(path);
    }

    static starredReposCount(username) {
        const path = GithubService.apiPath + '/users/' + username + '/starred?per_page=1';
        return this.fetchPromise(path)
            .then(value => {
                const status = value.status;
                let count = '';
                if (status < 400) {
                    const links = value.headers.map.link && value.headers.map.link[0];
                    if (links) {
                        const reg = /&page=(\d+)\S+\s+rel="last"/g;
                        const matchs = reg.exec(links);
                        const end = matchs[1];
                        if (end) {
                            console.log('end page is', end);
                            count = end;
                        }
                    }
                }

                return count;
            })
    }

    static getNotifications() {
        if (!this.isLogined()) return;

        return this.fetchPromise(GithubService.apiPath + '/notifications');

    }

    static addListener(type, listener) {
        DeviceEventEmitter.addListener(type, listener);
    }

    static removeAllListeners(type) {
        DeviceEventEmitter.removeAllListeners(type);
    }

    static _isOnboard() {
        return GLOBAL_USER.login.length > 0;
    }

    _setNeedSaveGlobalUser() {
        return AsyncStorage.setItem(GH_USER_KEY, JSON.stringify(GLOBAL_USER));
    }
}