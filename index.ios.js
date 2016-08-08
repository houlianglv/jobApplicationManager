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

var t = require('tcomb-form-native');
t.form.Form.stylesheet = require('tcomb-form-native/lib/stylesheets/bootstrap');
var Form = t.form.Form;
///////////////////////////////////////
class Two extends React.Component {
    render(){
      return(
        <View style={{marginTop:100}}>
          <Text style={{fontSize:20}}>Hello From second component</Text>
          <Text>id: {this.props.id}</Text>
        </View>
    )
  } 
}

/*
  The list view of jobs you have applied
*/

class Main extends React.Component {

  constructor(props) {
    super(props);
    var testData = [{"company":"Google","date":"2015-08-07"},
                    {"company":"Facebook","date":"2015-08-07"},
                    {"company":"Airbnb","date":"2015-08-07"},
                    {"company":"Linkedin","date":"2015-08-07"},{"company":"Google","date":"2015-08-07"},
                    {"company":"Facebook","date":"2015-08-07"},
                    {"company":"Airbnb","date":"2015-08-07"},
                    {"company":"Linkedin","date":"2015-08-07"},{"company":"Google","date":"2015-08-07"},
                    {"company":"Facebook","date":"2015-08-07"},
                    {"company":"Airbnb","date":"2015-08-07"},
                    {"company":"Linkedin","date":"2015-08-07"}];
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
    this.state = {
      dataSource: ds.cloneWithRows(testData),
    };
  }

  // componentDidMount() {
  //   var listViewScrollView = this.refs.listView.getScrollResponder();
  //   listViewScrollView.scrollTo({y: 1}); // Hack to get ListView to render fully
  // }

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
    return <Text>Hello World</Text>
  }
  
  render() {
    return (
      <View style={styles.mainContainer}>
        <ListView
          ref="listView"
          dataSource={this.state.dataSource}
          renderRow={() => this.renderRow()}
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
    this.JobApp = t.struct({
      company: t.String,
      title: t.String,
      webLink: t.String,
      applicationDate: t.Date,
      active: t.Boolean,
      notes: t.String
    });
    this.options = {
      fields: {
        company: {
          placeholder: 'Your Company Here'
        },
        title: {
          placeholder: 'Job Title'
        },
        webLink: {
          placeholder: 'Job Link'
        },
        notes: {
          stylesheet: styles.notes
        }
      }
    };
  }

  onPress() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of JobApp
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

