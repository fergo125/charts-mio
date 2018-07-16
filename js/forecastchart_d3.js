

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
    // var margin = {top: 20, right: 20, bottom: 72, left: 180},
    // width = 960 - margin.left - margin.right,
    // height = 350 - margin.top - margin.bottom;
    let total_width = 960;
    let total_height = 300;
    let width_sections = [total_width*0.14,total_width*0.01,total_width*0.85];
    let height_sections = [total_height*0.15,total_height*0.6, total_height*0.25];
    
    let width_offset = 0;
    width_sections= width_sections.map((v,i)=>{let v_o = width_offset; width_offset += v; return v_o})
    let height_offset = 0;
    height_sections = height_sections.map((v,i)=>{v_o = height_offset; height_offset += v; return v_o})
    console.log(width_sections);
    console.log(height_sections);
    
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
bar_padding = 0.2

var x_dates = d3.scaleBand()
          .range([width_sections[2],total_width])
          .padding(bar_padding);
var x_sig = d3.scaleBand()
            .range([width_sections[2],total_width])
            .padding(bar_padding);
var x_max = d3.scaleBand()
            .range([width_sections[2],total_width])
            .padding(bar_padding);
var x_period = d3.scaleBand()
            .range([width_sections[2],total_width])
            .padding(bar_padding);
var x_days = d3.scaleBand()
            .range([width_sections[2],total_width])
var y = d3.scaleLinear()
          .range([height_sections[2], height_sections[1]]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#forecastchart").append("svg")
    .attr("width", total_width)
    .attr("height", total_height)
  .append("g")
    .attr("transform", 
          "translate(" + 0+ "," + 0+ ")");

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
    console.log((total_height-height_sections[0])*(2/3));
    console.log(height_sections[0]);
        
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0,"+height_sections[1]*1/2+")")
      .attr("class","axis-top hours")
      .call(d3.axisBottom(x_dates).tickFormat(d3.timeFormat("%H")));
    svg.append("g")
      .attr("transform", "translate(0,"+height_sections[0]+")")
      .attr("class","axis-top days")
      .call(d3.axisBottom(x_days).tickFormat(d3.timeFormat("%A %d, %B")));
    svg.append("g")
      .attr("transform", "translate(0,"+height_sections[2]+")")
      .attr("class","axis-top hs")
      .call(d3.axisBottom(x_sig).tickFormat(d3.format(",.2f")));
    svg.append("g")
      .attr("transform", "translate(0,"+(height_sections[2]+(total_height-height_sections[2])*(1/3))+")")
      .attr("class","axis-top hm")
      .call(d3.axisBottom(x_max).tickFormat(d3.format(",.2f")));
    svg.append("g")
      .attr("transform", "translate(0,"+(height_sections[2]+(total_height-height_sections[2])*(2/3))+")")
      .attr("class","axis-top p")
      .call(d3.axisBottom(x_period).tickFormat(d3.format(",.0f")));
    
    svg.append("text")
    //   .attr("y", 0)
    //   .attr("x", -3/4*margin.left)
      .attr("y", height_sections[0])
      .attr("x", width_sections[1])
      .attr("dy", "1em")
      .attr("class","axis-tag")
      .text("Día"); 
    
    svg.append("text")
    //   .attr("y", 20)
    //   .attr("x", -11/16*margin.left)
    .attr("y", height_sections[0] + height_sections[1]*1/2)
    .attr("x", width_sections[1])
      .attr("dy", "1em")
      .attr("class","axis-tag")
      .text("Hora");   

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", height_sections[2]*1/2+5)
    .attr("x", -25 -width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag wave")
    .text("Altura de la Ola");   
    
    svg.append("text")
    .attr("y", height_sections[2])
    .attr("x", width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag")
    .text("Altura Significativa");  

    svg.append("text")
    .attr("y",(height_sections[2]+(total_height-height_sections[2])*(1/3)))
    .attr("x", width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag")
    .text("Altura Maxima");  

    svg.append("text")
    .attr("y", (height_sections[2]+(total_height-height_sections[2])*(2/3)))
    .attr("x", width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag")
    .text("Periodo(s)");  
    
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