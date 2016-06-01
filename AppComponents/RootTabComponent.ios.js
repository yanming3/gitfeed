'use strict';

import React,{Component} from 'react';
import {
    TabBarIOS
} from 'react-native';

const Routes = require('./Routes');


const TABBABIDS = ['feed', 'explore', 'famous', 'me'];

export default class RootTabComponent extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab: TABBABIDS[0],
        };
    }

    render() {
        return (
            <TabBarIOS>
                <Icon.TabBarItem
                    title="Home"
                    iconName="ios-home-outline"
                    selectedIconName="ios-home"
                    title={'Feed'}
                    selected={this.state.selectedTab === TABBABIDS[0]}
                    onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[0],
            });
          }}>
                    {Routes.navigator('feed')}
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="Explore"
                    iconName="ios-flame-outline"
                    selectedIconName="ios-flame"
                    selected={this.state.selectedTab === TABBABIDS[1]}
                    onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[1],
            });
          }}>
                    {Routes.navigator('explore')}
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="Famous"
                    iconName="ios-people-outline"
                    selectedIconName="ios-people"
                    selected={this.state.selectedTab === TABBABIDS[2]}
                    onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[2],
            });
          }}>
                    {Routes.navigator('famous')}
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="Me"
                    iconName="ios-person-outline"
                    selectedIconName="ios-person"
                    selected={this.state.selectedTab === TABBABIDS[3]}
                    onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[3],
            });
          }}>
                    {Routes.navigator('me')}
                </Icon.TabBarItem>
            </TabBarIOS>
        )
    }
}
