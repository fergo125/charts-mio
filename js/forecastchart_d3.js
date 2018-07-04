

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
    let dates = data.map(x=> (new Date(x.date)).getHours());
    console.log(dates);
    let waves = data.map(x=> x.wave_height_sig);
    console.log(waves);
    
    // let dates_scale = Chart.Scale.extend({});
    // Chart.scaleService.registerScaleType('myScale', MyScale, defaultConfigObject);
    // let sighight_scale = Chart.Scale.extend({});
    // let waves_scale = Chart.Scale.extend({});
    // let dir_scale = Chart.Scale.extend({});
    // let period_scale = Chart.Scale.extend({});

    console.log("Charts ")
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
  // format the data


  // Scale the range of the data in the domains
  x.domain(dates);
  y.domain([0, 3]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(new Date(d.date).getHours()); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.wave_height_sig); })
      .attr("height", function(d) { return height - y(d.wave_height_sig); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));



}
function main(){
    var data = axios.get("https://miocimar-test.herokuapp.com/api/local_forecasts/15/weekly_view/")
    .then(function(response){
        console.log(response);
        renderChart(response.data); 
    });

}

main();