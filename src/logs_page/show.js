import react from "react";

import { View, Text, Button, StyleSheet, Alert, TextInput } from "react-native";
import Table from "./table";

interface ShowScreenProps {
    navigation: any;
}

export default function Show(props: ShowScreenProps) {
    const data = props.route.params.data;
    
    //before rendering we will remove all instaces of the esp_name, as it its the same


    return (
        <Table data={data} />
    );
}

