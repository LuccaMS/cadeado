import react from "react";
import { View, Text, Button,StyleSheet,TouchableOpacity } from "react-native";

interface MenuScreenProps {
    navigation: any;
}

export default function Menu(props: MenuScreenProps) {
    const {token, others} = props.route.params;

    const logout = () => {
        console.log("handleLogout");
        props.navigation.navigate("Login");
    };

    const move = () => {
        console.log("handleMove");
        props.navigation.navigate("Move", {token: token});
    };

    const logs = () => {
        console.log("handleLogs");
        props.navigation.navigate("Logs", {token: token});
    };
    //we are going to use touchable opacity to make the buttons because its easier to style, they will be in a column
    //and have the #9177bc color
    return (
        <View style={styles.container}>
            <Text>
                {token}
            </Text>
            <TouchableOpacity style={styles.button} onPress={move}>
                <Text style={styles.buttonText}>Ir para o cadeado</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={logs}>
                <Text style={styles.buttonText}>Log dos dados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Deslogar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#9177bc",
    },
    buttonText: {
        color: "white",
        fontSize: 20,
    },
});


