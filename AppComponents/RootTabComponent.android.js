import React,{Component} from 'react';
import {
    View,
} from 'react-native';


import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './TabBar';
const Routes = require('./Routes');

export default class RootTabComponent extends Component {
    render() {
        return (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <ScrollableTabView
                    renderTabBar={() => <TabBar />}
                    tabBarPosition={'bottom'}>
                    {Routes.navigator('feed')}
                    {Routes.navigator('explore')}
                    {Routes.navigator('famous')}
                    {Routes.navigator('me')}
                </ScrollableTabView>
            </View>
        )
    }
};
