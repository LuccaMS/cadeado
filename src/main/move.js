import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Alert, Image } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";

import { getDeviceName } from "react-native-device-info";


import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface MoveScreenProps {
    navigation: any;
}

export default class Move extends Component {
  constructor(props : MoveScreenProps) {
    super(props);

    this.props = props;

    this.manager = new BleManager();

    this.phone_name = null;

    this.device = null;

    this.count = 0;

    this.device_service_uuid = null;

    this.device_characteristic_uuid = null;

    this.device_mac = null;

    this._list = [];

    this.state = {
      isMoving: false,
      error: null,
      scanning: false,
      appState: "idle",
      data: "0",
    };
  }

  clean_values(){
    this._list = [];
    this.device_characteristic_uuid = null;
    this.device_service_uuid = null;
    this.count = 0;
    this.setState({ appState: "idle" });
    this.setState({ scanning: false });
    this.setState({ error: null });
    this.setState({ data: "0" });
    this.setState({ isMoving: false });
    this.phone_name = null;
  }

  componentDidMount() {
    this.clean_values();
    getDeviceName().then((name) => {
      this.phone_name = name;
    }
    );
  }

  componentWillUnmount() {
    if (this.device != null) {
      this.cancelConnection();
      this.clean_values();
    }
    this.clean_values();
  }

