import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AddEntry from "./Components/AddEntry";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from './Reducers';

export default function App() {
  return (
    <View style={{flex:1}}>
      <Provider store={createStore(reducer)}>
        <AddEntry />
      </Provider>
    </View>
  );
}
