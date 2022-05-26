import React from 'react';

import {
  Box,
  Flex,
  useColorModeValue,
  Heading,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';

import { FaPlus } from 'react-icons/fa';
import ViewTypeControl from './ViewTypeControl';
import QueryBar from './QueryBar';

interface TopbarProps {
  viewType: string;
  setViewType: any;
  newTitle: string;
  setNewTitle: any;
  filteredActivities: any;
  projectData: any;
  setHideByDefault: (boo: any) => void;
  hideByDefault: Boolean;
  setAddEntrySplash: (boo: any) => void;
  dispatch: (act:any) => void;
  filterTags: any; 
  filterRT: any;
}

const TopBar = (ProjectPropValues: TopbarProps) => {

  const {
    viewType,
    setViewType,
    newTitle,
    setNewTitle,
    filteredActivities,
    projectData,
    setHideByDefault,
    hideByDefault,
    setAddEntrySplash,
    filterTags, 
    filterRT,
    dispatch
  } = ProjectPropValues;

  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      flexFlow="row wrap"
      zIndex={1000}
      height="80px"
    >
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Heading as="h1">
          <Editable
            value={newTitle}
            onChange={(val) => setNewTitle(val)}
            onCancel={() => setNewTitle(projectData.title)}
            onSubmit={(val) => dispatch({ type: 'UPDATE_TITLE', title: val })}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Heading>
        <div style={{ marginLeft: '20px', marginRight:'20px' }}>
          <ViewTypeControl viewType={viewType} setViewType={setViewType} />
        </div>
        
        <QueryBar
          artifactData={null}
          setViewType={setViewType}
          filteredActivities={filteredActivities}
        />

        {(viewType === 'activity view' ||
                  viewType === 'timeline' ||
                  viewType === 'overview') && (
          <div
            style={{
              float:'right',
              fontSize: 24,
              fontWeight: 700,
              textAlign: 'end',
            }}
          >
            <div
            style={{
              display:'inline-block', 
              fontSize:"14px",
              paddingRight:15,
            }}> 
            <FormControl display="flex" alignItems="center" marginBottom={10}>
            <FormLabel
              htmlFor="split-by"
              mb="0"
              textAlign="right"
              fontSize="12px"
            >
              Hide all by default
            </FormLabel>
            <Switch
              id="show-all"
              onChange={(event) => {
              console.log('SPLIT')
              hideByDefault ? setHideByDefault(false) : setHideByDefault(true);
              }}
            />
        </FormControl> 
            </div>
            {
              (filteredActivities.length != projectData.entries.length || !hideByDefault) && (
                <div
                  style={{display:'inline-block', fontSize:"14px", marginRight:15}}
                >{`${filteredActivities.length} Activities Shown  `}</div> 
              )
            }
           
            <Button
              marginLeft="3px"
              alignSelf="end"
              // onClick={addEntry}
              onClick={(event) => setAddEntrySplash(true)}
              type="button"
            >
              <FaPlus /> Add activity
            </Button>
          </div>
          )}
      </Flex>
      <Flex style={{ 
        height: filterTags.length > 0 ? 70 : 0 }}>
        <Flex flex={4} flexDirection="column">
          <Box style={{ width: 'calc(100% - 200px)', display: 'block' }}>
            {filterTags.length > 0 &&
              filterTags.map((t, i) => (
                <div
                  key={`tags-${i}`}
                  style={{
                    display: 'inline-block',
                    margin: 5,
                    backgroundColor: 'gray',
                    color: '#ffffff',
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <span>{`${t}`}</span>
                  <span
                    onClick={() => {
                      dispatch({
                        type: 'UPDATE_FILTER_TAGS',
                        filterTags: filterTags.filter((f) => f != t),
                      });
                    }}
                    style={{ padding: 5, cursor: 'pointer' }}
                  >
                    x
                  </span>
                </div>
              ))}
            {filterRT && (
              <div
                key={`rt-${filterRT.title}`}
                style={{
                  display: 'inline-block',
                  margin: 5,
                  backgroundColor: 'gray',
                  color: '#ffffff',
                  borderRadius: 5,
                  padding: 5,
                }}
              >
              <span>{`Research Thread: ${filterRT.title}`}</span>
              <span
                onClick={() => {
                  dispatch({
                    type: 'THREAD_FILTER',
                    filterRT: null,
                  });
                }}
                style={{ padding: 5, cursor: 'pointer', fontWeight: 700 }}
                >
                  x
                </span>
              </div>
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopBar;
