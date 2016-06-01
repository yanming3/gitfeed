'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../commonComponents/Colors';


const ICON_SIZE = 30;

export default class SettingsCell extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        iconName: PropTypes.string,
        iconColor: PropTypes.string,
        settingName: PropTypes.string,
    };
    static defaultProps = {
        iconName: 'ios-cog',
        iconColor: Colors.blue,
        settingName: 'Settings',
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    render() {
        return (
            <TouchableHighlight
                underlayColor={Colors.lightGray}
                style={styles.userTouch}
                onPress={this.props.onPress}>
                <View style={styles.user}>
                    <Icon
                        name={this.props.iconName}
                        size={ICON_SIZE}
                        style={styles.arrow}
                        color={this.props.iconColor}/>
                    <View style={styles.nameInfo}>
                        <Text style={styles.name}>
                            {this.props.settingName}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    userTouch: {
        marginTop: 20,
    },
    user: {
        padding: 8,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EDECF1',
    },
    nameInfo: {
        flexDirection: 'column',
        marginLeft: 0,
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        color: 'black',
        fontSize: 17,
    },
    arrow: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        marginRight: 10,
    },
    settings: {
        height: 44,
    },
});
