import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Setting up svg container
    const w = 400;
    const h = 300;
    const svg = d3
      .select(svgRef.current)
      .attr('width', w)
      .attr('height', h)
      .style('overflow', 'visible')
      .style('margin-top', '75px');

    // Setting the scaling
    const yScale = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d._id;
        })
      )
      .range([0, h])
      .padding(0.5);
    const xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.count;
        }),
      ])
      .range([0, w]);

    // Setting the axes
    const yAxis = d3.axisLeft(yScale).ticks(data.length);
    const xAxis = d3.axisBottom(xScale).ticks(6);
    svg.append('g').call(yAxis).attr('transform', `translate(0, 0)`);
    svg.append('g').call(xAxis).attr('transform', `translate(0, ${h})`);

    // Setting the svg data
    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('y', function (d) {
        return yScale(d._id);
      })
      .attr('x', function (d) {
        return 0;
      })
      .attr('height', yScale.bandwidth())
      .attr('width', function (d) {
        return xScale(d.count);
      })
      .style('fill', '#1aac83');

    // Adding text inside the bars
    svg
      .selectAll('.bar-text')
      .data(data)
      .join('text')
      .text(function (d) {
        return d.count;
      })
      .attr('class', 'bar-text')
      .attr('x', function (d) {
        return xScale(d.count) + 5;
      })
      .attr('y', function (d) {
        return yScale(d._id) + yScale.bandwidth() / 2;
      })
      .attr('dy', '0.35em')
      .style('fill', 'black');
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarGraph;
