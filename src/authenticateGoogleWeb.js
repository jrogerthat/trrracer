import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import * as CREDENTIALS from '../assets/google_web_cred.json';

// const useGoogle = () => {

    
//     useEffect(()=> {
//         console.log(window.google)
//     }, [window.google])

//     return(
//         <div>{"TEST"}</div>
//     )

// };

// export default UseGoogle;

    // const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
    // const [documents, setDocuments] = useState([]);
    // const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
    // const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
    // const [signedInUser, setSignedInUser] = useState();
    // let isLoadingGoogleDriveApi = false;
    // let isFetchingGoogleDriveFiles = false;
    // let isSignedIn = false;

    // const handleChange = (file) => {};

    // const DISCOVERY_DOCS = [
    //     'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    //   ];
    // const SCOPES = [
    //     'https://www.googleapis.com/auth/drive.metadata.readonly',
    //   ];

    // const CLIENT_ID = CREDENTIALS.web['client_id'];
    // const API_KEY = '';

    // let gapiInited = false;
    // let gisInited = false;

    // console.log('gapi',gapi);

    // const listFiles = (searchTerm = null) => {
    //     // setIsFetchingGoogleDriveFiles(true);
    //     isFetchingGoogleDriveFiles = true;
    //     gapi.client.drive.files
    //       .list({
    //         pageSize: 10,
    //         fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
    //         q: searchTerm,
    //       })
    //       .then(function (response) {
    //         isFetchingGoogleDriveFiles = false;
    //         // setIsFetchingGoogleDriveFiles(false);
    //         // setListDocumentsVisibility(true);
    //         const res = JSON.parse(response.body);
    //         console.log('res',res)
    //         // setDocuments(res.files);
    //       });
    //   };
    
    //   /**
    //    *  Sign in the user upon button click.
    //    */
    //   const handleAuthClick = (event) => {
    //     gapi.auth2.getAuthInstance().signIn();
    //   };
    
    //   /**
    //    *  Called when the signed in status changes, to update the UI
    //    *  appropriately. After a sign-in, the API is called.
    //    */
    //   const updateSigninStatus = (isSignedIn) => {
    //     if (isSignedIn) {
    //       // Set the signed in user
    //       setSignedInUser(gapi.auth2.getAuthInstance().currentUser.je.Qt);
    //       isLoadingGoogleDriveApi = false;
    //     //   setIsLoadingGoogleDriveApi(false);
    //       // list files if user is authenticated
    //       listFiles();
    //     } else {
    //       // prompt user to sign in
    //       handleAuthClick();
    //     }
    //   };

    // const initClient = () => {
    //     isLoadingGoogleDriveApi = true;
    //     // setIsLoadingGoogleDriveApi(true);
    //     gapi.client
    //       .init({
    //         apiKey: API_KEY,
    //         clientId: CLIENT_ID,
    //         discoveryDocs: DISCOVERY_DOCS,
    //         scope: SCOPES,
    //       })
    //       .then(
    //         function () {
    //             console.log('gapi signed in', gapi);
    //           // Listen for sign-in state changes.
    //             gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    
    //           // Handle the initial sign-in state.
    //             updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    //         },
    //         function (error) {
    //             console.log(error);
    //         }
    //       );
    //   };

    // // updateSigninStatus(false);
    // gapi.load('client:auth2', initClient);

    // /**
    //  * Callback after the API client is loaded. Loads the
    //  * discovery doc to initialize the API.
    //  */
    // async function intializeGapiClient() {
    //     // await window.gapi.client.init({
    //     //     apiKey: API_KEY,
    //     //     discoveryDocs: DISCOVERY_DOCS,
    //     // });
    //     // gapiInited = true;
    //     console.log('client loaded??', gapiInited, window.gapi.client);
    //     // console.log('gapi loaded??', window.gapi);
    //     gapi.client.init({
    //         'apiKey': API_KEY,
    //         // clientId and scope are optional if auth is not required.
    //         'clientId': CLIENT_ID,
    //         'scope': SCOPES,
    //       }).then(function() {

    //         console.log('init request');
    //         // 3. Initialize and make the API request.
    //         return window.gapi.client.request({
    //           'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
    //         })
    //       }).then(function(response) {
    //         console.log(response.result);
    //       }, function(reason) {
    //         console.log('Error: ' + reason.result.error.message);
    //       });
    // }
    
    // /**
    //  * Callback after api.js is loaded.
    // */
    // function gapiLoaded() {
    //     window.gapi.load('client', intializeGapiClient);
    // }

    // /**
    //  * Callback after Google Identity Services are loaded.
    //  */
    // function gisLoaded() {
    //     tokenClient = window.google.accounts.oauth2.initTokenClient({
    //         client_id: CLIENT_ID,
    //         scope: SCOPES,
    //         callback: '', // defined later
    //     });
    //     gisInited = true;

    //     console.log('gis loaded', gisInited);
        
    // }