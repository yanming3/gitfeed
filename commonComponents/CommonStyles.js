'use strict';

import {
    StyleSheet,
} from 'react-native';

import Colors from './Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    shadowLine: {
        shadowColor: '#999999',
        shadowOpacity: 0.8,
        shadowRadius: 1,
        shadowOffset: {
            height: 2,
            width: 1
        },
    },

    sepLine: {
        backgroundColor: Colors.backGray,
        height: 0.5,
    },
});