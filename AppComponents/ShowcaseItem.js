'use strict';

import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
} from 'react-native';

import CommonComponents from '../commonComponents/CommonComponents';
import Colors from '../commonComponents/Colors';
import RefreshListView from './RefreshListView';
import ExploreCell from './ExploreCell';


const TREND_BASE_PATH = 'http://trending.codehub-app.com/v2/showcases/';

export default class ShowcaseItem extends Component {
    static propTypes = {
        showcase: PropTypes.object,
    }

    reloadPath = ()=> {
        return  TREND_BASE_PATH + this.props.showcase.slug;
    }

    handleReloadData = (value)=> {
        return new Promise((resolve, reject)=> {
            value.json().then(responseData=> {
                resolve(responseData.repositories);
            }).catch(err=> {
                console.log(err);
                reject(err);
            });
        });
    }
    renderRepo = (rowData, sectionID, rowID, highlightRow)=> {
        return <ExploreCell key={rowID} trendRepo={rowData} navigator={this.props.navigator}/>;
    }

    renderHeader = ()=> {
        const showcase = this.props.showcase;
        return (
            <View style={styles.header}>
                <Image
                    style={styles.showcase}
                    source={{uri: showcase.image_url}}
                    resizeMode={'cover'}
                >
                    <Text style={styles.showcaseName}>{showcase.name}</Text>
                </Image>
                <Text style={styles.desc}>
                    {showcase.description}
                </Text>
                {CommonComponents.renderSepLine()}
            </View>
        )
    }

    render() {
        let top = 64;
        if (Platform.OS === 'android') {
            top = 44;
        }
        return (
            <View style={{backgroundColor: 'white', paddingTop: top, flex: 1}}>
                <RefreshListView
                    enablePullToRefresh={false}
                    renderRow={this.renderRepo}
                    reloadPromisePath={this.reloadPath}
                    handleReloadData={this.handleReloadData}
                    navigator={this.props.navigator}
                    renderHeader={this.renderHeader}
                >
                </RefreshListView>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'column',
    },
    desc: {
        margin: 15,
        padding: 10,
        color: Colors.black,
        fontSize: 14,
    },
    showcase: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 65,
        alignItems: 'stretch',
    },
    showcaseName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        margin: 20,
        lineHeight: 20,
    },
});
