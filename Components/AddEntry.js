import React, { Component } from "react";
import { Text, View, TouchableOpacity,StyleSheet } from "react-native";
import { getMetricMeta, timeToString , getDailyReminderValue} from "../utils/helpers";
import Stepper from "./Stepper";
import Slider from "./Slider";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";

import TextButton from "./TextButton";
import {submitEntry, removeEntry} from '../utils/api';
import { connect } from "react-redux";
import {addEntry} from '../actions/index';
import { purple, white } from "../utils/colors";
const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity  style={

        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn

      } onPress={onPress}>
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
};

 class AddEntry extends Component {
  state = {
    run: 0,
    sleep: 0,
    bike: 0,
    eat: 0,
    swim: 0,
  };
  increament = (metric) => {
    const { max, step } = getMetricMeta(metric);
    this.setState((state) => {
      const count = state[metric] + step;
      return { ...state, [metric]: count > max ? max : count };
    });
  };
  decreament = (metric) => {
    const { max, step } = getMetricMeta(metric);
    this.setState((state) => {
      const count = state[metric] - step;
      return { ...state, [metric]: count < 0 ? 0 : count };
    });
  };
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }));
  };
  submit = () => {
    const key = timeToString();
    const entry = this.state;
    //update redux
this.props.dispatch(addEntry({
  [key]:entry
}))

    this.setState({
      run: 0,
      sleep: 0,
      bike: 0,
      eat: 0,
      swim: 0,
    });
    //navigate to home
submitEntry({key,entry})
    //save to db

    //clear local notif
  };
  reset = () => {
    const key = timeToString();
    this.props.dispatch(addEntry({
      [key]:getDailyReminderValue()
    }))

    removeEntry(key)
  };
  render() {
    const metaInfo = getMetricMeta();

    if (this.props.alreadyLogged)
      return (
        <View style={styles.center }>
          <Ionicons              name={Platform.OS === "ios" ? "ios-happy" : "md-happy"}  size={100} />
          <Text>You already logged your information for today</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>Reset</TextButton>
        </View>
      );
    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />

        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];
          return (
            <View style={styles.row} key={key}>
              {getIcon()}
              {type === "slider" ? (
                <Slider
                  value={value}
                  onChange={(value) => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <Stepper
                  value={value}
                  onIncrement={() => this.increament(key)}
                  onDecrement={() => this.decreament(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  AndroidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30
  }
});
const mapStateToProps=(state)=>{
  const key=timeToString()
  return{
    alreadyLogged:state && state[key]&& typeof state[key].today==='undefined'
  }
}
export default connect(mapStateToProps)(AddEntry)