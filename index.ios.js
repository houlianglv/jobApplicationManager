import React, { Component, PropTypes } from 'react';
import { 
  AppRegistry,
  ListView,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from 'react-native';

var MyView = React.createClass({
   getInitialState: function() {
    var testData = [{"company":"Google","date":"2015-08-07"},
                    {"company":"Facebook","date":"2015-08-07"},
                    {"company":"Airbnb","date":"2015-08-07"},
                    {"company":"Linkedin","date":"2015-08-07"}];
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    return {
      dataSource: ds.cloneWithRows(testData),
    };
  },
  
  componentDidMount() {
    var listViewScrollView = this.refs.listView.getScrollResponder();
    listViewScrollView.scrollTo(1); // Hack to get ListView to render fully
  },
  
  renderRow(rowData) {
    return <JobRow {...rowData} style={styles.row} />
  },

  render() {
    return (
      <ListView
        ref="listView"
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
});

var JobRow = React.createClass({
  render() {
    return (
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.text}>{this.props.date}, {this.props.company}</Text>
        </View>
      </View>
    );
  }
});
  
var jobmanager = React.createClass({
  handleNavigationRequest() {
    console.log("add new job app");
    this.refs.nav.push({
      title: "Second Page",
      component: SecondPage
    });
  },

  render: function() {
    return (
      <NavigatorIOS
      ref="nav"
      style={styles.container}
      initialRoute={{
        component: MyView,
        title: 'JobApplication Manager',
        passProps: { myProp: 'foo' },
        rightButtonTitle: 'New',
        onRightButtonPress: () => this.handleNavigationRequest()
      }}
    />
    );
  }
});

var SecondPage = React.createClass({
  _handleChangePage() {
    this.props.toggleNavBar();
    this.props.navigator.push({
      title: "First Page",
      component: FirstPage,
      passProps: {
        toggleNavBar: this.props.toggleNavBar,
      }
    });

  },

  render() {
    return (
      <View>
        <Text>SecondPage</Text>

        <TouchableWithoutFeedback onPress={this._handleChangePage}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Go to FirstPage</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('jobmanager', () => jobmanager);

