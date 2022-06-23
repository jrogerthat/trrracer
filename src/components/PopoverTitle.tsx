import React, { useState } from 'react';
import * as d3 from 'd3';
import { Box, Button, Badge, Popover, PopoverContent, PopoverBody, PopoverFooter, PopoverArrow, PopoverTrigger } from '@chakra-ui/react';
import ActivitytoThread from './ActivityToThread';
import { useProjectState } from './ProjectContext';

const ActivityTitlePopoverLogic = (props: any) => {
    const { activityData, researchThreads } = props;
    const [seeThreadAssign, setSeeThreadAssign] = useState(false);

    const [{projectData}, dispatch] = useProjectState();
   
    return <Popover
              trigger={'hover'}
              style={{display:'inline'}}
              
            >
            <PopoverTrigger>
            <div
              style={{
                display:'inline',
                marginTop:2,
                cursor:'pointer'
              }}
              onMouseOver={()=> {
                let circles = d3.selectAll('circle.all-activities');
                
                circles.filter(f => f.title === activityData.title).attr('fill', 'red')
              }}
              onMouseLeave={()=> {
                let circles = d3.selectAll('circle.all-activities');
                
                circles.filter(f => f.title === activityData.title).attr('fill', '#d3d3d3')
              }}
            >{activityData.title}</div>
          
        </PopoverTrigger>
        <PopoverContent bg="white" color="gray">
          <PopoverArrow bg="white" />
  
          <PopoverBody>
            {seeThreadAssign && (
              <div>
                {researchThreads &&
                researchThreads.research_threads.length > 0 ? (
                  researchThreads.research_threads.map(
                    (rt: any, tIndex: number) => (
                      <React.Fragment key={`rt-${tIndex}`}>
                        <ActivitytoThread
                          thread={rt}
                          threadIndex={tIndex}
                          activity={activityData}
                          activityIndex={activityData.index}
                          setSeeThreadAssign={setSeeThreadAssign}
                        />
                      </React.Fragment>
                    )
                  )
                ) : (
                  <span>no threads yet</span>
                )}
              </div>
            )}
          </PopoverBody>
          <PopoverFooter>
            {seeThreadAssign ? (
              <Box>
                <Button onClick={() => setSeeThreadAssign(false)}>cancel</Button>
              </Box>
            ) : (
              <>
              <Button onClick={() => setSeeThreadAssign(true)}>
                Add this activity to a thread.
              </Button>
              <br/>
              <span style={{marginTop:10, fontSize:12, fontWeight:400, display:'block'}}>Copy to cite this activity:</span>
              <span
                style={{fontSize:12, color:'black', lineHeight:1}}
              >
              <Button
               onClick={() => {
                              let indexTest = projectData.citations.map(c => c.id).indexOf(activityData.activity_uid);
                              let index = indexTest > -1 ? (indexTest + 1) : (projectData.citations.length + 1);
                              navigator.clipboard.writeText(String.raw`\trrracer{overview}{activity}{${activityData.activity_uid}}{${index}}`)
                              if(indexTest === -1){
                                let newCitations = [...projectData.citations, {"id": activityData.activity_uid, "cIndex": index}]
                                dispatch({ type: 'ADD_CITATION', citations: newCitations});
                              }
                              
                            }}
                              >Copy this ref</Button>
                {/* {String.raw`\trrracer{overview}{activity}{${activityData.activity_uid}}`} */}
                </span>
              </>
              
            )}
          </PopoverFooter>
        </PopoverContent>
      </Popover>
  };

  export default ActivityTitlePopoverLogic;