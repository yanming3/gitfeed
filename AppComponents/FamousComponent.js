'use strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import RefreshListView from './RefreshListView';
import UserCell from './UserCell';
import LanguageComponent from './LanguageComponent';
import GHService from '../networkService/GithubServices';


const Countries = require('../commonComponents/Countries.json');
const Languages = require('../commonComponents/LanguageList');


export default class FamousComponent extends Component {
    _selectTab = 0;
    _lvs = [];

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        let PLACE_DEFAULT = Countries[Math.floor(Math.random() * Countries.length)];
        this.state = {
            toggleLanguage: false,
            currentLanguage: null,
            togglePlace: false,
            currentPlace: PLACE_DEFAULT,
        };
    }

    _resetLoadedStatus = ()=> {
        this._lvs.forEach((lv) => {
            lv.clearData();
        })
    }

    onChangeTab = (tab)=> {
        this._selectTab = tab.i;
        const refreshListView = this._lvs[tab.i];
        refreshListView && refreshListView.reloadDataIfNeed();
    }

    onSelectPlace = (place)=> {
        this.setState({
            togglePlace: false,
            currentPlace: place,
        });

        this._lvs[this._selectTab].reloadData();
    }

    onSelectLanguage = (language)=> {
        this.setState({
            toggleLanguage: false,
            currentLanguage: language,
        });

        this._lvs[this._selectTab].reloadData();
    }

    _isNotUsingDefaultLanguage = ()=> {
        const currentLan = this.state.currentLanguage;
        return currentLan && currentLan != 'All Languages';
    }

    reloadPlacePath = ()=> {
        let path = GHService.famousPath;
        path += 'location:' + this.state.currentPlace;

        if (this._isNotUsingDefaultLanguage()) {
            path += '+language:' + this.state.currentLanguage;
        }

        path += '&sort=followers';

        return path;
    }

    reloadWorldPath = ()=> {
        let path = GHService.famousPath;

        if (this._isNotUsingDefaultLanguage()) {
            path += '+language:' + this.state.currentLanguage;
            path += '&sort=followers';
        } else {
            path += 'sort=followers';
        }

        return path;
    }

    handleReloadData = (value)=> {
        return new Promise((resolve, reject) => {
            value.json().then(responseData=> {
                resolve(responseData.items);
            }).catch(error=> {
                console.log(error);
                resolve([]);
            })
        });
    }

    renderUserRow = (rowData, sectionID, rowID, highlightRow)=> {
        return <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>;
    }

    render() {
        let scv;
        if (this._isNotUsingDefaultLanguage()) {
            scv = (
                <ScrollableTabView
                    initialPage={0}
                    onChangeTab={this.onChangeTab}>
                    <RefreshListView
                        enablePullToRefresh={true}
                        ref={(cp) => this._lvs[0] = cp}
                        tabLabel={this.state.currentPlace}
                        renderRow={this.renderUserRow}
                        reloadPromisePath={this.reloadPlacePath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                    >
                    </RefreshListView>
                    <RefreshListView
                        enablePullToRefresh={true}
                        ref={(cp) => this._lvs[1] = cp}
                        tabLabel="World"
                        renderRow={this.renderUserRow}
                        reloadPromisePath={this.reloadWorldPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                    >
                    </RefreshListView>
                </ScrollableTabView>
            )
        } else {
            scv = (
                <RefreshListView
                    enablePullToRefresh={true}
                    ref={(cp) => this._lvs[0] = cp}
                    tabLabel={this.state.currentPlace}
                    renderRow={this.renderUserRow}
                    reloadPromisePath={this.reloadPlacePath}
                    handleReloadData={this.handleReloadData}
                    navigator={this.props.navigator}
                >
                </RefreshListView>
            )
        }
        let top = 64;
        if (Platform.OS === 'android') {
            top = 44;
        }

        return (
            <View style={[styles.container, {paddingTop: top}]}>
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <LanguageComponent
                        languageList={Countries}
                        onSelectLanguage={this.onSelectPlace}
                        currentLanguage={this.state.currentPlace}
                    />
                    <LanguageComponent
                        onSelectLanguage={this.onSelectLanguage}
                        languageList={Languages}
                    />
                </View>
                {scv}
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
});
