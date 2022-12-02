import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

//BleManager.start({ showAlert: false });


//we want to connect to the device named "ESP32-Cadeado"

export default class Move extends Component {
    constructor(props) {
        super(props);

        this.peripherals = [];

        this.manager = new BleManager();

        this.state = {
            peripherals: [],
            appState: '',
        };
    }

    //we will use the method this.manager.devices() to get all the devices that are available
    componentDidMount() {
        /*this.manager.devices().then((devices) => {
            console.log(devices);
        });*/
        this.scan();

    }

    scan() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }
            if (!this.peripherals.includes(device.name)) {
                this.peripherals.push(device.name);
                this.setState({ peripherals: this.peripherals });
            }

            this.manager.stopDeviceScan();
            console.log(this.peripherals);
        });
    }




    render() {
        return (
            <View style={styles.container}>
                <Text>O MELHOR APLICATIVO DO PLANETA TERRA!</Text>
                <Button title="Scan" onPress={() => this.scan()} />
                {this.state.peripherals.map((peripheral, i) => (
                    <View key={i}>
                        <Text>{peripheral}</Text>
                    </View>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});





