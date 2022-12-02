import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

//BleManager.start({ showAlert: false });


//we want to connect to the device named "ESP32-Cadeado"

export default class Move extends Component {
    constructor(props) {
        super(props);

        this.manager = new BleManager();

        this.device = null;

        // we will have the state conecting, connected, disconnecting, disconnected
        this.state = {
            info: '',
            scanning: false,
            appState: '',
        };

    }

    //we will use the method this.manager.devices() to get all the devices that are available
    componentDidMount() {
        //this.scan();
    }

    //stopping the connecting if we are umounting the component
    componentWillUnmount() {
        //this.cancelConnection();
    }

    scan() {
        //we will until we find the device we want, so we will use the method this.manager.startDeviceScan(),
        //the name of the device we want to connect is "ESP32-Cadeado"
        console.log("ENTROU NO SCAN");

        //update the states
        this.setState({ scanning: true });
        
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                this.setState({ info: error });
                console.log(error);

                //if the error is that the BLE is powered off, we will ask the user to turn it on
                return;
            }
            if(device.name == "ESP32-Cadeado") {
                this.manager.stopDeviceScan();
                this.device = device;
                this.setState({ scanning: false });
                console.log("device found");
            }
            
            //try to connect to the device
            device.connect()
                .then((device) => {
                    console.log("connected");
                    this.setState({ info: "OK : CONNECTED" });
                    this.setState({ appState: "connected" });
                    
                    //discover all the services and characteristics
                    return device.discoverAllServicesAndCharacteristics();
                })
                .then((device) => {
                    //as we are just testing, we are going to disconnect
                    /*console.log("disconnected");
                    this.setState({ info: "OK : DISCONNECTED" });
                    this.setState({ appState: "disconnected" });
                    this.device.cancelConnection();*/
                    console.log("e agora o que eu façooooo");
                })
                .catch((error) => {
                    console.log(error);
                });

        });
    }

    //functin to cancel the connection with the device
   cancelConnection() {
        console.log("disconnecting");
        this.setState({ info: "OK : DISCONNECTING" });
        this.setState({ appState: "disconnecting" });
        this.device.cancelConnection();
        console.log("disconnected");
        this.setState({ info: "OK : DISCONNECTED" });
        this.setState({ appState: "disconnected" });

    }

    //we will have 3 divs for our style, one is the title, the second will hold the button connect and disconnect,
    //the buttton conect will only work if the state is disconnected, and the button disconnect will only work if the state is connected
    //the third div will show the information on this.state 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>BLE TEST</Text>
                </View>
                <View style={styles.buttons}>
                    <Button
                        title="Connect"
                        onPress={() => this.scan()}
                        disabled={this.state.appState == "connected"}
                        //change the color of the button to gray if the state is connected
                        color={this.state.appState == "connected" ? "gray" : "blue"}
                    />
                    <Button
                        title="Disconnect"
                        onPress={() => this.cancelConnection()}
                        disabled={this.state.appState != "connected"}
                        //changhe the color of the button if the state is connected
                        color={this.state.appState == "connected" ? "red" : "grey"}
                    />
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoText}>{this.state.info}</Text>
                    <Text style={styles.infoText}>{this.state.appState}</Text>
                    <Text style={styles.infoText}>{this.state.scanning ? 'scanning...' : ''}</Text>
                </View>

                <View style={styles.devices}>
                    <Text style={styles.devicesText}>{this.state.peripherals}</Text>
                </View>
            </View>
        );
    }


}

// the main container will be a vertical flexbox
// the title will be a horizontal flexbox
// the buttons will be a horizontal flexbox
// the info will be a horizontal flexbox
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    devices: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});



