import React, { Component } from "react";
import {
   View,
   StyleSheet,
   Text,
   ScrollView,
   Image,
   ToastAndroid
} from "react-native";
import { Input, CheckBox, Button, Icon } from "react-native-elements";
import { createBottomTabNavigator } from "react-navigation";
import { baseUrl } from "../shared/baseUrl";
import { SecureStore, Permissions, ImagePicker, ImageManipulator } from "expo";

class LoginTab extends Component {
   constructor(props) {
      super(props);

      this.state = {
         username: "",
         password: "",
         remember: false
      };
   }

   componentDidMount() {
      SecureStore.getItemAsync("userinfo").then(userdata => {
         let userinfo = JSON.parse(userdata);
         if (userinfo) {
            this.setState({ username: userinfo.username });
            this.setState({ password: userinfo.password });
            this.setState({ remember: true });
         }
      });
   }

   static navigationOptions = {
      title: "Login",
      tabBarIcon: ({ tintColor }) => (
         <Icon
            name="sign-in"
            type="font-awesome"
            size={24}
            iconStyle={{ color: tintColor }}
         />
      )
   };

   handleLogin() {
      console.log(JSON.stringify(this.state));
      if (this.state.remember)
         SecureStore.setItemAsync(
            "userinfo",
            JSON.stringify({
               username: this.state.username,
               password: this.state.password
            })
         ).catch(error => console.log("Could not save user info", error));
      else
         SecureStore.deleteItemAsync("userinfo").catch(error =>
            console.log("Could not delete user info", error)
         );
   }

   handleRealLogin = () => {
      // Headers
      let headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      //   headers.append(
      //      "Authorization",
      //      "Basic " + base64.encode(CLIENT_ID + ":" + CLIENT_SECRET)
      //   ); // Basic Access Header

      // Body
      const details = {
         username: this.state.username, // "user_test",
         password: this.state.password, // "devspring",
         grant_type: "password",
         client_id: "kiosk-app",
         client_secret: "09d25c31-978c-4284-9fed-e81e484109f5"
      };

      const formBody = Object.keys(details)
         .map(
            key =>
               encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
         )
         .join("&");

      // Request config
      const requestConfig = {
         method: "POST",
         headers: headers,
         body: formBody
      };

      const path =
         "http://etl-integration-dev.connex.ro:9999/auth/realms/kiosk-bff/protocol/openid-connect/token";

      console.log(requestConfig);

      // Sends request and returns the response resolution/failure after chcking for errors
      //   fetch(path, requestConfig)
      fetch(path, requestConfig)
         .then(
            response => {
            
               if (response.ok) {
                  return response;
               } else {
                  var error = new Error(
                     "Error " +
                        response.status +
                        ": " +
                        response.statusText
                  );
                  error.response = response;
                  throw error;
               }
            },
            error => {
               var errmess = new Error(error.message);
               throw errmess;
            }
         )
         .then(response => {
            return response.json()
            // response.text();
         })
         .then(data => {
            // ToastAndroid.show(data, ToastAndroid.LONG);
            console.log("raspunsul este : ")
            console.log( data);
         })
         .catch(error => {
            console.log(error);
            // ToastAndroid.show(error, ToastAndroid.LONG);
         });
   };

   render() {
      return (
         <View style={styles.container}>
            <Input
               placeholder="Username"
               leftIcon={{ type: "font-awesome", name: "user-o" }}
               onChangeText={username => this.setState({ username })}
               value={this.state.username}
               containerStyle={styles.formInput}
            />
            <Input
               placeholder="Password"
               leftIcon={{ type: "font-awesome", name: "key" }}
               onChangeText={password => this.setState({ password })}
               value={this.state.password}
               containerStyle={styles.formInput}
            />
            <CheckBox
               title="Remember Me"
               center
               checked={this.state.remember}
               onPress={() => this.setState({ remember: !this.state.remember })}
               containerStyle={styles.formCheckbox}
            />
            <View style={styles.formButton}>
               <Button
                  onPress={this.handleRealLogin}
                  title="Login"
                  icon={
                     <Icon
                        name="sign-in"
                        type="font-awesome"
                        size={24}
                        color="white"
                     />
                  }
                  buttonStyle={{
                     backgroundColor: "#512DA8"
                  }}
               />
            </View>
            <View style={styles.formButton}>
               <Button
                  onPress={() => this.props.navigation.navigate("Register")}
                  title="Register"
                  clear
                  icon={
                     <Icon
                        name="user-plus"
                        type="font-awesome"
                        size={24}
                        color="blue"
                     />
                  }
                  titleStyle={{
                     color: "blue"
                  }}
               />
            </View>
         </View>
      );
   }
}

/**
 * REGISTER TAB
 */

class RegisterTab extends Component {
   state = {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      email: "",
      remember: false,
      imageUrl: baseUrl + "images/logo.png"
   };

