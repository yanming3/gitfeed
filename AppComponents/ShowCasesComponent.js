import React, {Component,PropTypes} from 'react';

import {
    ListView,
    View,
    ActivityIndicatorIOS,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    RecyclerViewBackedScrollView,
    AsyncStorage,
} from 'react-native';

import Colors from '../commonComponents/Colors';
import ErrorPlaceholder from '../commonComponents/ErrorPlacehoderComponent';
import GHService from './../networkService/GithubServices';

class ShowcaseCell extends Component {
    static propTypes = {
        showcase: PropTypes.object,
        height: PropTypes.number,
    };

    onSelectCell = ()=> {
        this.props.navigator.push({id: 'showcase', obj: this.props.showcase});
    }

    render() {
        const showcase = this.props.showcase;

        return (
            <TouchableOpacity
                style={[styles.container, {height: this.props.height}]}
                onPress={this.onSelectCell}
                underlayColor={Colors.lightGray}>
                <Image
                    style={styles.showcase}
                    source={{uri: showcase.image_url}}
                    resizeMode={'cover'}
                >
                    <Text style={styles.showcaseName}>{showcase.name}</Text>
                </Image>
            </TouchableOpacity>
        );
    }
}

export default class ShowCasesComponent extends Component {
    // 构造
    constructor(props) {
        super(props);
        const dataSourceParam = {
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }
        const dataSource = new ListView.DataSource(dataSourceParam);
        // 初始状态
        this.state = {
            dataSource: dataSource,
            lastError: null,
            loading: false,
        };
    }

    reloadData = ()=> {
        if (this.state.loading) {
            return;
        }

        this.setState({
            loading: true,
            lastError: null
        });
        console.log("begin to load showCases data");
        GHService.loadShowCasesWithCache()
            .then(responseData => {
                console.log("showCases data is :", responseData);
                //let cases = this._shuffle(responseData);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                });
            })
            .catch(err => {
                console.error("showcase error:", err);
                this.setState({
                    lastError: err
                });
            })
            .done(() => {
                this.setState({
                    loading: false,
                });
            })
    }

    componentDidMount = ()=> {
        this.reloadData();
    }

    renderRow = (rowData, sectionID, rowID, highlightRow)=> {
        return (
            <ShowcaseCell
                key={rowID}
                showcase={rowData}
                height={this.props.style.height || 120}
                navigator={this.props.navigator}
            />
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', height: 120}}>
                    <ActivityIndicatorIOS size="large"/>
                </View>
            );
        }

        if (this.state.lastError) {
            return (
                <ErrorPlaceholder
                    title={this.state.lastError.message}
                    desc={'Oops, tap to reload'}
                    onPress={this.reloadData}/>
            );
        }

        return (
            <View style={this.props.style}>
                <ListView
                    horizontal={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    automaticallyAdjustContentInsets={true}
                    showsHorizontalScrollIndicator={true}
                    initialListSize={5}
                    pageSize={5}
                    scrollEnabled={true}
                    scrollsToTop={true}
                />
            </View>
        );
    }
};


const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'stretch',
        paddingRight: 0,
    },
    showcase: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        height: 110,
        width: 200,
    },
    showcaseName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0)',
        textAlign: 'center'
    },
});
