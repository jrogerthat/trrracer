import React, { useState } from 'react';
const {google} = require('googleapis');

import { useProjectState } from './ProjectContext';
import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview
} from '@chakra-ui/react';
import { readFileSync } from '../fileUtil';

let googleCred: any;
const isElectron = process.env.NODE_ENV === 'development';

if(isElectron){
  googleCred = require('../../assets/google_cred_desktop_app.json');
}

const GoogFileInit = (props: { fileType: string, text:string, entryIndex: number })=> {

  const {fileType, text, entryIndex} = props;

  const [{folderPath}, dispatch] = useProjectState();
  const [showFileCreate, setShowFileCreate] = useState(false);
  const [googleFileName, setGoogleFileName] = useState(' "I need a name" ');

  const googleFolderDict = (folder)=> {
    if(folder?.includes('EvoBio')){
      return '120QnZNEmJNF40VEEDnxq1F80Dy6esxGC'
    }else if(folder?.includes('Derya')){
      return '1-tPBWWUaf7CzNYRyVOqfZvmYg3I4r9Zg';
    }else if(folder?.includes('Jen')){
      return '1-SzcYM_4-ezaFaFguQTJ0sOCtW2gB0Rp'
    }else{
      alert('google folder not found');
    }
  }

  
  const saveGoogleFile = () => {
    
    createGoogleFile(googleFileName);
    setShowFileCreate(false);
    
  };

  async function getDriveFiles(folderName){
    const oAuth2Client = new google.auth.OAuth2(googleCred.installed.client_id, googleCred.installed.client_secret, googleCred.installed.redirect_uris[0])
   
    const token = await readFileSync('token.json');
    oAuth2Client.setCredentials(JSON.parse(token))
   
    let drive = google.drive({ version: 'v3', auth: oAuth2Client });

    let docs = google.docs({ version:'v1', auth: oAuth2Client });

    console.log('DOCS??', docs);

    var parentId = googleFolderDict(folderName);

    /**
     * HTTP REQUEST FOR BELOW COMMAND FOR GETTING DRIVE LIST
     * 
     * GET https://www.googleapis.com/drive/v3/files?includeItemsFromAllDrives=true&pageSize=1000&q='120QnZNEmJNF40VEEDnxq1F80Dy6esxGC'%20in%20parents%20and%20trashed%20%3D%20false&supportsAllDrives=true&supportsTeamDrives=true&key=[YOUR_API_KEY] HTTP/1.1

        Authorization: Bearer [YOUR_ACCESS_TOKEN]
        Accept: application/json

     */

    let googData: any = { revisionDate: new Date(), };
    let googFileIds: any = {};

    drive.files.list({
      q:`'${parentId}' in parents and trashed = false`,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      supportsTeamDrives: true,
      pageSize: 1000
    }).then((files)=> {
      
      console.log('folder files!!!', files.data.files)

      Promise.all(files.data.files.map(async (m:any) => {
        if(m.mimeType === "application/vnd.google-apps.document"){
         
          let docStuff = await docs.documents.get({
            documentId: m.id
          })
        
          googData[m.id] = docStuff.data;
        }
        googFileIds[m.name] = {googId: m.id}
      }))
      .then(() => {
        dispatch({type: 'UPDATE_GOOG_DOC_DATA', googDocData: googData});
        dispatch({type: 'UPDATE_GOOG_IDS', googFileIds: googFileIds});
      })
    });
  }

  async function createGoogleFile(name : string){
  
    const oAuth2Client = new google.auth.OAuth2(googleCred.installed.client_id, googleCred.installed.client_secret, googleCred.installed.redirect_uris[0])
    
    const token = await readFileSync('token.json');
    oAuth2Client.setCredentials(JSON.parse(token))
    
    let drive = google.drive({version: 'v3', auth: oAuth2Client});
  
    var parentId = googleFolderDict(folderPath);//some parentId of a folder under which to create the new folder
    var fileMetadata = {
      'name' : name,
      'mimeType' : `application/vnd.google-apps.${fileType}`,
      'parents': [parentId],
   
    };
    drive.files.create({
      resource: fileMetadata,
      supportsAllDrives: true,
    }).then(function(response) {
      switch(response.status){
        case 200:
          var file = response.result;
          console.log('Created File data google', response, response.data.id);

          dispatch({ type: 'CREATE_GOOGLE_IN_ENTRY', fileType: fileType, name: name, fileId: response.data.id, entryIndex })

          break;
        default:
          console.log('Error creating the folder, '+response);
          break;
        }
    });
  }

  return(
    <div>
     {showFileCreate ? (
        <>
          <Editable
            defaultValue={googleFileName}
            startWithEditView={true}
            onChange={(val)=> setGoogleFileName(val)}
            w="420px"
            boxShadow="xs" p="4" rounded="md" bg="white"
            >
          <EditablePreview 
            // display="inline"
            border="1px"
            borderColor="gray.200"
            boxShadow="sm" p="2"
          />
          <EditableInput 
            display="inline"
          />
          <ButtonGroup display="inline">
          <Button 
          color="primary" 
          display="inline-block" 
          onClick={()=> {
            
            saveGoogleFile()}} 
            type="button">
            Create
          </Button>
          <Button color="red.400" 
          onClick={() => {
            getDriveFiles(folderPath);
            setShowFileCreate(false)}} 
            type="button">
            Cancel
          </Button>
          </ButtonGroup>
          </Editable>
          {/* <input type="text" onChange={handleChange}/> */}
        </>
      ) : (
        <Button m="3px" 
        onClick={()=> {
          getDriveFiles(folderPath);
          setShowFileCreate(true)}} 
          type="button">
          {text}
        </Button>
      )} 
      
    </div>
  )
}

export default GoogFileInit;

