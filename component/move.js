import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

//the class move will be the main class of our app, it will be the one that will be called in the App.js

//we are going to show a list of the bluetooth devices that are available, and each device will have a button that will be used to connect to the device
//if the connection is successful, we will show a message that says "connected" and a button that will be used to disconnect from the device
//if the disconnection is successful, we will show a message that says "disconnected" and a button that will be used to connect to the device
//if the connection is not successful, we will show a message that says "connection failed" and a button that will be used to connect to the device
//if the disconnection is not successful, we will show a message that says "disconnection failed" and a button that will be used to disconnect from the device
//if there are no bluetooth devices available, we will show a message that says "no bluetooth devices available"

export default class Move extends Component {
    constructor() {
        super();
        this.manager = new BleManager();
        this.state = {
            info: '',
            devices: []
        }
    }
    
    //we are going to use BleManager.startDeviceScan to scan for bluetooth devices once the component is mounted
    componentDidMount() {
        console.log("Mounting...");
        this.scanAndConnect();
        console.log("Mounted");
    }

    scanAndConnect = () => {
        console.log("Scanning...");
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }
            //we are going to add the device to the devices array if it is not already in the array
            if (this.state.devices.indexOf(device) === -1) {
                this.setState({ devices: [...this.state.devices, device] });
            }
        });
    }

    //we are going to use BleManager.stopDeviceScan to stop scanning for bluetooth devices once the component is unmounted
    componentWillUnmount() {
        console.log("Unmounting...");
        this.manager.stopDeviceScan();
    }

    //now we are going to render a list of the bluetooth devices that are available, if there are no bluetooth devices available, we will show a message that says "no bluetooth devices available"
    // and there is also going to be a button that will be used to scan for bluetooth devices again

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Bluetooth Devices</Text>
                {this.state.devices.length > 0 ? (
                    this.state.devices.map((device, i) => {
                        return (
                            <View key={i} style={styles.device}>
                                <Text style={styles.deviceName}>{device.name}</Text>
                                <Button title="Connect" onPress={() => this.connectToDevice(device)} />
                            </View>
                        )
                    })
                ) : (
                    <Text style={styles.noDevices}>No bluetooth devices available</Text>
                )}
                <Button title="Scan Again" onPress={() => this.scanAndConnect()} />
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    text: {
        fontSize: 16,
        marginBottom: 10
    }
});
    





