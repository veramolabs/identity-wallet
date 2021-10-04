import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ColorContextProvider } from "./colorContext";
import { ContextProvider } from "./context";
import { Navigation } from "./navigation";
import {
    createNavigationContainerRef,
    NavigationContainer,
} from "@react-navigation/native";
import RNBootSplash from "react-native-bootsplash";

const navigationRef = createNavigationContainerRef();

const App = () => {
    return (
        <NavigationContainer
            onReady={() => RNBootSplash.hide({ fade: true })}
            ref={navigationRef}>
            <SafeAreaProvider>
                <ColorContextProvider>
                    <ContextProvider>
                        <Navigation />
                        <Toast ref={(ref) => Toast.setRef(ref)} />
                    </ContextProvider>
                </ColorContextProvider>
            </SafeAreaProvider>
        </NavigationContainer>
    );
};

// const styles = StyleSheet.create({
//     sectionContainer: {
//         marginTop: 32,
//         paddingHorizontal: 24,
//     },
//     sectionTitle: {
//         fontSize: 24,
//         fontWeight: "600",
//     },
//     sectionDescription: {
//         marginTop: 8,
//         fontSize: 18,
//         fontWeight: "400",
//     },
//     highlight: {
//         fontWeight: "700",
//     },
// });

export default App;
