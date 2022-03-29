import React, { useState } from 'react';

import {
  Box,
  Flex,
  useColorModeValue,
  Heading,
  Spacer,
  Checkbox,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Editable,
  EditableInput,
  EditablePreview
} from '@chakra-ui/react';

import { FaPlus } from 'react-icons/fa';
import { FileObj, ProjectViewProps } from './types';
import ViewTypeControl from './ViewTypeControl';
import TopTimeline from './TopTimeline';
import FileUpload from './FileUpload';
import { useProjectState } from './ProjectContext';
import QueryBar from './QueryBar';

interface TopbarProps{
  viewType: string;
  setViewType: any;
  reversedOrder: any;
  setReversedOrder: any;
  timeFilter: any;
  setTimeFilter: any;
  newTitle: string;
  setNewTitle: any;
  filteredActivityNames: any;
}

const TopBar = (ProjectPropValues: TopbarProps) => {
  const [{ projectData, filterTags, filterRT }, dispatch] = useProjectState();

  const [defineEvent, setDefineEvent] = useState<boolean>(false);

  console.log('this is reloading', projectData, filterTags, filterRT);

  const {
    viewType,
    setViewType,
    reversedOrder,
    setReversedOrder,
    timeFilter,
    setTimeFilter,
    newTitle,
    setNewTitle,
    filteredActivityNames
  } = ProjectPropValues;

  console.log('viewType', viewType)

  const addEntry = () => {
    dispatch({ type: 'ADD_ENTRY' });
  };

  const saveFiles = (fileList: FileObj[]) => {
    dispatch({ type: 'ADD_FILES', fileList });
  };

  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      flexFlow="row wrap"
      zIndex={1000}
      height={200}
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
      <Spacer />
      <QueryBar artifactData={null} setViewType={setViewType}/>

        <div style={{ float: 'right' }}>
          <ViewTypeControl viewType={viewType} setViewType={setViewType} />
        </div>
      </Flex>
      <Flex h="150px">
        <Box
          backgroundColor="red.100"
          flex={1.1}
          p={10}
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
        >
          {(viewType === 'activity view' || viewType === 'timeline') && (
            <>
              {/* <Button onClick={() => console.log('BUTTON PUSH')}>
                Add events to timeline
              </Button> */}
              <Box>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="filter-artifacts" mb="2">
                    {`    Hide filtered artifacts.`}
                  </FormLabel>
                  <Switch id="filter-artifacts" />
                </FormControl>
              </Box>

              <Box>
                <FormControl display="flex" alignItems="center">
                  <FormLabel>{`Old ---> New`}</FormLabel>
                  <Checkbox
                    checked={reversedOrder}
                    onChange={(e) => setReversedOrder(e.target.checked)}
                  />
                </FormControl>
              </Box>
            </>
          )}
        </Box>
        <Flex flex={4} flexDirection="column">
          <TopTimeline
            defineEvent={defineEvent}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            viewType={viewType}
            filteredActivityNames={filteredActivityNames}
          />
          <Box style={{ width: '100%', display: 'block' }}>
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
              <span>{`${filterRT.title}`}</span>
              <span
                onClick={() => {
                  dispatch({
                    type:'THREAD_FILTER', 
                    filterRT: null
                  });
                }}
                style={{ padding: 5, cursor: 'pointer' }}
              >
                x
              </span>
            </div>
              
            )}
          </Box>
        </Flex>
        {(viewType === 'activity view' || viewType === 'timeline' || viewType === 'overview') && (
          <Box flex="1.8" maxWidth="25%">
            <Flex flexFlow="row wrap" p={5}>
              <Button alignSelf="center" onClick={addEntry} type="button">
                <FaPlus /> Add activity
              </Button>

              <FileUpload
                saveFiles={saveFiles}
                containerStyle={{}}
                msg={
                  <span style={{ fontSize: '11px' }}>
                    Drag and drop some files here, or{' '}
                    <b>click to select files</b>, create a new entry.
                  </span>
                }
              />
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default TopBar;
