var React = require('react');
var ReactNative = require('react-native');
const CommonComponents = require('../commonComponents/CommonComponents');
const Colors = require('../commonComponents/Colors');
const GHRefreshListView = require('./GHRefreshListView');
const ExploreCell = require('./ExploreCell');
const Platform = require('Platform');

const {
    View,
    Text,
    StyleSheet,
    Image,
    } = ReactNative;

const TREND_BASE_PATH = 'http://trending.codehub-app.com/v2/showcases/';

const OrgComponent = React.createClass({
    propTypes: {
        showcase: React.PropTypes.object,
    },

    reloadPath() {
        const path = TREND_BASE_PATH + this.props.showcase.slug;
        console.log('showcase path', path);
        return path;
    },

    handleReloadData(value) {
        value.json().then(responseData=> {
            return responseData.repositories;
        })
    },

    renderRepo(rowData, sectionID, rowID, highlightRow) {
        return <ExploreCell key={rowID} trendRepo={rowData} navigator={this.props.navigator}/>;
    },

    renderHeader() {
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
    },

    render() {
        let top = 64;
        if (Platform.OS === 'android') {
            top = 44;
        }
        return (
            <View style={{backgroundColor: 'white', paddingTop: top, flex: 1}}>
                <GHRefreshListView
                    enablePullToRefresh={false}
                    renderRow={this.renderRepo}
                    reloadPromisePath={this.reloadPath}
                    handleReloadData={this.handleReloadData}
                    navigator={this.props.navigator}
                    renderHeader={this.renderHeader}
                >
                </GHRefreshListView>
            </View>
        )
    }
});

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

module.exports = OrgComponent;
