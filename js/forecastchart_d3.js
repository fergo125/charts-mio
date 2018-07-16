

// {
//     // The type of chart we want to create
//     type: 'line',

//     // The data for our dataset
//     data: {
//         labels: ["January", "February", "March", "April", "May", "June", "July"],
//         datasets: [{
//             label: "My First dataset",
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45],
//         }]
//     },

//     // Configuration options go here
//     options: {}
// }
function renderChart(data){
    console.log("Rendering")
    //data_waves = data.map(x => ({"date":x.date,"wave_height_sig":x.wave_height_sig}))
    // let dates = data.map(x=> (new Date(x.date)).getHours());
    let dates = data.map(x=> (new Date(x.date)));
    let waves_sig = data.map(x=> x.wave_height_sig);
    let waves_max = data.map(x=> x.wave_height_max);
    let waves_period = data.map(x=> x.wave_period);
    let dates_days = []

    console.log("Charts ")
    var margin = {top: 20, right: 20, bottom: 72, left: 180},
    width = 960 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;
    
    console.log(waves_period);
    console.log(waves_sig);
    
    for(let date in dates){
        date = parseInt(date)
        if(date+1 < dates.length){
            if(dates[date].getDay() != dates[date+1].getDay()){
                dates_days.push(dates[date]);
            }
        }
        else{
            dates_days.push(dates[date]);
        }
    }
    // let dates_scale = Chart.Scale.extend({});
    // Chart.scaleService.registerScaleType('myScale', MyScale, defaultConfigObject);
    // let sighight_scale = Chart.Scale.extend({});
    // let waves_scale = Chart.Scale.extend({});
    // let dir_scale = Chart.Scale.extend({});
    // let period_scale = Chart.Scale.extend({});



// set the ranges
var x_dates = d3.scaleBand()
          .range([0,width])
          .padding(0.1);
var x_sig = d3.scaleBand()
            .range([0,width])
            .padding(0.1);
var x_max = d3.scaleBand()
            .range([0,width])
            .padding(0.1);
var x_period = d3.scaleBand()
            .range([0,width])
            .padding(0.1);
var x_days = d3.scaleBand()
            .range([0,width])
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#forecastchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
  // format the data
  lines_margin = 23
  format_data = data.map(d =>{d.wave_height_max = d.wave_height_max - d.wave_height_sig; return d;})
  // Scale the range of the data in the domains
  x_dates.domain(dates);
  x_days.domain(dates_days);
  x_sig.domain(waves_sig);
  x_max.domain(waves_max);
  x_period.domain(waves_period);

  y.domain([0, d3.max(waves_max) + 1.5]);


  // append the rectangles for the bar chart
  
//   svg.append("g").selectAll("g")
//   ;
//   let rect_g = svg.append("g").selectAll("g");
// svg.append("g").data(dates_days).enter().append("rect")
// .attr("class", "background-rect")
// .attr("x", function(d){console.log(d);return x_days(d);})
// .attr("width", x_days.bandwidth())
// .attr("y", 100 )
// .attr("height", function(d,i){ return (i%2===1)?height:0});
// //   svg.append("g").selectAll("g").data(dates_days).enter().selectAll(".bar").append("rect")
//         //   .attr("class", "background-rect")
//         //   .attr("x", function(d){console.log(d);return x_days(d);})
//         //   .attr("width", x_days.bandwidth())
//         //   .attr("y", 0 )
//         //   .attr("height", function(d,i){ return (i%2===1)?height:0});
  svg.append("g").selectAll("g").data(d3.stack().keys(["wave_height_sig","wave_height_max"])(format_data))
  .enter().append("g")
  .selectAll(".bar")
    .data(function(d){return d;})
    .enter().append("rect")
      .attr("class", (d)=>(d[0]==0?"bar-sig":"bar-max"))
      .attr("x", function(d, i) { _x = x_dates(new Date(d.data.date));return _x; })
      .attr("width", x_dates.bandwidth())
      .attr("y", function(d) { _y = y(d[1]);return _y; })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });
    console.log(dates_days);
    
        
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0,20)")
      .attr("class","axis-top")
      .call(d3.axisBottom(x_dates).tickFormat(d3.timeFormat("%H")));
    svg.append("g")
      .attr("transform", "translate(0,0)")
      .attr("class","axis-top")
      .call(d3.axisBottom(x_days).tickFormat(d3.timeFormat("%A %d, %B")));
    svg.append("g")
      .attr("transform", "translate(0,"+height+")")
      .attr("class","axis-top")
      .call(d3.axisBottom(x_sig).tickFormat(d3.format(",.2f")));
    svg.append("g")
      .attr("transform", "translate(0,"+(height+lines_margin)+")")
      .attr("class","axis-top")
      .call(d3.axisBottom(x_max).tickFormat(d3.format(",.2f")));
    svg.append("g")
      .attr("transform", "translate(0,"+(height+lines_margin*2)+")")
      .attr("class","axis-top")
      .call(d3.axisBottom(x_period).tickFormat(d3.format(",.0f")));
    
    svg.append("text")
      .attr("y", 0)
      .attr("x", -3/4*margin.left)
      .attr("dy", "1em")
      .attr("class","axis-tag")
      .style("text-anchor", "middle")
      .text("Día"); 
    
    svg.append("text")
      .attr("y", 20)
      .attr("x", -11/16*margin.left)
      .attr("dy", "1em")
      .attr("class","axis-tag")
      .style("text-anchor", "middle")
      .text("Hora");   

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    // .attr("x",-height*9/13)
    .attr("x",0)
    .attr("dy", "1em")
    .attr("class","axis-tag wave")
    .style("text-anchor", "middle")
    .text("Altura de la Ola");   

    svg.append("text")
    .attr("y", 0 - margin.left)
    .attr("x",-height*5/7)
    .attr("dy", "1em")
    .attr("class","axis-tag")
    .style("text-anchor", "middle")
    .text("Día");
    
    svg.append("text")
    .attr("y", 100)
    .attr("x", -margin.left)
    .attr("dy", "1em")
    .attr("class","axis-tag")
    .style("text-anchor", "middle")
    .text("Altura significativa");  
    
//   add the y Axis
//   svg.append("g")
//       .call(d3.axisLeft(y));



}
function main(){
    var data = axios.get("https://miocimar-test.herokuapp.com/api/local_forecasts/15/weekly_view/")
    .then(function(response){
        console.log(response);
        renderChart(response.data); 
    });

}

main();