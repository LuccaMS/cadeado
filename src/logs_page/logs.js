import react, {useState } from "react";

import { View, Text, StyleSheet, Alert, TextInput,TouchableOpacity, Image } from "react-native";

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

       for (let i = 0; i < logs.length; i++) {
           if (logs[i].esp_name == name) {
               filtered_logs.push(logs[i]);
           }
       }

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
            <Image source={require("../logs_page/cadeado.png")} style={styles.image} />
            <View style={styles.input}>
            <TextInput
                style={styles.TextInput}
                onChangeText={name => setName(name)}
                value={name}
                placeholder="Digite o nome do cadeado"
            />
            </View>
            <TouchableOpacity style = {styles.button} onPress={mapLogs}>
                <Text style = {styles.buttonText}>Buscar</Text>
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
        backgroundColor: "#9177bc",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
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
    image: {
        marginBottom: 40,
        width: 200,
        height: 200,
    },

});

