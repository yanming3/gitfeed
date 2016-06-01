'use strict';
import React,{Component,PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Picker,
    Platform,
    UIManager,
} from 'react-native';

import Colors from '../commonComponents/Colors';
const Languages = require('../commonComponents/LanguageList');

const CONTAINER_REF = 'container';

export default class LanguageComponent extends Component {

    static propTypes = {
        toggleOn: React.PropTypes.bool,
        languageList: React.PropTypes.array,
        onSelectLanguage: React.PropTypes.func,
        currentLanguage: React.PropTypes.string,
    };

    static defaultProps={
        languageList: Languages,
        toggleOn: false,
        currentLanguage: 'All Languages',
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            toggleOn: this.props.toggleOn,
            currentLanguage: this.props.currentLanguage,
        };
    }

    onSelectLanguage = (selectedLanguage)=> {
        if (this.state.currentLanguage == selectedLanguage) {
            this.setState({
                toggleOn: false,
            });

            return;
        }

        this.setState({
            toggleOn: false,
            currentLanguage: selectedLanguage,
        });
        this.props.onSelectLanguage(selectedLanguage);
    }

    render() {
        const languageList = this.props.languageList;
        const selectedLanguage = this.state.currentLanguage || languageList[0];

        if (Platform.OS == 'ios') {
            if (!this.state.toggleOn) {
                return (
                    <TouchableOpacity
                        style={styles.chooseLan}
                        onPress={() => this.setState({
                            toggleOn: true,
                          })}>
                        <Text style={styles.lan}>
                            {selectedLanguage}
                        </Text>
                    </TouchableOpacity>
                );
            } else {
                const pickerHeight = UIManager.RCTPicker.Constants.height;
                return (
                    <View style={{height: pickerHeight}} ref={CONTAINER_REF}>
                        <Picker
                            selectedValue={selectedLanguage}
                            onValueChange={this.onSelectLanguage}
                            mode={'dropdown'}>
                            {this.props.languageList.map((obj, index) => {
                                return (
                                    <Picker.Item key={index} label={obj} value={obj}/>
                                );
                            })}
                        </Picker>
                        <TouchableOpacity
                            style={styles.chooseLan}
                            onPress={() => this.setState({
                                toggleOn: false,
                              })}>
                            <Text style={styles.lan}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        } else if (Platform.OS == 'android') {
            return (
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={this.onSelectLanguage}
                    mode={'dropdown'}
                    style={{width: 150, height: 40}}>
                    {this.props.languageList.map((obj, index) => {
                        return (
                            <Picker.Item key={index} label={obj} value={obj}/>
                        );
                    })}
                </Picker>
            )
        }
    }
}

const styles = StyleSheet.create({
    lan: {
        color: Colors.blue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    chooseLan: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderBottomWidth: 0.5,
        borderColor: Colors.backGray,
    },
});