   static navigationOptions = {
      title: "Register",
      tabBarIcon: ({ tintColor, focused }) => (
         <Icon
            name="user-plus"
            type="font-awesome"
            size={24}
            iconStyle={{ color: tintColor }}
         />
      )
   };

   handleRegister() {
      console.log(JSON.stringify(this.state));
      if (this.state.remember)
         SecureStore.setItemAsync(
            "userinfo",
            JSON.stringify({
               username: this.state.username,
               password: this.state.password
            })
         ).catch(error => console.log("Could not save user info", error));
   }

   getImageFromCamera = async () => {
      const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
      const cameraRollPermission = await Permissions.askAsync(
         Permissions.CAMERA_ROLL
      );

      if (
         cameraPermission.status === "granted" &&
         cameraRollPermission.status === "granted"
      ) {
         let capturedImage = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3]
         });
         if (!capturedImage.cancelled) {
            console.log(capturedImage);
            this.processImage(capturedImage.uri);
         }
      }
   };

   /**
    * Look here for the forth assignment
    */
   getImageFromGallery = async () => {
      const cameraRollPermission = await Permissions.askAsync(
         Permissions.CAMERA_ROLL
      );

      if (cameraRollPermission.status === "granted") {
         let capturedImage = await ImagePicker.launchImageLibraryAsync();
         if (!capturedImage.cancelled) {
            console.log(capturedImage);
            this.processImage(capturedImage.uri);
         }
      }
   };

   processImage = async imageUri => {
      let processedImage = await ImageManipulator.manipulateAsync(
         imageUri,
         [{ resize: { width: 200 } }],
         { format: "png" }
      );
      console.log(processedImage);
      this.setState({ imageUrl: processedImage.uri });
   };

   render() {
      return (
         <ScrollView>
            <View style={styles.container}>
               <View style={styles.imageContainer}>
                  <Image
                     source={{ uri: this.state.imageUrl }}
                     loadingIndicatorSource={require("./images/logo.png")}
                     style={styles.image}
                  />
                  <Button title="Camera" onPress={this.getImageFromCamera} />
                  <Button title="Gallery" onPress={this.getImageFromGallery} />
               </View>
               <Input
                  placeholder="Username"
                  leftIcon={{ type: "font-awesome", name: "user-o" }}
                  onChangeText={username => this.setState({ username })}
                  value={this.state.username}
                  containerStyle={styles.formInput}
               />
               <Input
                  placeholder="Password"
                  leftIcon={{ type: "font-awesome", name: "key" }}
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                  containerStyle={styles.formInput}
               />
               <Input
                  placeholder="First Name"
                  leftIcon={{ type: "font-awesome", name: "user-o" }}
                  onChangeText={lastname => this.setState({ firstname })}
                  value={this.state.firstname}
                  containerStyle={styles.formInput}
               />
               <Input
                  placeholder="Last Name"
                  leftIcon={{ type: "font-awesome", name: "user-o" }}
                  onChangeText={lastname => this.setState({ lastname })}
                  value={this.state.lastname}
                  containerStyle={styles.formInput}
               />
               <Input
                  placeholder="Email"
                  leftIcon={{ type: "font-awesome", name: "envelope-o" }}
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                  containerStyle={styles.formInput}
               />
               <CheckBox
                  title="Remember Me"
                  center
                  checked={this.state.remember}
                  onPress={() =>
                     this.setState({ remember: !this.state.remember })
                  }
                  containerStyle={styles.formCheckbox}
               />
               <View style={styles.formButton}>
                  <Button
                     onPress={() => this.handleRegister()}
                     title="Register"
                     icon={
                        <Icon
                           name="user-plus"
                           type="font-awesome"
                           size={24}
                           color="white"
                        />
                     }
                     buttonStyle={{
                        backgroundColor: "#512DA8"
                     }}
                  />
               </View>
            </View>
         </ScrollView>
      );
   }
}

const styles = StyleSheet.create({
   container: {
      justifyContent: "center",
      margin: 20
   },
   imageContainer: {
      flex: 1,
      flexDirection: "row",
      margin: 20,
      justifyContent: "space-between"
   },
   image: {
      margin: 10,
      width: 80,
      height: 60
   },
   formInput: {
      margin: 20
   },
   formCheckbox: {
      margin: 20,
      backgroundColor: null
   },
   formButton: {
      margin: 60
   }
});

const Login = createBottomTabNavigator(
   {
      Login: LoginTab,
      Register: RegisterTab
   },
   {
      tabBarOptions: {
         activeBackgroundColor: "#9575CD",
         inactiveBackgroundColor: "#D1C4E9",
         activeTintColor: "#ffffff",
         inactiveTintColor: "gray"
      }
   }
);

export default Login;
