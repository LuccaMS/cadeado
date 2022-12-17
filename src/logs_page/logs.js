import react, {useState } from "react";

import { View, Text, Button, StyleSheet, Alert, TextInput } from "react-native";

interface LogsScreenProps {
    navigation: any;
}

export default function Logs(props: LogsScreenProps) {
    const token = props.route.params.token;

    const [name, setName] = useState("");

    const mapLogs = () => {

       let logs = [];

       let filtered_logs = []

       for (let i = 0; i < props.route.params.logs.logs.length; i++) {
           let log = {
               datetime: props.route.params.logs.logs[i].datetime,
               esp_name: props.route.params.logs.logs[i].esp_name,
               state: props.route.params.logs.logs[i].state,
               smartphone_name: props.route.params.logs.logs[i].smartphone_name,
           }
           logs.push(log);
       }

       //we will now filter the logs to the ones that match the name the user typed
       for (let i = 0; i < logs.length; i++) {
           if (logs[i].esp_name == name) {
               filtered_logs.push(logs[i]);
           }
       }

       //if the array is empty, there are no logs for the name the user typed
       //so we will alert the user
         if (filtered_logs.length == 0) {
                Alert.alert("Não há logs para o cadeado digitado");
                return
            }

       for(let i = 0; i < filtered_logs.length; i++) {
              console.log(filtered_logs[i]);
         }

        props.navigation.navigate("Show", {data: filtered_logs});
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Logs</Text>
            <Text style={styles.text}>Digite o nome do cadeado</Text>
            <TextInput
                style={styles.input}
                onChangeText={name => setName(name)}
                value={name}
            />
            <Button title="Buscar" onPress={mapLogs} />
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
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

