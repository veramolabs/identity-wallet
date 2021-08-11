// Shims
import "./shim";
import "react-native-gesture-handler";

// // Import the crypto getRandomValues shim (**BEFORE** the shims)
// import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

import { AppRegistry } from "react-native";
import App from "./src/index";
import { name as appName } from "./app.json";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Require cycle:"]);

AppRegistry.registerComponent(appName, () => App);
