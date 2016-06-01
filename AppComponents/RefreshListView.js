import React, {Component, PropTypes} from 'react';
import {
    ListView,
    View,
    ActivityIndicatorIOS,
    Navigator,
    ProgressBarAndroid,
    StyleSheet,
    Platform,
    RefreshControl,
} from 'react-native';

import CommonComponents from '../commonComponents/CommonComponents';
import GHService from '../networkService/GithubServices';
import ErrorPlaceholder from '../commonComponents/ErrorPlacehoderComponent';


const LISTVIEWREF = 'listview';
const CONTAINERREF = 'container';

export default class RefreshListView extends Component {
    static propTypes = {
        enablePullToRefresh: PropTypes.bool,
        /**
         * return a reloadPromise path
         */
        reloadPromisePath: PropTypes.func,
        /**
         * return an array of handled data, (value) => {}
         */
        handleReloadData: PropTypes.func,
        /**
         * render the row, like ListView
         */
        renderRow: PropTypes.func,
        /**
         * context object
         */
        context: PropTypes.func,
        /**
         * Error holder (error) => {}
         */
        renderErrorPlaceholder: PropTypes.func,
        /**
         * Max page for a list
         */
        maxPage: PropTypes.number,

        autoReload: PropTypes.bool,

        cacheKey: PropTypes.string
    }

    static defaultProps = {
        autoReload: true
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this._maxPage = this.props.maxPage || -1;
        this._loaded = false;
        this._dataSource = [];
        this._page = 1;
        this._maxPage = -1;
        this._loading = false;
        this._loadPath = null;

        const dataSourceParam = {
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }
        this.state = {
            dataSource: new ListView.DataSource(dataSourceParam),
            loaded: true,
            lastError: {isReloadError: false, error: null},
            isRefreshing: false,
        };
    }

    componentDidMount = ()=> {
        if (this.props.autoReload) {
            if (this.props.cacheKey) {
                GHService.loadCache(this.props.cacheKey).then(result=> {
                    if (result) {
                        this._setNeedsRenderList(JSON.parse(result));
                    }
                }).done(()=> {
                    this.reloadData();
                })
            }
            else{
                this.reloadData();
            }

        }
    }

    reloadDataIfNeed = ()=> {
        const pathChanged = this._loadPath != this.props.reloadPromisePath();
        if (this._dataSource.length == 0 || pathChanged) {
            this.reloadData();
        }
    }

    clearData = ()=> {
        this._dataSource = [];
        this._setNeedsRenderList([]);
        this._page = 1;
        this._maxPage = 1;
        this._loading = false;
    }

    _pageString = (path)=> {
        const testReg = /\w+[?]\w+/;
        if (testReg.test(path)) {
            path += '&page=' + this._page;
        } else {
            path += '?page=' + this._page;
        }

        return path;
    }

    reloadData = ()=> {
        let path = this.props.reloadPromisePath();
        this._loadPath = path;

        if (!path || this._loading) return;

        this._loading = true;
        this.setState({
            lastError: {isReloadError: false, error: null},
            loaded: this.state.dataSource.getRowCount() > 0,
            isRefreshing: true,
        });
        this._dataSource = [];
        this._page = 1;

        path = this._pageString(path);
        let that = this;
        GHService.fetchPromise(path)
            .then(response => {
                // look for the last page
                if (this._maxPage == -1) {
                    const links = response.headers.map.link && response.headers.map.link[0];
                    if (links) {
                        const reg = /page=(\d+)\S+\s+rel="last"/g;
                        const matchs = reg.exec(links);
                        const end = matchs[1];
                        if (end) {
                            this._maxPage = end;
                        }
                    }
                }

                if (response.status > 400) {
                    response.json().then(responseData=> {
                        const needLogin = responseData.message.indexOf('rate') != -1;
                        if (needLogin) {
                            this.props.navigator.push({
                                id: 'login',
                                title: 'API rate need login',
                                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                            });
                        }
                    });
                }
                else {
                    that.props.handleReloadData(response).then(data=> {
                        this._setNeedsRenderList(data);
                        if (this._dataSource.length == 0) {
                            throw new Error('Not Found');
                        }
                    });
                }

            })
            .catch(err => {
                const pError = {
                    loaded: true,
                    lastError: {isReloadError: true, error: err},
                };
                that.props.handleError && this.props.handleError(pError);
                that.setState(pError);
            })
            .done(() => {
                const node = this.refs[LISTVIEWREF];
                if (node && this.props.enablePullToRefresh) {
                }

                this._loading = false;
                this.setState({
                    isRefreshing: false,
                });
            })
    }

