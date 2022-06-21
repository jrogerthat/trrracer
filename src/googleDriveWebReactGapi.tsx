import React, { useEffect, useState } from 'react';
import { useGoogleApi } from 'react-gapi'


export function MyDriveComponent() {

  const [stateGapi, setStateGapi] = useState<any>(null);

  const gapi = useGoogleApi({
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ],
    scopes: [
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
  })

  // gapi?.client.setApiKey('AIzaSyBm0miOjNmOHvAO0uQNdWZNH9X20I-gshQ');
useEffect(() => {
  gapi?.load('client', () => {
    gapi?.client.setApiKey('AIzaSyBm0miOjNmOHvAO0uQNdWZNH9X20I-gshQ');
    gapi?.client.load('youtube', 'v3', () => {
      setStateGapi({ gapiReady: true });
    });
  });

}, [stateGapi])
  

  console.log('gapi', gapi)

  if (!gapi) {
    return <div>Some loading screen</div>
  }
  return null;

  // access the Drive API per gapi.client.drive
}