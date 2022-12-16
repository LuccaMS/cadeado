import react from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

import Login from "./login_page";
import Move from "./main/move";
import Logs from "./logs_page/logs";
import Menu from "./menu/menu";

const {Navigator, Screen} = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Navigator initialRouteName="Login">
                   <Screen name="Login" component={Login}></Screen>
                   <Screen name="Move" component={Move}></Screen>
                   <Screen name="Logs" component={Logs}></Screen>
                   <Screen name="Menu" component={Menu}></Screen>
            </Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;