    appendPage = ()=> {
        if (this._page > this._maxPage) return;

        this._page++;

        let path = this.props.reloadPromisePath();
        if (!path) return;

        path = this._pageString(path);
        console.log('appendPage path', path);
        const appendPromise = GHService.fetchPromise(path);
        appendPromise
            .then(value => {
                this.props.handleReloadData(value).then(data=> {
                    this._setNeedsRenderList(data);
                });

            })
            .catch(err => {
                this.showError(err);

                const pError = {
                    loaded: true,
                    lastError: {isReloadError: false, error: err},
                };
                this.setState(pError);
                this._page--;

                this.props.handleError && this.props.handleError(pError);
            })
    }

    _setNeedsRenderList = (rdata)=> {
        if (this.props.cacheKey) {
            GHService.saveCache(this.props.cacheKey, rdata);
        }
        this._dataSource.push(...rdata);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this._dataSource),
            loaded: true,
        });
    }

    renderSectionHeader = (sectionData, sectionID) => {
        return null;
    }
    componentDidUpdate = (prevProps, prevState)=> {
        let node = this.refs[LISTVIEWREF];
        if (!node || !this.props.enablePullToRefresh) return;

    }

    render() {
        if (!this.state.loaded) {
            return CommonComponents.renderLoadingView();
        }

        if (this.state.lastError.isReloadError) {
            const error = this.state.lastError.error;
            if (this.props.renderErrorPlaceholder) {
                return this.props.renderErrorPlaceholder(error);
            } else {
                return (
                    <ErrorPlaceholder
                        title={error.message}
                        desc={'Oops, tap to reload'}
                        onPress={this.reloadData}/>
                );
            }
        }

        if (Platform.OS === 'android') {
            return (
                <ListView
                    refreshControl={
                        <RefreshControl
                            style={[{flex: 1}, this.props.style]}
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.reloadData}/>
                        }
                    dataSource={this.state.dataSource}
                    renderRow={this.props.renderRow}
                    removeClippedSubviews={true}
                    renderFooter={this.renderFooter}
                    onEndReached={this.appendPage}
                    scrollRenderAheadDistance={50}
                    renderSectionHeader={this.renderSectionHeader}
                    pageSize={10}
                    initialListSize={10}
                    {...this.props}
                    style={{flex: 1,marginTop:44}}
                >
                </ListView>
            );
        } else if (Platform.OS === 'ios') {
            return (
                <View style={{flex: 1, backgroundColor: 'white'}} ref={CONTAINERREF}>
                    <ListView
                        ref={LISTVIEWREF}
                        dataSource={this.state.dataSource}
                        renderRow={this.props.renderRow}
                        removeClippedSubviews={true}
                        renderFooter={this.renderFooter}
                        onEndReached={this.appendPage}
                        automaticallyAdjustContentInsets={false}
                        contentInset={{top: 0, left: 0, bottom: 49, right: 0}}
                        contentOffset={{x:0, y: 0}}
                        scrollRenderAheadDistance={50}
                        renderSectionHeader={this.renderSectionHeader}
                        pageSize={10}
                        initialListSize={10}
                        {...this.props}
                    />
                </View>
            );
        }
    }

    renderFooter = ()=> {
        const lastError = this.state.lastError;
        console.log("_maxPage is " + this._maxPage + " ,_page is " + this._page + " error is " + lastError.error);
        if (this._maxPage > this._page && !lastError.error) {
            if (Platform.OS === 'android') {
                return (
                    <View style={styles.appendLoading}>
                        <ProgressBarAndroid styleAttr="Small"/>
                    </View>
                );
            } else if (Platform.OS === 'ios') {
                return (
                    <View style={styles.appendLoading}>
                        <ActivityIndicatorIOS size='small'/>
                    </View>
                )
            }
        }
    }
}

var styles = StyleSheet.create({
    appendLoading: {
        flex: 1,
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'
    }
});

