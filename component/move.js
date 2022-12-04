import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

//we want to connect to the device named "ESP32-Cadeado"

export default class Move extends Component {
    constructor(props) {
        super(props);

        this.manager = new BleManager();

        this.device = null;

        this.device_service_uuid = null;

        this.device_characteristic_uuid = null;

        this.state = {
            error: null,
            scanning: false,
            appState: 'idle',
            data : '0'
        };

    }

    componentDidMount() {
        //this.scan();
    }

    componentWillUnmount() {
        if(this.device != null) {
            this.cancelConnection();
        }
    }

    scan(){
        this.manager.startDeviceScan(null, null, (error, device) => {

            this.setState({ scanning: true });

            if (error) {
                this.setState({ error: error });
                console.log(error);
                return;
            }

            if (device.name == "ESP32-Cadeado") {
                this.setState({ scanning: false });

                this.device = device; //now we have the device that we want, so we can stop scanning 

                this.manager.stopDeviceScan();

                this.connect();
            }
        }
        );
    }

    async connect() {
        if (this.device == null) {
            this.setState({ error: "Cadeado não encontrado" });
            Alert.alert("Cadeado não encontrado");
            return;
        }

        this.setState({ appState: "connecting" });

        const connection = await this.manager.connectToDevice(this.device.id);

        let verify = await this.manager.isDeviceConnected(this.device.id);

        if (verify) {
            this.setState({ appState: "connected" });

            console.log("connected");

            const device = await this.manager.discoverAllServicesAndCharacteristicsForDevice(this.device.id); //discover all services and characteristics

            const services = await device.services(); //get all services


            const charPromises = services.map(async (service) => {
                const characteristics = await service.characteristics();
                return characteristics;
            }); //get all promises for all characteristics

            const characteristics = await Promise.all(charPromises); //wait for all characteristics to be discovered

            const writableCharacteristics = characteristics //filter for writable characteristics, which is our ESP32 characteristic
                .map((characteristic) => characteristic.filter((c) => c.isWritableWithResponse))
                .filter((c) => c.length > 0);

            this.device_service_uuid = writableCharacteristics[0][0].serviceUUID;

            this.device_characteristic_uuid = writableCharacteristics[0][0].uuid;


            console.log("service: " + this.device_service_uuid);
            console.log("characteristic: " + this.device_characteristic_uuid);

            this.device.monitorCharacteristicForService(this.device_service_uuid, this.device_characteristic_uuid, (error, characteristic) => {
                if (error) {
                    this.setState({ error: error });
                    console.log(error);
                    return;
                }

                console.log("monitoring");
                
                let data = Buffer.from(characteristic.value, 'base64').toString('ascii');
                console.log(data);
                this.setState({ data: data });
            });
        }
        else{
            this.setState({ appState: "disconnected" });
            Alert.alert("Erro ao conectar com o cadeado");
        }
    }

   cancelConnection() {
        console.log("disconnecting");
        this.setState({ appState: "disconnecting" });
        this.device.cancelConnection();
        console.log("disconnected");
        this.setState({ appState: "disconnected" });
        this.device = null;
    }
 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>BLE TEST</Text>
                </View>
                <View style={styles.buttons}>
                    <Button
                        title="Connect"
                        //the functions is a async
                        onPress={() => this.services = this.scan()}
                        disabled={this.state.appState == "connected" || this.state.appState == "monitoring"}
                        //change the color of the button to gray if the state is connected
                        color={this.state.appState == "connected" ? "gray" : "blue"}
                    />
                    <Button
                        title="Disconnect"
                        onPress={() => this.cancelConnection()}
                        disabled={this.state.appState != "connected" && this.state.appState != "monitoring"}
                        //changhe the color of the button if the state is connected
                        color={this.state.appState == "connected" || "monitoring" ? "red" : "grey"}
                    />
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoText}>{this.state.data}</Text>
                    <Text style={styles.infoText}>{this.state.appState}</Text>
                    <Text style={styles.infoText}>{this.state.scanning ? 'Scanning...' : ''}</Text>
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
});



