import React from 'react'
import * as d3 from 'd3'
import { useEffect } from 'react'


const BarchartIntensity = ({ data }) => {
    const intensityData = {};
  
    // Aggregate intensity values according to end year
    data.forEach((item) => {
      if (item.end_year in intensityData) {
        intensityData[item.end_year] += item.intensity;
      } else {
        intensityData[item.end_year] = item.intensity;
      }
    });
    delete intensityData[""];
    // Convert object to array
    const intensityArray = Object.entries(intensityData);
  
    // Chart dimensions
    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
  
    useEffect(() => {
      const svg = d3.select("#intensity")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
      const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(intensityArray.map((s) => s[0]))
        .padding(0.4);
  
      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(intensityArray, (d) => d[1])]);
  
      // Create bars
      chart.selectAll(".bar")
        .data(intensityArray)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d[0]))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d[1]));
  
      // Add x-axis
      chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
  
      // Add y-axis
      chart.append("g")
        .call(d3.axisLeft(yScale));
    }, [data, height, intensityArray, margin.left, margin.top, width]);
  
    return (
      <div>
        <h1>Intensity</h1>
        <svg id="intensity"></svg>
      </div>
    );
  };

export default BarchartIntensity;