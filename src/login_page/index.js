import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert
} from "react-native";

import { Buffer } from "buffer";


interface LoginScreenProps {
  navigation: any;
}

export default function Login(props: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //creating a function to deal with the login

  //as fetch doesn't allow us to send a body in a GET request, we are have to 
  //send a field in the header of the request named authentication

  //we haveto concatenate the email and password with a colon and then encode it in base64
  //and then send this value in the field

  const login = () => {

      //const email_teste = "teste@gmail.com"
      //const password_teste = "teste123"
      //let auth = Buffer.from(email_teste + ":" + password_teste).toString("base64");
      //console.log(email,password)
      //console.log(auth)

    let auth = Buffer.from(email + ":" + password).toString("base64");
      fetch("http://matheuskolln.pythonanywhere.com/user", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authentication: auth,
        },
      }).then(response => {
        if (response.status == 200) {
          response.json().then(data => {
            if (data.message == "login successful") {
              //adding the token to the props so that it can be used in the other pages
              props.navigation.navigate("Menu", { token: data.token });
            } else {
              Alert.alert("Usuário ou senha incorretos");
            }
          });
        } else {
          Alert.alert("Usuário ou senha incorretos");
        }
      }
    );
  };

  const register = () => {
    fetch("http://matheuskolln.pythonanywhere.com/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then(response => {
        response.json().then(data => {
          if(data.message == "user has been created before"){
            Alert.alert("Usuário já existe");
          }

          if(data.message == "success"){
            Alert.alert("Usuário cadastrado com sucesso");
            login();
          }
     }).catch(error => {
        Alert.alert("Erro ao cadastrar usuário");
      });  
  });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../login_page/imgs/cadeado.png")}
      />
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="white"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="white"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.loginText}> LOGIN </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={register}>
        <Text style={styles.loginText}> REGISTER </Text>
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
  image: {
    marginBottom: 40,
    width: 200,
    height: 200,
  },
  inputView: {
    backgroundColor: "#9177bc",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    //alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#9177bc",
  },
  loginText: {
    color: "white",
  },
});
