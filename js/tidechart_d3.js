
function renderChart(data){
	console.log(data);
	console.log("Rendering");
	let myFormatter = d3.timeFormatLocale({
		"decimal": ".",
		"thousands": ",",
		"grouping": [3],
		"currency": ["$", ""],
		"dateTime": "%a %b %e %X %Y",
		"date": "%m/%d/%Y",
		"time": "%H:%M:%S",
		"periods": ["AM", "PM"],
	"days":["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
	"shortDays": ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
  "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
	});
    //data_waves = data.map(x => ({"date":x.date,"wave_height_sig":x.wave_height_sig}))
    // let dates = data.map(x=> (new Date(x.date)).getHours());
    let dates = data.tides_entries.map(x=> ((new Date(x.date))));
	let tides_entries = data.tides_entries.map(x=>(x.tide_height));
	let medium_level = data.medium_level;
	let mean_highest_tides = data.mean_highest_tides;
	console.log(dates);
	console.log(tides_entries);
    console.log("Charts ");
    // var margin = {top: 20, right: 20, bottom: 72, left: 180},
    // width = 960 - margin.left - margin.right,
    // height = 350 - margin.top - margin.bottom;
    let total_width = 1000;
    let total_height = 350;
    let width_sections = [total_width*0.11,total_width*0.02,total_width*0.82];
    let height_sections = [total_height*0.15,total_height*0.65, total_height*0.20];
    
    let width_offset = 0;
    width_sections= width_sections.map((v,i)=>{let v_o = width_offset; width_offset += v; return v_o})
    let height_offset = 0;
    height_sections = height_sections.map((v,i)=>{v_o = height_offset; height_offset += v; return v_o})
    console.log(width_sections);
    console.log(height_sections);
	let dates_days = [];
	let dates_hours = [];
	
	
	for(let date in dates){
        date = parseInt(date);
        if(date+1 < dates.length){
            if(dates[date].getDay() != dates[date+1].getDay()){
				console.log("date day",dates[date]);
                dates_days.push(dates[date]);
            }
        }
        else{
            dates_days.push(dates[date]);
        }
	}
	console.log(dates_days[0]);
	let start_date = new Date(dates_days[0].getTime());
	let end_date = new Date(dates_days[dates_days.length-1].getTime() + 86400000);
	
	
	
	end_date = new Date(end_date.setHours(0,0));
	start_date = new Date(start_date.setHours(0,0));
	

	console.log("start date:" ,start_date);
    for(let date = start_date.getTime(); date < end_date.getTime();date += 21600000){
        dates_hours.push(new Date(date));
	}
	
	console.log("dates_days",dates_days);
	console.log("dates_hours",dates_hours);
// set the ranges
bar_padding = 0.2;

var x_dates_linear = d3.scaleLinear()
		  .range([width_sections[2],total_width]);
var x_dates = d3.scaleBand()
          .range([width_sections[2],total_width])
		  .padding(bar_padding);
var x_days = d3.scaleBand()
		  .range([width_sections[2],total_width]);
var x_hours = d3.scaleBand()
.range([width_sections[2],total_width]);
		  
var x_tides = d3.scaleLinear()
		  .range([width_sections[2],total_width]);


x_dates_linear.domain([d3.min(dates_days),d3.max(dates_days)]);
x_dates.domain(dates);
x_days.domain(dates_days);
x_tides.domain(tides_entries);
x_hours.domain(dates_hours);

var y = d3.scaleLinear()
.range([height_sections[2], height_sections[1]]);

y.domain([d3.min(tides_entries)<0?(d3.min(tides_entries)-0.2):0, d3.max(tides_entries) + 0.5]);

tick_values = [];
for(tick = d3.min(tides_entries)<0?(d3.min(tides_entries)-0.2):0; tick < d3.max(tides_entries) ; tick +=0.5){
	tick_values.push(tick);
}

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
//   format_data = data.map(d =>{d.wave_height_max = d.wave_height_max - d.wave_height_sig;
//     return d;})
//   console.log("Formatted data:",format_data)
  // Scale the range of the data in the domains


  svg.append("g").selectAll("g").data(dates_days).enter().append("rect").
  			attr("class", "background-rect")
          .attr("x", function(d){console.log(d);return x_days(d);})
          .attr("width", x_days.bandwidth())
          .attr("y", 0 )
		  .attr("height", function(d,i){ return (i%2===0)?height_sections[2]:0});
   
  let line = d3.line()
	  .x((d,i)=>(x_dates_linear(dates[i])))
	  .y((d)=>(y(d)))
	  .curve(d3.curveMonotoneX);
  
   let area = d3.area()
  .x((d,i) =>{ return x_dates_linear(dates[i]); })
  .y0(height_sections[2])
  .y1((d) =>{ return y(d); }).curve(d3.curveMonotoneX);

  svg.append("g").append("path").datum(tides_entries).attr("class","area").attr("d",area);
  svg.append("g").append("path").datum(tides_entries).attr("class","tide-graph-line").attr("d",line);
  svg.append("g").append("line")
			.attr("class","medium-height-line")
			.attr("x1",width_sections[2])
			.attr("y1",y(medium_level))
			.attr("x2",total_width)
			.attr("y2",y(medium_level));
			let today = new Date(); 

  svg.append("g").append("line")
			.attr("class","mean-heightest-line")
			.attr("x1",width_sections[2])
			.attr("y1",y(mean_highest_tides))
			.attr("x2",total_width)
			.attr("y2",y(mean_highest_tides));
 
  svg.append("g").append("line")
			.attr("class","mean-heightest-line")
			.attr("x1",width_sections[2])
			.attr("y1",y(mean_highest_tides))
			.attr("x2",total_width)
			.attr("y2",y(mean_highest_tides));

  svg.append("g").append("line")
			.attr("class","today-line")
			.attr("x1",x_dates_linear(today))
			.attr("y1",height_sections[1])
			.attr("x2",x_dates_linear(today))
			.attr("y2",height_sections[2]);
svg.append("g").append("line")
			.attr("class","cero-line")
			.attr("x1",width_sections[2])
			.attr("y1",y(0))
			.attr("x2",total_width)
			.attr("y2",y(0));

  // add the x Axis
//   date_ticks= dates_days.map((d)=>((new Date(d)).toLocalDateString("es-ES",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })));
//   console.loge(date_ticks);
  svg.append("g")
      .attr("transform", "translate(0,"+height_sections[1]*1/2+")")
      .attr("class","axis-top hours")
      .call(d3.axisBottom(x_hours).tickFormat(d3.timeFormat("%H")));
    svg.append("g")
      .attr("transform", "translate(0,"+height_sections[0]+")")
      .attr("class","axis-top days")
	  .call(d3.axisBottom(x_days).tickFormat(myFormatter.format("%A %d, %B")));
	svg.append("g")
	.attr("transform", "translate("+(width_sections[1]+10)+","+(height_sections[0] - 6)+")")
	.attr("class","axis-left height")
	.call(d3.axisLeft(y).tickValues(tick_values).tickFormat(d3.format(",.1f")));
	
  
    
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
    .attr("transform", "rotate(-90,"+width_sections[0] + width_sections[1]*1/2+","+height_sections[2]+")")
    .attr("y", height_sections[2])
    .attr("x",width_sections[0] + width_sections[1]*1/2)
    .attr("dy", "1em")
    .attr("class","axis-tag h")
    .text("Altura (m)");   
  
	symbology_grid_size =32;
	//Simbología
	svg.append("circle")
	.attr("cy", height_sections[2] + 1/2*(total_height-height_sections[2] +20))
    .attr("cx",width_sections[2] + (2/symbology_grid_size)*(total_width-width_sections[2]))
    .attr("r", "5")
	.attr("class","symbology-circle");
	
	svg.append("text")
    .attr("y", height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + (3/symbology_grid_size)*(total_width-width_sections[2])-10)
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("Marea");
	svg.append("g").append("line")
			.attr("class","cero-line")
			.attr("x1",width_sections[2] + (5/symbology_grid_size)*(total_width-width_sections[2])-10)
			.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
			.attr("x2",width_sections[2] + (6/symbology_grid_size)*(total_width-width_sections[2])-10)
			.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	svg.append("text")
    .attr("y",height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 6/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("0 Metros");
	svg.append("g").append("line")
	.attr("class","medium-height-line")
	.attr("x1",width_sections[2] + (9/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
	.attr("x2",width_sections[2] + (10/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	
	svg.append("text")
    .attr("y",height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 10/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("Nivel Medio");
	svg.append("g").append("line")
	.attr("class","mean-heightest-line")
	.attr("x1",width_sections[2] + (14/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
	.attr("x2",width_sections[2] + (15/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	svg.append("text")
    .attr("y", height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 15/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("Promedio de mareas más altas");

	svg.append("g").append("line")
	.attr("class","today-line")
	.attr("x1",width_sections[2] + (22/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
	.attr("x2",width_sections[2] + (23/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	svg.append("text")
    .attr("y", height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 23/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("Hora Local");


}
function main(){
	let promises = [];
	promises.push(axios.get("https://miocimar-test.herokuapp.com/api/tide_regions/39/"));
	promises.push(axios.get("https://miocimar-test.herokuapp.com/api/tide_regions/39/weekly_view/"))
	

	 
	axios.all(promises).then(function(results){
		let final_data = {};
		final_data["medium_level"] = results[0].data["medium_level"];
		final_data["mean_highest_tides"] = results[0].data["mean_highest_tides"];
		final_data["tides_entries"] = results[1].data;


		console.log(results);
		renderChart(final_data);
	});
	

}

main();