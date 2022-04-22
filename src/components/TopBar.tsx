import React from 'react';

import {
  Box,
  Flex,
  useColorModeValue,
  Heading,
  Spacer,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Tag,
  TagLabel,
} from '@chakra-ui/react';

import { FaPlus } from 'react-icons/fa';
import { FileObj } from './types';
import ViewTypeControl from './ViewTypeControl';
import { useProjectState } from './ProjectContext';
import QueryBar from './QueryBar';

interface TopbarProps {
  viewType: string;
  setViewType: any;
  reversedOrder: any;
  setReversedOrder: any;
  timeFilter: any;
  setTimeFilter: any;
  newTitle: string;
  setNewTitle: any;
  filteredActivityNames: any;
  filteredActivities: any;
  defineEvent: boolean;
  setDefineEvent: (boo: any) => void;
}

const TopBar = (ProjectPropValues: TopbarProps) => {
  const [{ projectData, filterTags, filterRT, researchThreads, threadTypeFilterArray }, dispatch] = useProjectState();

 // console.log('filtersssss', filterRT, researchThreads.research_threads.filter(f => f.title === filterRT.title))

  const {
    viewType,
    setViewType,
    newTitle,
    setNewTitle,
    filteredActivities,
    defineEvent,
    setDefineEvent,
  } = ProjectPropValues;

  const addEntry = () => {
    dispatch({ type: 'ADD_ENTRY' });
  };

  let chosenThread = filterRT ? researchThreads.research_threads.filter(f => f.title === filterRT.title)[0] : null;
 
  let threadTypeGroups = threadTypeFilterArray.map((ty)=> {
    ty.matches = ty.type === 'tags' ?  (filterRT? filterRT.associatedKey : null) : chosenThread?.evidence.filter(f => f.type === ty.type);
    return ty;
  })

  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      flexFlow="row wrap"
      zIndex={1000}
      height="100px"
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
        <QueryBar
          artifactData={null}
          setViewType={setViewType}
          filteredActivities={filteredActivities}
        />

        <div style={{ float: 'right' }}>
          <ViewTypeControl viewType={viewType} setViewType={setViewType} />
        </div>
      </Flex>
      <Flex style={{ height: 70 }}>
        <Box
          style={{ height: 60, padding: '3px' }}
          flex={1.1}
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
        >
          {(viewType === 'activity view' ||
            viewType === 'timeline' ||
            viewType === 'overview') && (
            <>
              <Button
                onClick={() =>
                  defineEvent ? setDefineEvent(false) : setDefineEvent(true)
                }
              >
                Add events to timeline
              </Button>
            </>
          )}
        </Box>
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
        {(viewType === 'activity view' ||
          viewType === 'timeline' ||
          viewType === 'overview') && (
          <div
            style={{
              position: 'fixed',
              top: '70px',
              right: '10px',
              fontSize: 24,
              fontWeight: 700,
              textAlign: 'end',
            }}
          >
            {`${filteredActivities.length} Activities Shown  `}
            <Button
              marginLeft="3px"
              alignSelf="end"
              onClick={addEntry}
              type="button"
            >
              <FaPlus /> Add activity
            </Button>
            {filterRT && (
              <div style={{
                backgroundColor:'#fff',
                paddingTop:'20px',
                paddingLeft:'20px',
                paddingRight:'20px',
                }}>
              {threadTypeGroups.map((tg, i)=> (
                <Tag
                style={{
                  marginRight:'5px',
                  cursor:'pointer',
                  backgroundColor: chosenThread.color,
                  color: chosenThread.color === '#3932a3' ? '#fff' : 'black',
                  opacity: (tg.show && tg.matches.length > 0) ? 1 : 0.4,
                }}
                onClick={()=>{
                  let temp = threadTypeFilterArray.map(m => {
                    if(m.type === tg.type){
                      m.show ? m.show = false : m.show = true;
                    }
                    return m;
                  })
                  dispatch({ type: 'UPDATE_RT_TYPE_SHOWN', threadTypeFilterArray: temp })
                }}
                >
                  <TagLabel>
                    {`${tg.type} : ${tg.matches.length}`}
                  </TagLabel>
                  </Tag>
              ))
              }
              </div> 
            )}
          </div>
          

        )}
      </Flex>
    </Box>
  );
};

export default TopBar;
