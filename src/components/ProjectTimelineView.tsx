import path from 'path';

import React, { useCallback, useEffect, useState } from 'react';
import { Heading } from '@chakra-ui/react';

import { extent } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

import { repositionPoints } from 'respacer';

import {
  DeadlineType,
  EntryType,
  ProjectType,
  ProjectViewProps,
  TagType,
} from './types';
import { useProjectState } from './ProjectContext';
import DateFilter from './FilterDates';

interface EntryPlotProps {
  entryData: EntryType;
  y: (date: Date) => number;
  tags: TagType[];
  setEntryAsSelected: () => void;
  setHoverActivity: (entry:EntryType) => void;
}

const EntryPlot = (props: EntryPlotProps) => {
  const { entryData, y, tags, setEntryAsSelected, setHoverActivity } = props;

  const angledLineWidth = 100;
  const straightLineWidth = 20;

  const squareWidth = 20;
  const squarePadding = 2;

  const [hoverState, setHoverState] = useState(false);

  const [{ highlightedTag, researchThreadHover }] =
  useProjectState();

  useEffect(()=> {
    setHoverState(false)
    if(highlightedTag){
      entryData.tags.indexOf(highlightedTag) > -1 ? setHoverState(true) : setHoverState(false)
    }
    if(researchThreadHover){
      researchThreadHover.evidence.map(m=> m.activityTitle).indexOf(entryData.title) > -1 ? setHoverState(true) : setHoverState(false)
    }
  }, [highlightedTag, researchThreadHover])



  return (
    <>
      <circle cx={0} cy={entryData.yDirect} r={5} stroke="grey" fill="gray">

        <title>{new Date(entryData.date).toLocaleDateString('en-us', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}</title>
        
      </circle>
      <line
        x1={0}
        x2={angledLineWidth}
        y1={entryData.yDirect}
        y2={entryData.y}
        stroke={(hoverState ? 'yellow' : 'gray')}
        strokeWidth={(hoverState ? 3 : 1)}
      />
      <line
        x1={angledLineWidth}
        x2={angledLineWidth + straightLineWidth}
        y1={entryData.y}
        y2={entryData.y}
        stroke={(hoverState ? 'yellow' : 'gray')}
        strokeWidth={(hoverState ? 3 : 1)}
      />
      <g 
      style={{cursor:'pointer'}}
      onMouseOver={()=> {
          //dispatch({ type: 'HOVER_OVER_ACTIVITY', hoverActivity: entryData});
          setHoverActivity(entryData)
          setHoverState(true)
        }}
        onMouseOut={()=> {
          setHoverState(false)
        }}
        >
       
        <g transform={`translate(${angledLineWidth + straightLineWidth}, 0)`}>
        <rect 
          width={((entryData.files.length * (squareWidth + squarePadding) + (squareWidth/2)) + (8*entryData.title.length))}
          height={squareWidth*2}
          fill={(hoverState ? 'yellow' : 'white')}
          y={entryData.y - squareWidth}
          x={0-(squareWidth / 2)}
        />
          {entryData.files.map((t, i) => {
            return (
              <rect
                key={`${entryData.title}-artifact-${i}`}
                x={i * (squareWidth + squarePadding)}
                y={entryData.y - (squareWidth/2)}
                width={squareWidth}
                height={squareWidth}
                fill={'gray'}
                onClick={setEntryAsSelected}
              >
                <title>{t.title}</title>
              </rect>
            );
          })}
        </g>

        <g
          transform={`translate(${
            angledLineWidth +
            straightLineWidth +
            entryData.files.length * (squareWidth + squarePadding)
          }, 0)`}
        >
          <text
            x={0}
            y={entryData.y + (squareWidth/4)}
            textAnchor="start"
            onClick={setEntryAsSelected}
            style={{cursor:'pointer'}}
          >
            {entryData.title}
          </text>
        </g>

      </g>

    </>
  );
};

interface TimelinePlotProps {
  projectData: ProjectType;
  filteredActivites: EntryType[];
  boundingWidth: number | null;
  setSelectedEntryIndex: (entryIndex: number) => void;
}

const TimelinePlot = (props: TimelinePlotProps) => {
  const { projectData, setSelectedEntryIndex, filteredActivites, boundingWidth, setHoverActivity } = props;

  const entries = filteredActivites.map((e:EntryType) => ({
    ...e,
    date: new Date(e.date),
  }));

  const deadlines = projectData.deadlines ? projectData.deadlines : [];
  const deadlineDates = deadlines.map((d) => new Date(d.date));

  const dates = entries.map((e) => e.date);

  const height = Math.max(40 * entries.length, 600);

  //NEED TO MAKE THIS DYNAMIC
  const y = scaleTime()
    .range([0, (height - 70)])
    .domain(extent([...dates, ...deadlineDates]));

  const positionEntries =
    entries.length > 0
      ? repositionPoints(
          entries.map((e, i) => ({ ...e, yDirect: y(e.date), entryIndex: i })),
          {
            oldPositionName: 'yDirect',
            newPositionName: 'y',
            minSpacing: 40,
            width: height - 20,
          }
        )
      : [];

  const width = (boundingWidth - 50);
  const dateLabelWidth = 50;
  const tickWidth = 10;
  const ticks = y.ticks();

  const formatTime =  timeFormat('%x');//timeFormat('%Y-%m-%d (%a)');

  return (
    <svg height={height} width={width}>
      <g transform="translate(20,20)">
        {ticks.map((t) => (
          <React.Fragment key={`tick-${t}`}>
            <text x={0} y={y(t)} style={{fontSize:10}}>
              {formatTime(t)}
            </text>
            <line
              x1={dateLabelWidth}
              x2={dateLabelWidth + tickWidth}
              y1={y(t)}
              y2={y(t)}
              stroke="black"
            />
          </React.Fragment>
        ))}
      </g>

      <g transform={`translate(${20 + dateLabelWidth + tickWidth}, 20)`}>
        <line x1={0} x2={0} y1={y.range()[0]} y2={y.range()[1]} stroke="grey" />

        {positionEntries.map((e) => (
          <EntryPlot
            key={`en-${e.entryIndex}`}
            y={y}
            entryData={e}
            tags={projectData.tags}
            setEntryAsSelected={() => {
              setSelectedEntryIndex(e.entryIndex)}}
            setHoverActivity={setHoverActivity}
          />
        ))}
      </g>
    </svg>
  );
};

const ProjectTimelineView = (ProjectPropValues: ProjectViewProps) => {
  const { 
    projectData, 
    filteredActivites, 
    selectedEntryIndex, 
    setSelectedEntryIndex, 
    setHoverActivity 
  } = ProjectPropValues;
 
  const [{}, dispatch] = useProjectState();

  // TODO - these are duplicated from ProjectListView
  const updateEntryField = (
    entryIndex: number,
    fieldName: string,
    newValue: any
  ) => {
    dispatch({ type: 'UPDATE_ENTRY_FIELD', entryIndex, fieldName, newValue });
  };

  const [width, setWidth] = useState(null);
  const div = useCallback(node => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div ref={div} style={{width:'100%'}}>
      {/* <DateFilter /> */}
        <div style={{overflowY:"auto", height:"calc(100vh - 250px)", width:'100%'}}>
          <TimelinePlot
            projectData={projectData}
            filteredActivites={filteredActivites}
            setSelectedEntryIndex={setSelectedEntryIndex}
            boundingWidth={width}
            setHoverActivity={setHoverActivity}
          />
        </div>
    </div>
  );
};

export default ProjectTimelineView;