  request(aux_state) {
    const {token, others} = this.props.route.params;

    let service_UUID = this.device_service_uuid;
    let characteristic_UUID = this.device_characteristic_uuid;
    let phone_name = this.phone_name;
    let device_name = this.device.name;
    let device_mac = this.device.id;
    let state = aux_state;

    let data = {
      serviceUUID: service_UUID,
      characteristicUUID: characteristic_UUID,
      state: state,
      smartphone_name: phone_name,
      esp_name: device_name,
      esp_mac: device_mac,
    };

    //we have to send a post request to http://matheuskolln.pythonanywhere.com/user/log
    fetch("http://matheuskolln.pythonanywhere.com/user/log", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-tokens" : token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        
      }
      )
      .catch((error) => {
        console.error(error);
      }
      );
  }


  async sendNotification() {
    this.request("notificating");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alerta",
        body: "O cadeado está em movimento",
        data: { data: "O cadeado está em movimento" },
      },
      trigger: { seconds: 3 },
    });

  }

  async scan_async() {
    await this.manager.startDeviceScan(null, null, (error, device) => {
      this.setState({ scanning: true });

      if (error) {
        this.setState({ error: error });
        this.setState({ scanning: false });
        console.log(error.message)
        if(error.message == "BluetoothLE is powered off")
        {
            Alert.alert("Bluetooth desligado", "Por favor ligue o bluetooth");
        }
        else{
            Alert.alert("Erro", error.message);
        }
        this.manager.stopDeviceScan();
        return;
      }

      if (device.name == "ESP32-Cadeado") {
        this.device = device;
        this.setState({ scanning: false });
        this.manager.stopDeviceScan();
        this.connect();
        return device;
      }
    });
  }

  scan() {
    this.setState({ error: null });
    this.device = null;
    this.setState({ scanning: false });
    this.setState({ data: "0" });

    //We are going to exeute the scan_async function, if the this.device continues null for 5 seconds, we are going to show an alert with the timeout
    this.scan_async().then(() => {
      setTimeout(() => {
        if (this.device == null && this.state.error == null) {
          Alert.alert("Timeout", "O cadeado não foi encontrado");
          this.setState({ scanning: false });
          this.manager.stopDeviceScan();
        }
      }, 2000);
    });
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

      const device =
        await this.manager.discoverAllServicesAndCharacteristicsForDevice(
          this.device.id,
        ); //discover all services and characteristics

      const services = await device.services(); //get all services

      const charPromises = services.map(async (service) => {
        const characteristics = await service.characteristics();
        return characteristics;
      }); //get all promises for all characteristics

      const characteristics = await Promise.all(charPromises); //wait for all characteristics to be discovered

      const writableCharacteristics = characteristics //filter for writable characteristics, which is our ESP32 characteristic
        .map((characteristic) =>
          characteristic.filter((c) => c.isWritableWithResponse),
        )
        .filter((c) => c.length > 0);
      
      this.device_service_uuid = writableCharacteristics[0][0].serviceUUID;

      this.device_characteristic_uuid = writableCharacteristics[0][0].uuid;

      console.log("service: " + this.device_service_uuid);
      console.log("characteristic: " + this.device_characteristic_uuid);

      this.request("connected");

      this.device.monitorCharacteristicForService(
        this.device_service_uuid,
        this.device_characteristic_uuid,
        (error, characteristic) => {
          if (error) {
            this.setState({ error: error });
            console.log(error);
            return;
          }

          let data = Buffer.from(characteristic.value, "base64").toString(
            "ascii",
          );
          console.log(data);
          this.setState({ data: data });

          //data ? this.setState({ isMoving: true }) : this.setState({ isMoving: false });

          //the _list is a array that will hold every data received from the device
          //because of the wat the sensor works, if the device will send a 1, a 0 and a 1 again
          //so if we find this pattern a certain number of times, we can assume that the device is moving
          //and send a notification to the user
          data
            ? this.setState({ isMoving: true })
            : this.setState({ isMoving: false });
          this._list.push(data ? 1 : 0);

          //we want to find the pattern 1, 0, 1 5 times to send the notification,

          if (this._list.length > 25) {
            for (let i = 0; i < this._list.length; i++) {
              if (
                this._list[i] == 1 &&
                this._list[i + 1] == 0 &&
                this._list[i + 2] == 1
              ) {
                this.count++;
                if (this.count == 10) {
                  break;
                }
              }
            }
          }

          if (this.count >= 10) {
            this.sendNotification();
            this.count = 0;
            this._list = [];
          }
        },
      );
    } else {
      this.setState({ appState: "disconnected" });
      console.log("Não foi possível estabelecer a conexão");
    }
  }

  cancelConnection() {
    //console.log("disconnecting");
    this.setState({ appState: "disconnecting" });
    this.request("disconnecting");
    this.device.cancelConnection();
    //console.log("disconnected");
    this.setState({ appState: "disconnected" });
    this.device = null;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.appState !== "connected" ? (
          <View style={styles.disconectedLockView}>
            <Image
              style={styles.lock}
              source={require("./imgs/cadeado-aberto.png")}
            />
            <Text style={styles.disconnectedText}>
              Nenhum cadeado conectado!
            </Text>
          </View>
        ) : (
          <View style={styles.connectedLockView}>
            <View style={styles.textButtonView}>
              <Text styles={styles.connectedText}>Cadeado conectado</Text>
              <Button
                style={styles.button}
                title="Desconectar"
                onPress={() => this.cancelConnection()}
                disabled={
                  this.state.appState != "connected" &&
                  this.state.appState != "monitoring"
                }
                //changhe the color of the button if the state is connected
                color={
                  this.state.appState == "connected" || "monitoring"
                    ? "#D06E6E"
                    : "grey"
                }
              />
            </View>
            <Image
              source={require("./imgs/cadeado-fechado.png")}
              style={styles.lock}
            />
          </View>
        )}
        <View style={styles.buttons}>
          {this.state.appState !== "connected" ? (
            <Button
              style={styles.button}
              title="Conectar"
              //the functions is a async
              onPress={() => this.scan()}
              disabled={
                this.state.appState == "connected" ||
                this.state.appState == "monitoring"
              }
              //change the color of the button to gray if the state is connected
              color={this.state.appState == "connected" ? "gray" : "#9177BC"}
            />
          ) : (
            <></>
          )}
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
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EDF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  buttons: {
    backgroundColor: "#EDF1F1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50%",
    marginBottom: 30,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#EDF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  lock: {
    width: 100,
    height: 100,
  },
  disconnectedText: {
    fontSize: 20,
    color: "#FFFFFF",
    paddingTop: 20,
    color: "black",
  },
  button: {
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  disconectedLockView: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 200,
  },
  connectedLockView: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderColor: "black",
    backgroundColor: "grey",
    borderRadius: 20,
    paddingHorizontal: 50,
    paddingVertical: 20,
    marginTop: 200,
  },
  connectedText: {
    color: "#9177BC",
    padding: 20,
  },

  textButtonView: {
    flexDirection: "column",
    padding: 20,
  },
});



