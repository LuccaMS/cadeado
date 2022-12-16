import react from "react";

import { View, Text, Button, StyleSheet } from "react-native";

interface LogsScreenProps {
    navigation: any;
}

export default function Logs(props: LogsScreenProps) {
    return (
        <View style={styles.container}>
            <Text>Logs</Text>
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
});