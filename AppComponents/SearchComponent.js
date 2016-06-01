'use strict';
import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';


import GHService from '../networkService/GithubServices';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RefreshListView from './RefreshListView';
import UserCell from './UserCell';
import ErrorPlaceholder from '../commonComponents/ErrorPlacehoderComponent';
import LanguageComponent from './LanguageComponent';
import ExploreCell from './ExploreCell';


export default class SearchComponent extends Component {
    _selectTab = 0;
    _text = '';
    _lvs = [];

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            toggleLanguage: false,
            currentLanguage: null,
        };
    }


    _resetLoadedStatus = ()=> {
        this._lvs.forEach((lv) => {
            lv.clearData();
        })
    }

    onChangeText = (text)=> {
        this._resetLoadedStatus();
        this._text = text;
    }

    onSubmitEditing = ()=> {
        if (this._text.length == 0) return;

        const refreshListView = this._lvs[this._selectTab];
        refreshListView && refreshListView.reloadData();
    }

    onChangeTab = (tab)=> {
        this._selectTab = tab.i;
        const refreshListView = this._lvs[tab.i];
        refreshListView && refreshListView.reloadDataIfNeed();
    }

    onSelectLanguage = (language)=> {
        this.setState({
            toggleLanguage: false,
            currentLanguage: language,
        });

        const refreshListView = this._lvs[this._selectTab];
        refreshListView && refreshListView.reloadData();
    }

    componentWillMount = ()=> {
        const route = this.props.route;
        route.sp = this;
    }

    componentWillUnmount = ()=> {
        const route = this.props.route;
        route.sp = null;
    }

    _appendLanguage = (path)=> {
        const currentLanguage = this.state.currentLanguage;
        if (currentLanguage && currentLanguage !== 'All Languages') {
            path += '+language:' + currentLanguage;
        }

        return path;
    }

    reloadReopPath = ()=> {
        if (this._text.length == 0) return;

        let apiPath = GHService.apiPath;
        apiPath += '/search/repositories?' + 'q=' + this._text;
        apiPath = this._appendLanguage(apiPath);

        return apiPath;
    }

    reloadUserPath = ()=> {
        if (this._text.length == 0) return;

        let apiPath = GHService.apiPath;
        apiPath += '/search/users?' + 'q=' + this._text;
        apiPath = this._appendLanguage(apiPath);

        return apiPath;
    }

    reloadOrgPath = ()=> {
        if (this._text.length == 0) return;

        let apiPath = GHService.apiPath;
        apiPath += '/search/users?' + 'q=' + this._text + '+type:org';
        apiPath = this._appendLanguage(apiPath);

        return apiPath;
    }

    handleReloadData = (value)=> {
        return new Promise((resolve, reject)=> {
            value.json().then(data=> {
                return resolve(data.items);
            })
        });
    }

    renderRepoRow = (rowData, sectionID, rowID, highlightRow)=> {
        return <ExploreCell trendRepo={rowData} navigator={this.props.navigator}/>;
    }

    renderUserRow = (rowData, sectionID, rowID, highlightRow)=> {
        return <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>;
    }

    renderOrgRow = (rowData, sectionID, rowID, highlightRow)=> {
        return <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>;
    }

    renderRepoError = (error)=> {
        let message = error.message;
        if (message == 'Not Found') {
            message = message + ' ' + this._text + ' for repo';
        }
        const reloadData = this._lvs[0] && this._lvs[0].reloadData;

        return (
            <ErrorPlaceholder
                title={message}
                desc={'repo load failed'}
                onPress={reloadData}/>
        );
    }

    renderUserError = (error)=> {
        let message = error.message;
        if (message == 'Not Found') {
            message = message + ' ' + this._text + ' for user';
        }
        const reloadData = this._lvs[1] && this._lvs[1].reloadData;

        return (
            <ErrorPlaceholder
                title={message}
                desc={'user load failed'}
                onPress={reloadData}/>
        );
    }

    renderOrgError = (error)=> {
        let message = error.message;
        if (message == 'Not Found') {
            message = message + ' ' + this._text + ' for org';
        }
        const reloadData = this._lvs[2] && this._lvs[2].reloadData;

        return (
            <ErrorPlaceholder
                title={message}
                desc={'org load failed'}
                onPress={reloadData}/>
        );
    }

    render() {
        let top = 64;
        if (Platform.OS === 'android') {
            top = 44;
        }

        return (
            <View style={[styles.container, {paddingTop: top}]}>
                <LanguageComponent
                    onSelectLanguage={this.onSelectLanguage}
                    currentLanguage={this.state.currentLanguage}/>
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={this.onChangeTab}>
                    <RefreshListView
                        enablePullToRefresh={false}
                        ref={(cp) => this._lvs[0] = cp}
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
                        ref={(cp) => this._lvs[1] = cp}
                        tabLabel="Users"
                        renderRow={this.renderUserRow}
                        reloadPromisePath={this.reloadUserPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                        context={this.searchedText}
                        renderErrorPlaceholder={this.renderUserError}
                    >
                    </RefreshListView>
                    <RefreshListView
                        enablePullToRefresh={false}
                        ref={(cp) => this._lvs[2] = cp}
                        tabLabel="Orgs"
                        renderRow={this.renderUserRow}
                        reloadPromisePath={this.reloadOrgPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                        context={this.searchedText}
                        renderErrorPlaceholder={this.renderOrgError}
                    >
                    </RefreshListView>
                </ScrollableTabView>
            </View>
        )
    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 64,
        backgroundColor: 'white',
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
});
