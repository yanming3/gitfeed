'use strict';

import React ,{Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import RefreshListView from './RefreshListView';
import LanguageComponent from './LanguageComponent';
import ShowCasesComponent from './ShowCasesComponent';
import ExploreCell from './ExploreCell';


const TrendLanguages = require('../commonComponents/TrendLanguages.json');
const ICON_SIZE = 12;
const BASE_TRENDING_PATH = 'http://trending.codehub-app.com/v2/trending';

export default class  ExploreComponent extends Component{


    // 构造
      constructor(props) {
        super(props);
        // 初始状态
          this. _selectTab=0;
          this._lvs=[];
        this.state = {
            currentLanguage: null,
        };
      }

    _resetLoadedStatus=()=> {
        this._lvs.forEach((lv) => {
            lv.clearData();
        })
    }

    onSelectLanguage=(language) =>{
        this.setState({
            currentLanguage: language,
        });

        const refreshListView = this._lvs[this._selectTab];
        refreshListView && refreshListView.reloadData();
    }

    onChangeTab=(tab)=> {
        this._selectTab = tab.i;
        const refreshListView = this._lvs[tab.i];
        refreshListView && refreshListView.reloadDataIfNeed();
    }

    _getPath=(desc)=> {
        let path = BASE_TRENDING_PATH + '?since=' + desc;
        const currentLanguage = this.state.currentLanguage;
        if (currentLanguage && currentLanguage != 'All Languages') {
            path = path + '&language=' + this.state.currentLanguage.toLowerCase();
        }

        return path;
    }

    reloadDailyPath=()=> {
        return this._getPath('daily');
    }

    reloadWeeklyPath=()=> {
        return this._getPath('weekly');
    }

    reloadMonthlyPath=()=> {
        return this._getPath('monthly');
    }

    handleReloadData=(value)=> {
        return value.json();
    }

    renderRepo=(rowData, sectionID, rowID, highlightRow)=> {
        return <ExploreCell key={rowID} trendRepo={rowData} navigator={this.props.navigator}/>;
    }

    componentDidMount = ()=> {
       this.onChangeTab({i:0});
    }
    render() {
        let paddingTop = 64;
        if (Platform.OS == 'android') {
            paddingTop = 44;
        }
        return (
            <View style={{backgroundColor: 'white', paddingTop: paddingTop, flex: 1}}>
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                    <ShowCasesComponent style={styles.showcase} navigator={this.props.navigator}/>
                    <LanguageComponent languageList={TrendLanguages}
                                       onSelectLanguage={this.onSelectLanguage}
                    />
                </View>
                <ScrollableTabView
                    onChangeTab={this.onChangeTab} initialPage={0}>
                    <RefreshListView
                        enablePullToRefresh={true}
                        ref={(cp) => this._lvs[0] = cp}
                        tabLabel="Daily"
                        renderRow={this.renderRepo}
                        reloadPromisePath={this.reloadDailyPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                        autoReload={true}
                    >
                    </RefreshListView>
                    <RefreshListView
                        enablePullToRefresh={true}
                        ref={(cp) => this._lvs[1] = cp}
                        tabLabel="Weekly"
                        renderRow={this.renderRepo}
                        reloadPromisePath={this.reloadWeeklyPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                        autoReload={false}
                    >
                    </RefreshListView>
                    <RefreshListView
                        enablePullToRefresh={true}
                        ref={(cp) => this._lvs[2] = cp}
                        tabLabel="Monthly"
                        renderRow={this.renderRepo}
                        reloadPromisePath={this.reloadMonthlyPath}
                        handleReloadData={this.handleReloadData}
                        navigator={this.props.navigator}
                        autoReload={false}
                    >
                    </RefreshListView>
                </ScrollableTabView>
            </View>
        )
    }
};

const styles = StyleSheet.create({
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
    showcase: {
        height: 120,
    },
    poplular: {
        padding: 5,
    },
});
