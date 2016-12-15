/*

Simple flexible graph function for Student Veteran Outcome graphs.

Usage:

new Graph({
  target : '#graduation',
  title : 'Graduation Rate',
  bars : [
    { name : 'vet', value : 4.5 },
    { name : 'all', value : 22.8 }
  ],
  max : 100,
  average : 43.9
});

*/

var Graph = function(options){

  var width = 200,
      height = 100,
      padding = 10,
      split = 1.8,
      max = options.max || 100;

  // HACK: Handle non-percentage data
  if (options.max && options.max !== 100){
    for (var i in options.bars){
      options.bars[i].percent = (options.bars[i].value / options.max) * 100;
    }

    // Handle non-percentage average line
    options.percent = (options.average / options.max) * 100;
  }

  options.value = options.average;

  // Append SVG
  var svg = d3.select(options.target)
    .append('svg')
      .attr('class', 'graph')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + width + ' ' + (height + padding));

  // Draw background area
  svg
    .append('rect')
    .attr('class', 'graph-background')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', height)
    .attr('width', width / split);

  // Draw bars
  var barWidth = (width / split) / options.bars.length;
  svg
    .selectAll('.graph-bar')
    .data(options.bars)
    .enter()
      .append('rect')
        .attr('class', function(d){ return d.name + ' graph-bar'; })
        .attr('x', function(d, i){ return i * barWidth; })
        .attr('y', function(d, i){ return height; })
        .attr('height', 0)
        .attr('width', barWidth)
        .transition()
          .duration(1000)
            .attr('y', function(d, i){ return height - (d.percent || d.value); })
            .attr('height', function(d,i){ return (d.percent || d.value); }); // Assumes percentage

  // Draw bar labels
  svg
    .selectAll('.graph-bar-label')
    .data(options.bars)
    .enter()
      .append('text')
        .attr('class', 'graph-bar-label')
        .attr('x', function(d, i){ return (i * barWidth) + (barWidth / 2); })
        .attr('y', function(d, i){ return Math.min(height - (d.percent || d.value) + 12, height - 5); })
        .text(format);

  // Draw axis
  svg
    .append('line')
      .attr('class', 'graph-axis')
      .attr('x1', 0)
      .attr('x2', width / split)
      .attr('y1', height)
      .attr('y2', height);

  // Draw axis labels
  svg
    .selectAll('.graph-axis-label')
    .data(options.bars)
    .enter()
      .append('text')
        .attr('class', 'graph-axis-label')
        .attr('x', function(d, i){ return (i * barWidth) + (barWidth / 2); })
        .attr('y', height + 10)
        .text(function(d){ return d.name; });

  // Draw average line
  svg
    .append('line')
      .attr('class', 'graph-line')
      .attr('x1', 0)
      .attr('x2', width / split)
      .attr('y1', height - (options.percent || options.average))
      .attr('y2', height - (options.percent || options.average));

  // Add average line label
  svg
    .append('text')
      .attr('class', 'graph-line-label')
      .attr('x', width / split)
      .attr('y', height - (options.percent || options.average))
      .text('< ' + format(options) + ' Nat\'l');

  // via http://stackoverflow.com/questions/3883342
  function format(d){

      var val = d.value;
      if (val === null || val === undefined){
        return 'No Data';
      } else {
        while (/(\d+)(\d{3})/.test(val.toString())){
           val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        // HACK: figure out which unit to put here
        val = typeof d.percent !== 'undefined' ? '$' + val : val + '%';

        return val;
      }
    }

};
