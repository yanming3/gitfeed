import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';

import GHService from '../networkService/GithubServices';
import GHCell from './GHEventCell';
import RefreshListView from './RefreshListView';
import Colors from '../commonComponents/Colors';
import ErrorPlaceholder from '../commonComponents/ErrorPlacehoderComponent';


export default class FeedComponent extends Component {
    handleReloadData=(response) =>{
        return response.json();
    }

    reloadPath=()=> {
        return GHService.feedsPath;
    }

    renderRow=(rowData, sectionID, rowID, highlightRow) =>{
        return (
            <GHCell key={rowID} ghEvent={rowData} navigator={this.props.navigator}/>
        )
    }

    renderErrorPlaceholder=(error)=> {
        const message = error.message;
        if (message.indexOf('Found') > -1) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTextTitle}>
                        {error.message}
                    </Text>
                    <Text style={styles.errorText}>
                        {'Oops, tap to reload'}
                    </Text>
                    <TouchableOpacity
                        style={styles.reloadText}
                        onPress={this._listView && this._listView.reloadData}>
                        <Text style={styles.errorText}>
                            Reload
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.errorTextTitle,{marginTop:40}]}>
                        Or
                    </Text>
                    <TouchableOpacity
                        style={styles.logout}
                        onPress={() => GHService.logout()}>
                        <Text style={styles.logoutText}>
                            Try Another Account
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <ErrorPlaceholder
                    title={error.message}
                    desc={'Oops, tap to reload'}
                    onPress={this._listView && this._listView.reloadData}/>
            )
        }
    }

    render() {
        let marginTop = 44;
        if (Platform.OS === 'ios') {
            marginTop = 0;
        }

        return (
            <RefreshListView
                ref={(cp)=>this._listView=cp}
                style={{flex: 1, marginTop: marginTop}}
                enablePullToRefresh={true}
                renderRow={this.renderRow}
                reloadPromisePath={this.reloadPath}
                handleReloadData={this.handleReloadData}
                navigator={this.props.navigator}
                contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
                contentOffset={{x:0, y: -64}}
                renderErrorPlaceholder={this.renderErrorPlaceholder}
                cacheKey={'FEEDS_KEY'}
            >
            </RefreshListView>
        );
    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 2,
    },
    errorTextTitle: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
    },
    reloadText: {
        borderColor: Colors.lightGray,
        borderWidth: 1,
        borderRadius: 3,
        marginTop: 20,
        padding: 2,
    },
    logout: {
        marginTop: 40,
        height: 44,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.green,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 30,
        marginRight: 30,
    }
});
