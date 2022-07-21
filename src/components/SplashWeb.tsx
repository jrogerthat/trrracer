import React from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Heading,
  UnorderedList,
  IconButton,
  ListItem,
} from '@chakra-ui/react';

import { BiLinkExternal } from 'react-icons/bi';
import { FaFolderOpen, FaPlus } from 'react-icons/fa';

// const { ipcRenderer } = require('electron');

const projectChoices = [
    {name: 'Evo Bio', data: 'evobio'},
    {name: 'tRRRacer meta', data: 'jen'},
    {name: 'Derya', data: 'derya'}
]

const SplashWeb = (props: any) => {
  const { setPath, isDev } = props;

  return (
    <Container>
      <Heading as="h1">Welcome to Trracer!</Heading>
      <p>Open a project :</p>

        <>
        
          <UnorderedList>{
            projectChoices.map((pc, i) => (
                
                <ListItem><IconButton
                icon={<BiLinkExternal />}
                aria-label="Open project"
                onClick={() => {
                    // ipcRenderer.send('openProject', p)
                       setPath(
                        `${
                            isDev ? 'http://localhost:9999' : '.'
                        }/.netlify/functions/download-gdrive-file/?folderName=${pc.data}&fileName=`
                        );
                }}
              />{' '}
              {pc.name}{' '}</ListItem>
            ))}
          </UnorderedList>
        </>

    </Container>
  );
};

export default SplashWeb;
