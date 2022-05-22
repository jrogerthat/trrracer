import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { useProjectState } from './ProjectContext';
import { joinPath} from '../fileUtil';
import ForceMagic from '../ForceMagic';
import Bubbles from '../Bubbles';
import { dataStructureForTimeline } from './VerticalAxis';
import type { EntryType } from './types';
import { Box, Button, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { calcCircles } from '../PackMagic';
import { getIndexOfMonth } from '../timeHelperFunctions';
import { ToolIcon } from './Project';
const smalltalk = require('smalltalk');

interface BubbleProps {
  filteredActivities: EntryType[];
  setGroupBy:(gb:any)=> void;
  groupBy: any;
  setHoverActivity: (ent: any) => void;
  flexAmount: number;
  setDefineEvent: (value: ((prevState: boolean) => boolean) | boolean) => void;
  defineEvent: boolean;
  filterType: null | any;
}

const RTtooltip = (toolProp: any) => {

  const { activityData, position, researchThreads, filterRT } = toolProp;
  let threadData = researchThreads.research_threads.filter(f=> f.title === filterRT.title)[0];
  
  let evidence = threadData.evidence.filter(e => e.activityTitle === activityData.title);

  console.log('evidenceeeee',evidence)

  return <div
    id={'tooltip'}
    style={{
      position:'absolute',
      left: position[0],
      top: position[1] - 50,
      textAlign: 'center',
      minWidth:100,
      maxWidth:400,
      minHeight:50,
      padding:10,
      backgroundColor: '#fff',
      border: '2px solid gray',
      borderRadius: 10,
      pointerEvents:'none',
      zIndex: 6000
    }}
  >
    <span
    style={{
      font: '15px sans-serif',
      fontWeight:600
    }}
    >{activityData.title}</span>
    {
      evidence.map((e:any, i:number) => (
        <div style={{marginTop:10, fontSize:12}}>
          <div
             style={{fontWeight:800}}
          >{`Included artifact: ${e.artifactTitle}`}</div>
          {
            e.type === 'fragment' && (
              <span
              style={{backgroundColor: '#fdfd96'}}
              >{`"${e.anchors[0].frag_type}"`}</span>
            )
          }
          <div
            style={{marginTop:10, fontSize:11}}
          ><span
            style={{fontWeight:800}}
          >Rationale: </span>{e.rationale}</div>
        </div>
      ))
    }
  
  </div>
}

const ToolTip = (toolProp: any) => {
  const {activityData, position} = toolProp;
  
  return <div
    id={'tooltip'}
    style={{
      position:'absolute',
      left: position[0],
      top: position[1] - 50,
      textAlign: 'center',
      minWidth:100,
      minHeight:50,
      padding:10,
      backgroundColor: '#fff',
      border: '2px solid gray',
      borderRadius: 10,
      pointerEvents:'none',
      zIndex: 6000
    }}
  >
    <span
    style={{
      font: '15px sans-serif',
      fontWeight:600
    }}
    >{activityData.title}</span>
    <div>
    {
      activityData.files.map((fi:any, i:any) => (
      
        <div
        key={`act-data-${i}`}
          style={{display:'inline-block', margin:5}}
        ><ToolIcon 
          artifactType={fi.artifactType}
          size={28}
          />
            <span
              style={{fontSize:10}}
            >{fi.title}</span>
          </div>
      ))
    }
    </div>
  </div>
}

const BubbleVis = (props: BubbleProps) => {
  const {
    filteredActivities,
    groupBy,
    setGroupBy,
    setHoverActivity,
    flexAmount,
    setDefineEvent,
    defineEvent,
    filterType
  } = props;

  const [
    { artifactTypes, selectedThread, researchThreads, projectData, filterRT },
    dispatch
  ] = useProjectState();
  
  const {eventArray} = projectData;
  const [newHeight, setNewHeight] = useState('1000px');
  const [svgWidth, setSvgWidth] = useState(600);
  const [translateY, setTranslateY] = useState(35);
  const [hoverData, setHoverData] = useState(projectData.entries[0]);
  const [toolPosition, setToolPosition] = useState([0, 0]);

  const width = 300;
  const height = +newHeight.split('px')[0];
  const svgRef = React.useRef(null);

  let packedCircData = calcCircles(projectData.entries);
  d3.select('#tooltip').style('opacity', 0);

  const forced = new ForceMagic(packedCircData, width, height);

  useEffect(() => {
    if (svgRef.current) {
      setNewHeight(window.getComputedStyle(svgRef.current).height);
    }
    if(groupBy){
      console.log('GROUP BY EXISTS', (researchThreads?.research_threads.length * 300));
      
      setSvgWidth((researchThreads?.research_threads.length * 300))
    }else{
      setSvgWidth(600);
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const underWrap = svg.append('g').classed('path-wrap', true)
    underWrap.attr('transform', `translate(180, ${translateY})`);
    const wrap = svg.append('g').attr('transform', `translate(180, ${translateY})`);

    const { yScale, margin } = forced;
    setTranslateY(margin / 3);

    const marginTime = height * 0.25;

    const yearMonth = dataStructureForTimeline(projectData.entries);

    const startIndex = getIndexOfMonth(yearMonth[0].months, 'first');
    const endIndex = getIndexOfMonth(
      yearMonth[yearMonth.length - 1].months,
      'last'
    );
    yearMonth[0].months = yearMonth[0].months.filter(
      (f: any, i: number) => i > startIndex - 1
    );

    yearMonth[yearMonth.length - 1].months = yearMonth[
      yearMonth.length - 1
    ].months.filter((f: any, i: number) => i < endIndex);

    const filteredActivitiesExtent = d3.extent(
      filteredActivities.map((m: any) => new Date(m.date))
    );

    let checkGroup = svg.select('g.timeline-wrap');
    let wrapAxisGroup = checkGroup.empty() ? svg.append('g').attr('class', 'timeline-wrap') : checkGroup;
    
    wrapAxisGroup.selectAll('*').remove();
    wrapAxisGroup.attr('transform', `translate(110, ${translateY})`);

    const yAxis = d3.axisLeft(yScale).ticks(40).tickSize(10);

    const yAxisGroup = wrapAxisGroup
      .append('g')
      .attr('transform', `translate(10, 0)`)
      .call(yAxis);

    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('line')
      .enter()
      .append('line')
      .attr('stroke', 'gray.900');

    const axisLabel = yAxisGroup
      .selectAll('text')
      .join('text')
      .attr('font-size', '0.55rem')
      .attr('opacity', 0.5);

    if (!defineEvent) {
      const triangle = d3.symbol().size(50).type(d3.symbolTriangle);

      const brushed = function (event: any) {
        if (!event.selection && !event.sourceEvent) return;
        const s0 = event.selection
          ? event.selection
          : [1, 2].fill(event.sourceEvent.offsetX);

        let s1 = s0;

        if (event.sourceEvent && event.type === 'end') {
          s1 = event.selection;
          d3.select(this).transition().call(event.target.move, s1);

          dispatch({
            type: 'UPDATE_FILTER_DATES',
            filterDates: [
              yScale.invert(event.selection[0]),
              yScale.invert(event.selection[1]),
            ],
          });
        }

        // move handlers
        d3.selectAll('g.handles').attr('transform', (d: any) => {
          const y = d === 'handle--o' ? s1[0] : s1[1];
          return `translate(0, ${y})`;
        });

        d3.selectAll('g.handles').selectAll('rect.handle-rect');

        // update labels
        d3.selectAll('g.handles')
          .selectAll('text')
          .attr('dy', (d)=> d === 'handle--o' ? -2 : 10)
          .text((d: any) => {
            const year =
              d === 'handle--o'
                ? yScale.invert(s1[0]).toLocaleDateString('en-us', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : yScale.invert(s1[1]).toLocaleDateString('en-us', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

            return year;
          });
      };

      const bY = d3
        .brushY()
        .handleSize(8)
        .extent([
          [0, 0],
          [20, height - marginTime],
        ])
        .on('start brush end', brushed);

      const gBrush = wrapAxisGroup
        .append('g')
        .call(bY)
        .call(bY.move, [
          yScale(filteredActivitiesExtent[0]),
          yScale(filteredActivitiesExtent[1]),
        ]);

      gBrush.select('.selection').attr('opacity', 0.2);

      // Custom handlers
      // Handle group
      const gHandles = gBrush
        .selectAll('g.handles')
        .data(['handle--o', 'handle--e'])
        .join('g')
        .attr('class', (d) => `handles ${d}`)
        .attr('fill', 'black')
        .attr('opacity', 1)
        .attr('transform', (d) => {
          const y =
            d === 'handle--o'
              ? yScale(filteredActivitiesExtent[0])
              : yScale(filteredActivitiesExtent[1]);
          return `translate(0, ${y})`;
        });
      
      gHandles.selectAll('rect.handle-rect')
        .data(d => [d])
        .join('rect')
        .classed('handle-rect', true)
        .attr('fill', '#fff')
        .attr('width', 70)
        .attr('height', 13)
        .attr('y', (d)=> d === 'handle--o' ? -13 : 0)
        .attr('x', -50);
     
      // Label
      gHandles
        .selectAll('text')
        .data((d) => [d])
        .join('text')
        .attr('text-anchor', 'middle')
        .attr('dy', (d)=> d === 'handle--o' ? -2 : 10)
        .text((d) => {
          if (d === 'handle--o') {
            
            return filteredActivitiesExtent[0].toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
          }
          return filteredActivitiesExtent[1].toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        })
        .style('font-size', '11px')
        .style('pointer-events', 'none')
        
      gHandles
        .selectAll('.triangle')
        .data((d) => [d])
        .join('path')
        .attr('class', (d) => `triangle ${d}`)
        .attr('d', triangle)
        .attr('transform', (d) => {
          const y = d === 'handle--o' ? -17 :17;
          const rot = d === 'handle--o' ? 0 : 180;
          return `translate(20, ${y}) rotate(${rot})`;
        });

      gHandles
        .selectAll('.line')
        .data((d: any) => [d])
        .join('line')
        .attr('class', (d: any) => `line ${d}`)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 20)
        .attr('y2', 0)
        .attr('stroke', 'black');

      const resetTest = svg.select('text.reset');

      const reset = resetTest.empty()
        ?wrapAxisGroup.append('text').classed('reset', true)
        : resetTest;

      reset
        .text('Reset Time')
        .attr('transform', 'translate(-25, -30)')
        .style('font-size', '12px')
        .style('cursor', 'pointer')
        .on('click', () => {
          dispatch({ type: 'UPDATE_FILTER_DATES', filterDates: [null, null] });
        });
    }

    if (defineEvent) {
     
      let text;
      let bGroup = wrapAxisGroup.append('g')
      
      let bRect = bGroup.append('rect').attr('width', 40).attr('height', height-marginTime).attr('fill-opacity', 0);

      const brushedEvent = function (event: any) {
        if (!event.selection && !event.sourceEvent) return;
        const s0 = event.selection
          ? event.selection
          : [1, 2].fill(event.sourceEvent.offsetX);

        let s1 = s0;

        if (event.sourceEvent && event.type === 'end') {
          s1 = event.selection;
          d3.select(this).transition().call(event.target.move, s1);

          const start = yScale.invert(s1[0]).toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          const end = yScale.invert(s1[1]).toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          smalltalk
            .prompt(
              'Adding an Event',
              `from ${start} to ${end}`,
              'Visit to Zanadu'
            )
            .then((value: string) => {
              const newEventArray = [
                ...eventArray,
                {
                  event: value,
                  time: [yScale.invert(s1[0]), yScale.invert(s1[1])],
                },
              ];
              dispatch({ type: 'ADD_EVENT', eventArray: newEventArray });
              setDefineEvent(false);
            })
            .catch(() => {
              console.log('cancel');
            });
          //
        }

        // move handlers
        d3.selectAll('g.handles').attr('transform', (d) => {
          const y = d == 'handle--o' ? s1[0] : s1[1];
          return `translate(0, ${y})`;
        });

        // update labels
        d3.selectAll('g.handles')
          .selectAll('text')
          .attr('dy', 6)
          .text((d) => {
            const year =
              d == 'handle--o'
                ? yScale.invert(s1[0]).toLocaleDateString('en-us', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : yScale.invert(s1[1]).toLocaleDateString('en-us', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

            return year;
          });
      };

      const bY = d3
        .brushY()
        .handleSize(8)
        .extent([
          [0, 0],
          [40, height - marginTime],
        ])
        .on('start brush end', brushedEvent);

      bGroup.call(bY)

      bGroup.on('mousemove', (event)=> {
        let textTest = svg.select('text.hover-text');
        text = textTest.empty() ? svg.append('text').classed('hover-text', true) : textTest;
        let position = (event.offsetY - 120);
        text.text(yScale.invert(position));
        text.attr('y', position - 20);
        text.attr('x', -30);
        text.style('font-size', 11);
        text.style('font-weight', 800);
        
      })
      bGroup.on('mouseleave', () => {
        let textTest = svg.select('text.hover-text');
        textTest.remove();
        
      })
    }
 
  /*
  */
    const eventRectGroups = wrap
    .selectAll('g.event')
    .data(eventArray)
    .join('g')
    .classed('event', true);

    if (eventArray.length > 0) {

        eventRectGroups.attr('transform', (d)=> `translate(-70, ${yScale(new Date(d.time[0]))})`)
        const eventRects = eventRectGroups.selectAll('rect').data(d => [d]).join('rect');

        eventRects.attr(
        'height',
        (d: any) => yScale(new Date(d.time[1])) - yScale(new Date(d.time[0]))
        );

        eventRects.attr('width', 900);
        eventRects.style('fill-opacity', 0.05);

        if(!groupBy){
          let eventLine = eventRectGroups
            .append('line')
            .attr('x1', 0)
            .attr('x2', 300)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)

          let eventText = eventRectGroups
          .selectAll('text')
          .data((d) => [d])
          .join('text')
          .text((d) => d.event);
  
          eventText.attr('x', 305);
          eventText.attr('y', 4);
          eventText.style('font-size', 10);
          eventText.style('fill', 'gray');
        }
     
    }

    if (groupBy) {
 
      if (groupBy.type === 'research_threads') {

        const groupRTDATA = groupBy.data.map((m: any) => {
          return { label: m.title, color: m.color };
        });

        const groupGroups = wrap
          .selectAll('g.group')
          .data(groupRTDATA)
          .join('g')
          .attr('class', 'group');

        groupGroups.attr('transform', (d: any, i: any) => `translate(${(i * 230)}, 0)`);

        let allActivityGroups = groupGroups
        .selectAll('g.activity')
        .data(forced.nodes)
        .join('g')
        .attr('class', 'activity');

      allActivityGroups.attr('transform', d => `translate(${d.x}, ${d.y})`);

      let underGroup = groupGroups.append('g');

      // allActivityGroups.attr('transform', d => `translate(${d.x}, ${d.y})`);

      let activityBubbles = new Bubbles(
        allActivityGroups,
        true,
        'all-activities'
      );

      activityBubbles.bubbles.attr('fill', "gray").attr('fill-opacity', .1).attr('stroke', '#d3d3d3').attr('stroke-width', .5);
      let artifactCircles = allActivityGroups.selectAll('circle.artifact').data(d => d.files).join('circle').classed('artifact', true);
      artifactCircles.attr('r', d => (5)).attr('cx', d => d.x).attr('cy', d => d.y);

      let highlightedActivities = allActivityGroups.filter((ac) => filteredActivities.map((m:any) => m.title).includes(ac.title));
      
      groupGroups.each((d, i, n)=> {
        console.log('each', d3.select(n[i]));
        let chosenRT = researchThreads?.research_threads.filter(f => f.title === d.label)[0];
        let rtActivities = chosenRT.evidence.map(m => m.activityTitle);
        let colorCirc = d3.select(n[i]).selectAll('circle.all-activities').filter(c => rtActivities.includes(c.title));
        colorCirc.attr('fill', d.color);

        let notColA = d3.select(n[i]).selectAll('.activity').filter(c => rtActivities.indexOf(c.title) === -1);
        notColA.selectAll('.artifact').attr('fill', '#d3d3d3');
        let notCol = d3.select(n[i]).selectAll('circle.all-activities').filter(c => rtActivities.indexOf(c.title) === -1);
        notCol.attr('fill', '#d3d3d3');
      })

      }
    } else {

      let allActivityGroups = wrap
        .selectAll('g.activity')
        .data(forced.nodes)
        .join('g')
        .attr('class', 'activity');

      allActivityGroups.attr('transform', d => `translate(${d.x}, ${d.y})`);

      let activityBubbles = new Bubbles(
        allActivityGroups,
        true,
        'all-activities'
      );
      
      activityBubbles.bubbles.attr('fill', "#d3d3d3").attr('fill-opacity', .3).attr('stroke', '#d3d3d3').attr('stroke-width', .4);
      
      let artifactCircles = allActivityGroups.selectAll('circle.artifact').data(d => d.files).join('circle').classed('artifact', true);
      artifactCircles.attr('r', d => (3)).attr('cx', d => d.x).attr('cy', d => d.y);

      let highlightedActivities = allActivityGroups.filter((ac) => filteredActivities.map((m:any) => m.title).includes(ac.title));
      
      highlightedActivities.select('.all-activities')
      .on('mouseover', (event, d) => {
        if(filterRT){
          d3.select(event.target).attr('stroke', 'gray').attr('stroke-width', 2);
        }else if(filterType){
          d3.select(event.target).attr('stroke', 'gray').attr('stroke-width', 1);
        }else{
          d3.select(event.target).attr('fill', 'gray');
        }
       
      }).on('mouseout', (event, d) => {
        if(filterRT){
        d3.select(event.target).attr('stroke-width', 0);
        }else if(filterType){

        d3.select(event.target).attr('fill', 'gray').attr('fill-opacity', .5);
        d3.select(event.target).attr('stroke', 'gray').attr('stroke-width', 0);
       

        }else{
        d3.select(event.target).attr('fill', '#d3d3d3').attr('stroke', '#d3d3d3').attr('stroke-width', .5);
        }
      });

      if(filterType){

        highlightedActivities.select('.all-activities').attr('fill', 'gray').attr('fill-opacity', .5);
        highlightedActivities.select('.all-activities').attr('stroke-width', 0);
        let highlightedCircles = highlightedActivities.selectAll('circle.artifact').filter(f=> f.artifactType === filterType);
        highlightedCircles.attr('fill', 'gray').attr('fill-opacity', 1);
        let highlightedCirclesNOT = highlightedActivities.selectAll('circle.artifact').filter(f=> f.artifactType != filterType);
        highlightedCirclesNOT.attr('fill', '#fff').attr('fill-opacity', .7);

      }else{

        let highlightedCircles = highlightedActivities.selectAll('circle.artifact');
        highlightedCircles.attr('fill', 'gray');

      }

      let hiddenCircles = allActivityGroups.filter(ac => {
        return filteredActivities.map((m:any) => m.title).indexOf(ac.title) === -1})
      .selectAll('circle.artifact');

      hiddenCircles.attr('fill', 'gray')
      .attr('fill-opacity', .3);

      if(filterRT && researchThreads?.research_threads[selectedThread].evidence.length > 0){
       
        let linkDataBefore = [];
        let linkDataAfter = [];

        researchThreads?.research_threads[selectedThread].evidence.forEach(f => {
          let temp = highlightedActivities.filter(ha => ha.title === f.activityTitle);
        
        let chosenActivityData = temp.select('.all-activities').data()[0];
        
        if(f.type === 'activity'){
          temp.select('.all-activities')
            .attr('fill', researchThreads?.research_threads[selectedThread].color);
        
        }else if(f.type === 'artifact' || f.type === 'fragment'){
         
          temp
            .select('circle.background')
            .attr('fill-opacity', 1);
          temp.selectAll('circle.artifact')
            .filter(art => art.title === f.artifactTitle)
            .attr('fill', researchThreads?.research_threads[selectedThread].color);
          temp.select('circle.all-activities')
            .attr('fill', researchThreads?.research_threads[selectedThread].color);
        }
          
          let divideDate = new Date(researchThreads?.research_threads[selectedThread].actions.filter(f => f.action === 'created')[0].when);

          console.log('divide date', divideDate)
          console.log('chosenActivityDTA', chosenActivityData)
          if(new Date(chosenActivityData.date) < divideDate){
            linkDataBefore.push({coord: [chosenActivityData.x, chosenActivityData.y], date: chosenActivityData.date})
          }else{
            linkDataAfter.push({coord: [chosenActivityData.x, chosenActivityData.y], date: chosenActivityData.date})
          }
      })

      var lineGenerator = d3.line();

        if(linkDataAfter.length > 0){

          linkDataAfter = linkDataAfter.sort((a, b) => new Date(a.date) - new Date(b.date));

          var pathStringSolid = lineGenerator(linkDataAfter.map(m=> m.coord));
    
          underWrap.append('path')
          .attr('d', pathStringSolid)
          .attr('fill', 'none')
          .attr('stroke', researchThreads?.research_threads[selectedThread].color)
          .attr('stroke-width', 2);

        }
        if(linkDataBefore.length > 0){

          linkDataBefore = linkDataBefore.sort((a, b) => new Date(a.date) - new Date(b.date));
          if(linkDataAfter.length > 0) linkDataBefore.push(linkDataAfter[0])
          
          var pathStringDash = lineGenerator(linkDataBefore.map(m=> m.coord));
          
          underWrap.append('path')
            .attr('d', pathStringDash)
            .attr('fill', 'none')
            .attr('stroke', researchThreads?.research_threads[selectedThread].color)
            .attr('stroke-width', 2)
            .style('stroke-dasharray', '5,5');
        }
      }
    
    highlightedActivities
        .on('mouseover', (event, d) => {
          
          setToolPosition([d.x, d.y])
          setHoverData(d);
          d3.select('#tooltip').style('opacity', 1);

          let labelGTest = wrap.select('.timeline-wrap').select('#label-group');
          let labelG = labelGTest.empty() ? svg.select('.timeline-wrap').append('g').attr('id', 'label-group') : labelGTest;
          labelG.attr('transform', `translate(0, ${forced.yScale(new Date(d.date))})`)

          let rect = labelG.append('rect')
          rect.attr('width', 50)
          .attr('height', 15)
          .attr('fill', '#fff')
          .attr('fill-opacity', .9);
          rect.attr('x', -50).attr('y', -12);

          let text = labelG
          .append('text')
          .text(new Date(d.date).toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })).style('font-size', 9)
          .style('text-anchor', 'end')
          .style('font-weight', 600)

            underWrap.append('line')
            .attr('id', 'date_line')
            .attr('y1', d.y)
            .attr('x2', (0-70))
            .attr('y2', forced.yScale(new Date(d.date)))
            .attr('x1', (+d.x))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
          
        })
        .on('mouseout', (event:any, d:any) => {
      
          d3.select('#tooltip').style('opacity', 0);
          d3.select('#date_line').remove();
          d3.select('#label-group').remove();
      
        }).on('click', (event:any, d:any)=> {
          setHoverActivity(d);
        })

 
      }

  }, [filteredActivities, groupBy, eventArray, filterType, defineEvent]);

  return (
    <div style={{ flex: flexAmount, paddingTop:'30px' }}>
      <div
        style={{width:'100%'}}
      >
        <Button
          size={'sm'}
          style={{fontSize:"12px"}}
          onClick={() => {
            console.log('is this working??')
            defineEvent ? setDefineEvent(false) : setDefineEvent(true)}
          }
        >
          Add events to timeline
        </Button>

      <Box marginLeft="3px" padding="3px" height="40px" display={'inline-block'}>
        <FormControl display="flex" alignItems="center" marginBottom={10}>
          <FormLabel
            htmlFor="split-by"
            mb="0"
            textAlign="right"
            fontSize="12px"
          >
            Group by research threads
          </FormLabel>
          <Switch
            id="split-by"
            onChange={(event) => {
              event.target.checked
                ? setGroupBy({
                    type: 'research_threads',
                    data: researchThreads.research_threads,
                  })
                : setGroupBy(null);
            }}
          />
        </FormControl> 
      </Box>
           
      </div>

      <svg
        ref={svgRef}
        width={svgWidth}
        height={height}
        style={{ display: 'inline' }}
      />
      {
        filterRT ? <RTtooltip activityData={hoverData} position={toolPosition} filterRT={filterRT} researchThreads={researchThreads} /> : <ToolTip activityData={hoverData} position={toolPosition}/>
      }
     
    </div>
  );
};

export default BubbleVis;
