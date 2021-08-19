// Shims
import "./shim";
import "@zxing/text-encoding";
import "react-native-gesture-handler";
// import "react-native-get-random-values";

import "@ethersproject/shims";

import { AppRegistry } from "react-native";
import App from "./src/index";
import { name as appName } from "./app.json";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Require cycle:"]);

AppRegistry.registerComponent(appName, () => App);
// SQLite.enablePromise(true);
