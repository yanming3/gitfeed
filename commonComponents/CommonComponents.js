import React from 'react';
import {
    View,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
} from 'react-native';

import Colors from './Colors';
import CommonStyles from './CommonStyles';

export default class CommonComponents {
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
