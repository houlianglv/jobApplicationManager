/*
Import deps and libs
*/
import React, { Component, PropTypes } from 'react';
import { 
  AppRegistry,
  ListView,
  Navigator,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';

const t = require('tcomb-form-native');
t.form.Form.stylesheet = require('tcomb-form-native/lib/stylesheets/bootstrap');
const Form = t.form.Form;
const database = require('./db');
const realm = database.realm;
const schema = database.schema;
const dbAndFormMap = {
  string: 'String',
  date: 'Date'
};

/*
  The list view of jobs you have applied
*/

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.loadListView();
  }

  componentWillUpdate() {
    this.loadListView();
  }

  loadListView() {
    var jobs = realm.objects('JobApp');
    console.log("job app number: " + jobs.length);
    var jobsList = [];
    for (let i = 0;i < jobs.length;i++) {
      let job = jobs[i];
      console.log(job.company);
      jobsList.push({
        company: job.company,
        date: job.date,
        position: job.position
      });
    }
    var testData = jobsList;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
    this.state = {
      dataSource: ds.cloneWithRows(testData),
    };
  }

  onPress() {
    alert("YO FROM RIGHT BUTTON");
  }
  
  gotoNext() {
   this.props.navigator.push({
      component: Two,
      passProps: {
        id: 'MY ID',
      },
      onPress: this.onPress,
      rightText: 'ALERT!'
    })
  }

  renderRow(rowData) {
    return (
      <View>
        <Text>{rowData.company}</Text>
        <Text>{rowData.position}</Text>
        <Text>{rowData.date}</Text>
      </View>
    );
  }
  
  render() {
    return (
      <View style={styles.mainContainer}>
        <ListView
          ref="listView"
          dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
        />
      </View>
    );
  }
}

/*

This view is used to add job application.



*/

class AddJobAppView extends React.Component{  

  constructor(props){
    super(props);
    let jobSchema =  schema.JobApp;
    let jobStruct = {};
    for (let key in jobSchema.properties) {
      jobStruct[key] = t[dbAndFormMap[jobSchema.properties[key]]];
    }
    this.JobApp = t.struct(jobStruct);
    this.options = {};
  }

  onPress() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of JobApp
      realm.write(() => {
        realm.create('JobApp', value);
      });
      // back to the list view after write. maybe should in success callback. todo
      this.props.navigator.pop();
    }
  }

  render() {
    return (
      <View style={ styles.mainContainer }>
        <Form
          ref="form"
          type={this.JobApp}
          options={this.options}
        />
        <TouchableHighlight style={styles.saveBtn} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

/*
  The main emtry of the app
*/

class jobmanager extends React.Component {
  
  renderScene(route, navigator) {
    return <route.component {...route.passProps} navigator={navigator} />
  }

  configureScene(route, routeStack) {
    if(route.type == 'Modal') {
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.PushFromRight 
  }

  onPressAdd(route, navigator) {
    // show modal view
    navigator.push({
      component: AddJobAppView,
      passProps: {
        name: "Houliang"
      },
      titleText: 'New Application',
      leftText: 'Cancel',
      type: 'Modal'
    });
  }
  
  render() {    
    return (
      <Navigator
          res="nav"
          configureScene={ this.configureScene }
          style={{flex:1}}
          initialRoute={{
            name: 'Main', 
            component: Main,
            onPress: this.onPressAdd,
            rightText: "Add"
          }}
          renderScene={ this.renderScene }
          navigationBar={
             <Navigator.NavigationBar 
               style={ styles.nav } 
               routeMapper={NavigationBarRouteMapper} />} 
      />
    )
  }
}


var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableHighlight
           underlayColor="transparent"
           onPress={() => { if (index > 0) { navigator.pop(route, navigator) } }}>
          <Text style={ styles.leftNavButtonText }>{route.leftText || 'Back' }</Text>
        </TouchableHighlight>
    )} 
    else { return null }
  },
  RightButton(route, navigator, index, navState) {
    if (route.onPress) return ( <TouchableHighlight
                                onPress={ () => route.onPress(route, navigator) }>
                                <Text style={ styles.rightNavButtonText }>
                                    { route.rightText || 'Right Button' }
                                </Text>
                              </TouchableHighlight> )
  },
  Title(route, navigator, index, navState) {
    return <Text style={ styles.title }>{ route.titleText || 'Job Application' }</Text>
  }
};


/*

 The style sheet of the app

*/

var styles = StyleSheet.create({
  mainContainer: {
    flex: 4, 
    flexDirection: 'column', 
    marginTop:65
  },
  leftNavButtonText: {
    fontSize: 18,
    marginLeft:13,
    marginTop:2
  },
  rightNavButtonText: {
    fontSize: 18,
    marginRight:13,
    marginTop:2
  },
  nav: {
    height: 60,
    backgroundColor: '#efefef'
  },
  title: {
    marginTop:4,
    fontSize:16
  },
  button: {
    height:60, 
    marginBottom:10, 
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveBtn: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize:18,
    color: 'white',
    alignSelf: 'center'
  }
});

/*

 Boot the app

*/

AppRegistry.registerComponent('jobmanager', () => jobmanager);