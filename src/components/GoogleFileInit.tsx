import React, { useState } from 'react';
// const {google} = require('googleapis');

// import { useProjectState } from './ProjectContext';
// import {
//   Button,
//   ButtonGroup,
//   Editable,
//   EditableInput,
//   EditablePreview
// } from '@chakra-ui/react';
// import { readFileSync } from '../fileUtil';

let googleCred: any;
const isElectron = process.env.NODE_ENV === 'development';

if(isElectron){
  // googleCred = require('../../assets/google_cred_desktop_app.json');
}

const GoogFileInit = (props: { fileType: string, text:string, entryIndex: number })=> {

  // const {fileType, text, entryIndex} = props;

  // const [{folderPath}, dispatch] = useProjectState();
  // const [showFileCreate, setShowFileCreate] = useState(false);
  // const [googleFileName, setGoogleFileName] = useState(' "I need a name" ');

  // const googleFolderDict = (folder)=> {
  //   if(folder?.includes('EvoBio')){
  //     return '120QnZNEmJNF40VEEDnxq1F80Dy6esxGC'
  //   }else if(folder?.includes('Derya')){
  //     return '1-tPBWWUaf7CzNYRyVOqfZvmYg3I4r9Zg';
  //   }else if(folder?.includes('Jen')){
  //     return '1-SzcYM_4-ezaFaFguQTJ0sOCtW2gB0Rp'
  //   }else{
  //     alert('google folder not found');
  //   }
  // }

  // let test = googleFolderDict(folderPath);

  // console.log('TESTING', test)
  
  // const saveGoogleFile = () => {
    
  //   createGoogleFile(googleFileName);
  //   setShowFileCreate(false);
    
  // };

  // async function testGoog(){
  //   const oAuth2Client = new google.auth.OAuth2(googleCred.installed.client_id, googleCred.installed.client_secret, googleCred.installed.redirect_uris[0])
  //   // const token = await readFile('token.json')
  //   const token = await readFileSync('token.json');
  //   oAuth2Client.setCredentials(JSON.parse(token))
  //   console.log('init client');
  //   console.log('auth Instance', google)
  //   console.log('token', oAuth2Client.credentials)
  //   let drive = google.drive({version: 'v3', auth: oAuth2Client});

  //   drive.files.list({
  //     q:"parents in '0AFyqaJXF-KkGUk9PVA' and trashed = false", 
  //     fields:"nextPageToken, files(id, name)",
  //     supportsAllDrives: true,
  //     includeItemsFromAllDrives: true,
  //   }).then((folder)=> console.log('folder',folder))

    
  // }

  // async function createGoogleFile(name : string){
  
  //   const oAuth2Client = new google.auth.OAuth2(googleCred.installed.client_id, googleCred.installed.client_secret, googleCred.installed.redirect_uris[0])
  //   // const token = await readFile('token.json')
    
  //   const token = await readFileSync('token.json');
  //   oAuth2Client.setCredentials(JSON.parse(token))
    
  //   let drive = google.drive({version: 'v3', auth: oAuth2Client});
  
  //   var parentId = googleFolderDict(folderPath);//some parentId of a folder under which to create the new folder
  //   var fileMetadata = {
  //     'name' : name,
  //     'mimeType' : `application/vnd.google-apps.${fileType}`,
  //     'parents': [parentId],
   
  //   };
  //   drive.files.create({
  //     resource: fileMetadata,
  //     supportsAllDrives: true,
  //   }).then(function(response) {
  //     switch(response.status){
  //       case 200:
  //         var file = response.result;
  //         console.log('Created File data google', response, response.data.id);

  //         dispatch({ type: 'CREATE_GOOGLE_IN_ENTRY', fileType: fileType, name: name, fileId: response.data.id, entryIndex })

  //         break;
  //       default:
  //         console.log('Error creating the folder, '+response);
  //         break;
  //       }
  //   });
  // }

  return(
    <div>{'test'}</div>
    // <div>
    //  {showFileCreate ? (
    //     <>
          
    //         <Editable
    //         defaultValue={googleFileName}
    //         startWithEditView={true}
    //         onChange={(val)=> setGoogleFileName(val)}
    //         w="420px"
    //         boxShadow="xs" p="4" rounded="md" bg="white"
    //         >
    //       <EditablePreview 
    //       // display="inline"
    //       border="1px"
    //       borderColor="gray.200"
    //       boxShadow="sm" p="2"
    //       />
    //       <EditableInput 
    //       display="inline"
    //       />
    //       <ButtonGroup display="inline">
    //       <Button 
    //       color="primary" 
    //       display="inline-block" 
    //       onClick={()=> saveGoogleFile()} 
    //       type="button">
           
    //         Create
    //       </Button>
    //       <Button color="red.400" 
    //       onClick={() => {
    //         testGoog();
    //         setShowFileCreate(false)}} 
    //         type="button">
    //         Cancel
    //       </Button>
    //       </ButtonGroup>
    //       </Editable>
    //       {/* <input type="text" onChange={handleChange}/> */}
    //     </>
    //   ) : (
    //     <Button m="3px" 
    //     onClick={()=> {
    //       testGoog();
    //       setShowFileCreate(true)}} 
    //       type="button">
    //       {text}
    //     </Button>
    //   )} 
      
    // </div>
  )
}

export default GoogFileInit;