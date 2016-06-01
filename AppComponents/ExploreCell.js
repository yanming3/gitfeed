'use strict';
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    TouchableOpacity,
} from 'react-native';

import CommonComponents from '../commonComponents/CommonComponents';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../commonComponents/Colors';
const ICON_SIZE = 12;

export default class ExploreCell extends Component {
    static propTypes = {
        trendRepo: React.PropTypes.object,
    };

    onPressCell = ()=> {
        let targetRepo = this.props.trendRepo;

        if (targetRepo) {
            targetRepo.html = 'https://github.com/' + targetRepo.full_name + '/blob/master/README.md';
            targetRepo.title = targetRepo.name;
            console.log('ExploreCell repo', targetRepo.html);
            this.props.navigator.push({id: 'web', obj: targetRepo});
        }
    }

    openAuthor = ()=> {
        const repo = this.props.trendRepo;
        const user = repo.owner;

        if (user) {
            const type = user.type;
            if (type == 'User') {
                this.props.navigator.push({id: 'user', obj: user});
            } else {
                this.props.navigator.push({id: 'org', obj: user});
            }
        }
    }

    render() {
        const repo = this.props.trendRepo;
        return (
            <TouchableHighlight underlayColor={Colors.lightGray} onPress={this.onPressCell}>
                <View style={styles.cellContentView}>
                    <View style={styles.cellUp}>
                        <TouchableOpacity onPress={this.openAuthor}>
                            <Image
                                source={{uri: repo.owner.avatar_url}}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.username} onPress={this.onPressCell}>
                                {repo.full_name}
                            </Text>
                            <Text style={styles.createAt}>{repo.language}</Text>
                        </View>
                        <View style={styles.leftAction}>
                            <Icon
                                name={'ios-star'}
                                size={ICON_SIZE}
                                color={Colors.textGray}
                            />
                            <Text style={styles.actionText}>
                                {repo.stargazers_count}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.textActionContainer} numberOfLines={0}>
                        {repo.description}
                    </Text>
                    {CommonComponents.renderSepLine()}
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    /**
     * ExploreCell
     */
    cellContentView: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch',
    },
    cellUp: {
        padding: 10,
        height: 40,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 15,
    },
    avatar: {
        width: 40,
        height: 40,
        backgroundColor: Colors.backGray
    },
    username: {
        marginLeft: 10,
        color: '#4078C0',
        fontSize: 15,
    },
    textActionContainer: {
        margin: 10,
        marginTop: 7,
        marginBottom: 10,
        marginLeft: 10,
    },
    createAt: {
        marginLeft: 10,
        marginTop: 2,
        fontSize: 11,
        color: '#BFBFBF',
    },
    textDesContainer: {
        margin: 10,
        marginTop: -5,
        marginBottom: 10,
        marginLeft: 25,
        borderStyle: 'dashed',
    },
    leftAction: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightAction: {
        padding: 3,
        backgroundColor: "white",
    },
    actionText: {
        color: Colors.textGray,
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
});
