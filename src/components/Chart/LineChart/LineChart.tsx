import * as d3 from 'd3';
import { FC, useEffect, useMemo, useRef } from 'react';

import LineItem from '../LineItem';
import { MARGIN } from './LineChart.config';
import { LineChartProps } from './LineChart.interface';

const LineChart: FC<LineChartProps> = ({ width, height, data, start, end, isWin }) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right;
  const boundsHeight = height - MARGIN.top * 2;

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([64980, 65040]).range([boundsHeight, 0]);
  }, [data, height]);

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 20])
      .range([0, width + MARGIN.right]);
  }, [data, width]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();

    const yAxisGenerator = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(0)
      .tickFormat((d) => d.toString());

    svgElement.append('g').call(yAxisGenerator);
  }, [yScale, boundsHeight]);

  const lineBuilder = d3
    .line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveNatural);

  const linePath = lineBuilder(data);

  const supportLinePath = lineBuilder(new Array(20).fill(start));
  const supportLinePathIsWin = lineBuilder(new Array(20).fill(end));

  if (!linePath || !supportLinePath || !supportLinePathIsWin) {
    return null;
  }

  const colorIsWin = useMemo(() => {
    if (isWin === false) {
      return 'from-red/20';
    }

    if (isWin === true) {
      return 'from-green/20';
    }

    return '';
  }, [isWin]);

  return (
    <div>
      <svg width={width} height={height} className={`bg-gradient-to-b ${colorIsWin}`}>
        {/* first group is lines */}
        <g
          width={width}
          height={boundsHeight}
          transform={`translate(${[0, MARGIN.top].join(',')})`}
        >
          <LineItem path={linePath} color={'#289BF6'} />
        </g>
        {/* Second is for the axes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[width, MARGIN.top].join(',')})`}
        />
        {/* support line start */}
        <g
          width={width}
          height={boundsHeight}
          transform={`translate(${[0, MARGIN.top].join(',')})`}
        >
          <LineItem path={supportLinePath} color={'#8A8A8A'} />
        </g>
        {/* support line is win */}
        <g
          width={width}
          height={boundsHeight}
          transform={`translate(${[0, MARGIN.top].join(',')})`}
        >
          <LineItem path={supportLinePathIsWin} color={isWin ? '#6CFB72' : '#FB6C6C'} />
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
