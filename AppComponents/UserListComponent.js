import React,{Component,PropTypes} from 'react';
import {
    Platform,
} from 'react-native';

import RefreshListView from './RefreshListView';
import UserCell from './UserCell';

export default class  UserListComponent extends Component{
  static propTypes={
    userListURL: PropTypes.string,
  }

  handleReloadData=(response)=> {
    const body = response._bodyInit;
    const jsonResult = JSON.parse(body);

    return jsonResult;
  }

  reloadPath=()=> {
    return this.props.userListURL;
  }

  renderRow=(rowData, sectionID, rowID, highlightRow)=> {
    return (
      <UserCell key={rowID} user={rowData} navigator={this.props.navigator}/>
    )
  }

  render() {
    let marginTop = 44;
    if (Platform.OS === 'ios') {
      marginTop = 0;
    }

    return (
      <RefreshListView
        style={{flex: 1, marginTop: marginTop}}
        enablePullToRefresh={true}
        renderRow={this.renderRow}
        reloadPromisePath={this.reloadPath}
        handleReloadData={this.handleReloadData}
        navigator={this.props.navigator}
        contentInset={{top: 64, left: 0, bottom: 49, right: 0}}
        contentOffset={{x:0, y: -64}}
        >
      </RefreshListView>
    );
  }
}
