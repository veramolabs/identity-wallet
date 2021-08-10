// Shims

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

import { AppRegistry } from "react-native";
import App from "./src/index";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
