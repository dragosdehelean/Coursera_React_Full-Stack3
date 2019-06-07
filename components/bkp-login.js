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
         key => encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
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
   fetch(path, requestConfig)
      //   fetch(path)
      .then(
         response => {
            if (response.ok) {
               return response;
            } else {
               var error = new Error(
                  "Error " + response.status + ": " + response.statusText
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
      .then(response => response.json())
      .then(data => {
         // ToastAndroid.show(data, ToastAndroid.LONG);
         console.log(data);
      })
      .catch(error => {
         console.log(error);
         // ToastAndroid.show(error, ToastAndroid.LONG);
      });
};
