
function renderChart(data){
    console.log("Rendering")
    //data_waves = data.map(x => ({"date":x.date,"wave_height_sig":x.wave_height_sig}))
    // let dates = data.map(x=> (new Date(x.date)).getHours());
    let dates = data.map(x=> (new Date(x.date)));
    let wind_speed = data.map(x=> x.wind_speed);
    let wind_burst = data.map(x=> x.wind_burst);
    let dates_days = [];
    let dir_wind = data.map(x => x.wind_direction);

    console.log("Charts ")
    // var margin = {top: 20, right: 20, bottom: 72, left: 180},
    // width = 960 - margin.left - margin.right,
    // height = 350 - margin.top - margin.bottom;
    let total_width = 960;
    let total_height = 300;
    let width_sections = [total_width*0.14,total_width*0.01,total_width*0.85];
    let height_sections = [total_height*0.15,total_height*0.5, total_height*0.35];
    
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
// set the ranges
bar_padding = 0.2;

var x_dates = d3.scaleBand()
          .range([width_sections[2],total_width])
          .padding(bar_padding);
var x_speed = d3.scaleBand()
            .range([width_sections[2],total_width])
            .padding(bar_padding);

var x_burst = d3.scaleBand()
.range([width_sections[2],total_width])
.padding(bar_padding);

var x_days = d3.scaleBand()
.range([width_sections[2],total_width]);

var x_direction = d3.scaleBand()
.range([width_sections[2],total_width]);

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
  lines_margin = 23;
  format_data = data.map(d =>{d.wind_burst = d.wind_burst - d.wind_speed;
    return d;});
  // Scale the range of the data in the domains
  x_dates.domain(dates);
  x_days.domain(dates_days);
  x_speed.domain(wind_speed);
  x_burst.domain(wind_burst);
  x_direction.domain(dir_wind);

  y.domain([0, d3.max(wind_burst) + 1.5]);

  svg.append("g").selectAll("g").data(dates_days).enter().append("rect").
  attr("class", "background-rect")
          .attr("x", function(d){console.log(d);return x_days(d);})
          .attr("width", x_days.bandwidth())
          .attr("y", 0 )
          .attr("height", function(d,i){ return (i%2===0)?height_sections[2]:0});
  svg.append("g").selectAll("g").data(d3.stack().keys(["wind_speed","wind_burst"])(format_data))
  .enter().append("g")
  .selectAll(".bar")
    .data(function(d){return d;})
    .enter().append("rect")
      .attr("fill", (d)=>{ 
        if(d[0]==0){
          if(d[1]< 25) return "#03EAC3";
          if(d[1]> 25 && d[1]< 35) return "#17CCAA";
          if(d[1]> 35 ) return "#10AF90";
      }
    else{
      return "#025B4A";
    }})
      .attr("x", function(d, i) { _x = x_dates(new Date(d.data.date));return _x; })
      .attr("width", x_dates.bandwidth())
      .attr("y", function(d) { _y = y(d[1]);return _y; })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });    

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
      .attr("class","bottom-section axis-top speed")
      .call(d3.axisBottom(x_speed).tickFormat(d3.format(",.1f")));
    svg.append("g")
      .attr("transform", "translate(0,"+(height_sections[2]+(total_height-height_sections[2])*(1/5))+")")
      .attr("class","bottom-section axis-top burst")
      .call(d3.axisBottom(x_burst).tickFormat(d3.format(",.1f")));
	let arrow_width = 15;
	let arrow_height = 15;
	let arrow_margin_top = 5;
	let arrow_margin_left = 5;
	svg.append("g").selectAll("g").data(dir_wind).enter()
	.append("svg:image")
	.attr("xlink:href","flecha_2.svg")
	.attr("transform",(d,i)=>{
		x_pos = x_dates(dates[i]) + arrow_margin_left + arrow_width/2;
		y_pos = height_sections[2]+(total_height-height_sections[2])*(2/5) + arrow_margin_top + arrow_height/2;
		transformation = "rotate("+ d +" "+x_pos+" "+y_pos+")";
		return transformation;
	})
	.attr("x",(d,i)=>{
		return x_dates(dates[i]) + arrow_margin_left ;
	})
	.attr("y",height_sections[2]+(total_height-height_sections[2])*(2/5) + arrow_margin_top)
	.attr("width",arrow_width)
	.attr("height",arrow_height);

    svg.append("g")
      .attr("transform", "translate(0,"+(height_sections[2]+(total_height-height_sections[2])*(3/5))+")")
      .attr("class","bottom-section axis-top p")
      .call(d3.axisBottom(x_direction).tickFormat((d)=>{
        dir = ((d-180)<0)? d+180: d-180; 
        // Tanto el rango como el label es hacía donde va el vector. 
        if(348.75 < dir || dir <= 11.25)return 'N';
        if(11.25 < dir && dir <= 33.75)return 'NNE';
        if(33.75 < dir && dir <= 56.25)return 'NE';
        if(56.25 < dir && dir <= 78.75)return 'ENE';
        if(78.75 < dir && dir <= 101.25)return 'E';
        if(101.25 < dir && dir <= 123.75)return 'ESE';
        if(123.75 < dir && dir <= 146.25)return 'SE';
        if(146.25 < dir && dir <= 168.75)return 'SSE';
        if(168.75 < dir && dir <= 191.25)return 'S';
        if(191.25 < dir && dir <= 213.75)return 'SSW';
        if(213.75 < dir && dir <= 236.25)return 'SW';
        if(236.25 < dir && dir <= 258.75)return 'WSW';
        if(258.75 < dir && dir <= 281.25)return 'W';
        if(281.25 < dir && dir <= 303.75)return 'WNW';
        if(303.75 < dir && dir <= 326.25)return 'NW';
        if(326.25 < dir && dir <= 348.75)return 'NNW';
        
      }));
    
    svg.append("text")
      .attr("y", height_sections[0] + 5)
      .attr("x", width_sections[1] )
      .attr("dy", "1em")
      .attr("class","axis-tag")
      .text("Día"); 
    
    svg.append("text")
    .attr("y", height_sections[0] + height_sections[1]*1/2 +5)
    .attr("x", width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag")
    .text("Hora");   

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", height_sections[2]*3/5+5)
    .attr("x", -5 -width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag wave")
    .text("Velocidad del viento");   
    
    svg.append("text")
    .attr("y", height_sections[2] +5)
    .attr("x", width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag speed")
    .text("Velocidad (km/h)");  

    svg.append("text")
    .attr("y",(height_sections[2]+(total_height-height_sections[2])*(1/5) +5))
    .attr("x", width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag burst")
    .text("Ráfaga (km/h)");  

    svg.append("text")
    .attr("y", (height_sections[2]+(total_height-height_sections[2])*(2/5) +5))
    .attr("x", width_sections[1])
    .attr("dy", "1em")
    .attr("class","axis-tag")
    .text("Dirección");

    
//   add the y Axis
//   svg.append("g")
//       .call(d3.axisLeft(y));



}
function main(){
	format = {
		"decimal": ".",
  		"thousands": ",",
		"days":["Domingo","Lunes","Martes","Miercoles","Jueves","Sabado"],
		"months":["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
	};
	d3.formatDefaultLocale(format);
	var data = axios.get("https://miocimar-test.herokuapp.com/api/local_forecasts/15/weekly_view/")
    .then(function(response){
        console.log(response);
        renderChart(response.data); 
    });

}

main();