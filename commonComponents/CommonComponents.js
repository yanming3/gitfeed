const React=require('react');
const ReactNative = require('react-native');

const Colors = require('./Colors');
const CommonStyles = require('./CommonStyles');

const {
    View,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    } = ReactNative;

class CommonComponents {
    static renderLoadingView() {
        if (Platform.OS === 'android') {
            return (
                <View style={CommonStyles.container}>
                    <ProgressBarAndroid styleAttr="Inverse"/>
                </View>
            )
        } else if (Platform.OS === 'ios') {
            return (
                <View style={CommonStyles.container}>
                    <ActivityIndicatorIOS size="large"/>
                </View>
            );
        }
    }

    static renderPlaceholder(text, image, onPress) {
        return (
            <View>
            </View>
        )
    }

    static renderSepLine() {
        return (
            <View style={CommonStyles.sepLine}>
            </View>
        )
    }
}

module.exports = CommonComponents;
