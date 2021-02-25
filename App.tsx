import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import TrashImg from './trash1.jpg';

const exampleImageUri = Image.resolveAssetSource(TrashImg).uri

//testing the uri for a test image
console.log('Import', TrashImg, exampleImageUri)

// install all of the libraries
const util = require('util');
//const fs = require('react-native-fs');
// const TrainingApi = require("@azure/cognitiveservices-customvision-training");
// const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
//const msRest = require("@azure/ms-rest-js");

//keys based on our own prediciton models created with custom vision (azure)
const trainingKey = "66fcbf62a15e45089011ebb9c286f625";
const predictionKey = "ff6e9dce692a4c51a08c114e17c01cf2";
const predictionResourceId = "/subscriptions/75f37d35-52ac-4647-95f9-384028874035/resourceGroups/H4H/providers/Microsoft.CognitiveServices/accounts/AndrewCamTraining";
const endPoint = "https://westus2.api.cognitive.microsoft.com/customvision/v3.0/Prediction/122b4e1e-bb0b-43fa-b9d2-61f98c346ca3/classify/iterations/Recycle-trash/image"

const publishIterationName = "Iteration 3";
const setTimeoutPromise = util.promisify(setTimeout);

//comments below from the quickstart implementation
//const credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": trainingKey } });
//const trainer = new TrainingApi.TrainingAPIClient(credentials, endPoint);
//const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });
//const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, endPoint);

//testing file
// const testFile = fs.readFileSync(`${sampleDataRoot}/Test/test_image.jpg`);

// const results = predictor.classifyImage(sampleProject.id, publishIterationName, testFile);

const imgContent = 'trash1.jpg';
console.log(imgContent)
// Show results
const options = {
  headers:{
    'Prediction-Key': 'ff6e9dce692a4c51a08c114e17c01cf2',
    'Content-Type': 'application/octet-stream'

  }
}

//testing with blob for potential sending of blob as a post request to custom vision
fetch(exampleImageUri).then(r => r.blob()).then(image => console.log("BLOB",image))


//testing the axios post request
//currently does not return what we want
// async function axiostest(){
//   const imgresponse = await fetch(exampleImageUri)
//   const imgblob = imgresponse.blob()

//   const axiosresponse = await axios.post('https://westus2.api.cognitive.microsoft.com/customvision/v3.0/Prediction/122b4e1e-bb0b-43fa-b9d2-61f98c346ca3/classify/iterations/Recycle-trash/image',
//                    {// Request headers 
//                     //type: "POST",
//                     // Request body
//                     data: imgblob},
//                     options)
//   console.log("Axios",axiosresponse)
// }

// axiostest()


// const App = () => <Text>Hello world</Text>;
// export default App

export default function App() {
  //determining if there is permission to use the camera
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);
useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  //if access
if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref => {
        setCameraRef(ref) ;
  }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'flex-end'
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end'
            }}
            //if the button for the camera is pressed
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignSelf: 'center'}} onPress={async() => {
            if(cameraRef){
              let photo = await cameraRef.takePictureAsync();
              console.log('photo', photo);
              //need to take the photo image uri/binary and use axios post request to recieve a response
              // axios.post('https://westus2.api.cognitive.microsoft.com/customvision/v3.0/Prediction/122b4e1e-bb0b-43fa-b9d2-61f98c346ca3/classify/iterations/Recycle-trash/image',
              //      {// Request headers 
              //       //type: "POST",
              //       // Request body
              //       data: exampleImageUri},
              //       options)
              // .then(response => {
              //   console.log('Response', response.data);
              // }).catch(err => console.log('Error',err));
              
              //future implimentation
              //verify values from response and return 
            }
          }}>
            <View style={{ 
               borderWidth: 2,
               borderRadius:"50%",
               borderColor: 'white',
               height: 50,
               width:50,
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center'}}
            >
              <View style={{
                 borderWidth: 2,
                 borderRadius:"50%",
                 borderColor: 'white',
                 height: 40,
                 width:40,
                 backgroundColor: 'white'}} >
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}