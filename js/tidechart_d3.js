


function renderChart(data){
	console.log(data);
	console.log("Rendering");
	let local_timezone = "America/Costa_Rica";
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
	let dates = data.tides_entries.map(x=> {
		return new Date(x.date);
	});
    
	let tides_entries = data.tides_entries.map(x=>(x.tide_height));
	if(dates.length > 1){
		while(moment(dates[0]).tz("America/Costa_Rica").format("dddd") == moment(dates[1]).tz("America/Costa_Rica").format("dddd") ){
			dates.splice(0,1);
            tides_entries.splice(0,1);
		}
		while(moment(dates[dates.length-1]).tz("America/Costa_Rica").format("dddd") == moment(dates[dates.length -2]).tz("America/Costa_Rica").format("dddd") ){
			dates.splice(dates.length-1,1);
			tides_entries.splice(tides_entries.length-1,1);
		}
	}
	
	

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
    let height_sections = [total_height*0.08,total_height*0.72, total_height*0.20];
    
    let width_offset = 0;
    width_sections= width_sections.map((v,i)=>{let v_o = width_offset; width_offset += v; return v_o});
    let height_offset = 0;
    height_sections = height_sections.map((v,i)=>{let v_o = height_offset; height_offset += v; return v_o});
    console.log(width_sections);
    console.log(height_sections);
	let dates_days = [];
	let dates_hours = [];
	dates_days.push(dates[0]);

	for(let date in dates){
        date = parseInt(date);
        console.log(moment(dates[date]).tz("America/Costa_Rica").format("dddd"));
        if(date-1 > 0){
            if(moment(dates_days[dates_days.length-1]).tz("America/Costa_Rica").format("dddd") != moment(dates[date]).tz("America/Costa_Rica").format("dddd")){
				console.log("date day",dates[date]);
                dates_days.push(dates[date]);
            }
        }
	}
	days_bands = [];
	let total_time = 0;
	for(date in dates_days){
        date = parseInt(date);
        
		if(date == 0){
            current_date = new Date(dates[1]);
            current_date.setHours(0,0,0,0);
			time = current_date.getTime() - dates[0].getTime();
			total_time += time;
			days_bands.push(time);
		}
		if(date == dates_days.length-1){
            current_date = new Date(dates[dates.length -1]);
            current_date.setHours(0,0,0,0);
			time = dates[dates.length-1].getTime() - current_date.getTime() ;
			total_time += time;
			days_bands.push(time);
		}
		if(date > 0 && date < dates_days.length-1){
			time = 86400000;
			total_time += time;
			days_bands.push(time);
		}
	}
	console.log(days_bands);
	console.log(total_time);
	console.log(days_bands[0]/total_time);
	console.log(days_bands[days_bands.length-1]/total_time);
	graph_head_start = width_sections[2];
	graph_head_end = width_sections[2] + (total_width-width_sections[2])*(days_bands[0]/total_time);

	graph_tail_start = total_width - (total_width-width_sections[2])*(days_bands[days_bands.length-1]/total_time);
	graph_tail_end = total_width;
	

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

var x_days_head = d3.scaleBand()
		  .range([graph_head_start,graph_head_end]);

var x_days_tail = d3.scaleBand()
		  .range([graph_tail_start,graph_tail_end]);

var x_days = d3.scaleBand()
		  .range([graph_head_end,graph_tail_start]);

var x_hours = d3.scaleBand()
.range([width_sections[2],total_width]);
		  
var x_tides = d3.scaleLinear()
		  .range([width_sections[2],total_width]);


x_dates_linear.domain([d3.min(dates), d3.max(dates)]);
x_dates.domain(dates);
dates_days.splice(0,1)
dates_days.splice(dates_days.length-1,1);
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

  let bar_index = 0;
  svg.append("g").selectAll("g").data([1]).enter().append("rect").
  			attr("class", "background-rect")
          .attr("x", graph_head_start)
          .attr("width", graph_head_end - graph_head_start)
          .attr("y", 0 )
          .attr("height", function(d,i){ 
              render =  (bar_index%2===0)?height_sections[2]:0;
              ++bar_index;
              return render;});

  svg.append("g").selectAll("g").data(dates_days).enter().append("rect").
  			attr("class", "background-rect")
          .attr("x", function(d){console.log(d);return x_days(d);})
          .attr("width", x_days.bandwidth())
          .attr("y", 0 )
          .attr("height",function(d,i){ 
            render =  (bar_index%2===0)?height_sections[2]:0;
            ++bar_index;
            return render;});
    svg.append("g").selectAll("g").data([1]).enter().append("rect").
            attr("class", "background-rect")
        .attr("x", graph_tail_start)
        .attr("width", graph_tail_end- graph_tail_start)
        .attr("y", 0 )
        .attr("height", function(d,i){ 
          render =  (bar_index%2===0)?height_sections[2]:0;
          ++bar_index;
          return render;});
   
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

 
	
	svg.append("g")
      .attr("transform", "translate(0,"+height_sections[0]+")")
      .attr("class","axis-top days")
	//   .call(d3.axisBottom(x_days).tickFormat(myFormatter.format("%A %d/%m")));
	.call(d3.axisBottom(x_days).tickFormat(
		function(d){
			return moment(d).tz("America/Costa_Rica").format("dddd DD/MM","es");
		}
	));
	
	svg.append("g")
	.attr("transform", "translate("+(width_sections[1]+10)+","+(height_sections[0] - 6)+")")
	.attr("class","axis-left height")
	.call(d3.axisLeft(y).tickValues(tick_values).tickFormat(d3.format(",.1f")));
	
  
    
    svg.append("text")
      .attr("y", height_sections[0] + 5)
      .attr("x", width_sections[1] )
      .attr("dy", "1em")
      .attr("class","axis-tag")
      .text("día"); 
    
    

    svg.append("text")
    .attr("transform", "rotate(-90,"+width_sections[0] + width_sections[1]*1/2+","+height_sections[2]+")")
    .attr("y", height_sections[2])
    .attr("x",width_sections[0] + width_sections[1]*1/2)
    .attr("dy", "1em")
    .attr("class","axis-tag h")
    .text("altura (m)");   
  
	symbology_grid_size =32;
	date_bisector = d3.bisector(function(d){return d;}).left;

	//Tooltip
	tooltip = svg.append("g")
		.attr("class","tooltip")
		.style("display","none");
	tooltip.append("rect").attr("width",220).attr("height",50);
	
	// tooltip.append("line")
	// 	// .attr("class","tooltip-line")
	// 	.attr("class","today-line")
	// 	.attr("x1",total_width)
	// 	.attr("x2",total_width)
	// 	.attr("y1",total_height)
	// 	.attr("x2",total_height);
		
	tooltip.append("circle")
		.attr("r",5);
	
	texts = tooltip.append("g").attr("class","tooltip-text");
		texts.append("text").attr("class","time-text").attr("x","-95").attr("y","-40");
		texts.append("text").attr("class","high-text").attr("x","-40").attr("y","-25");

	svg.on("mousemove",function(){
		pos_x = d3.mouse(this)[0];
		pos_y = d3.mouse(this)[1];
		if(pos_x > width_sections[2] && pos_x < total_width &&
			pos_y > height_sections[1] && pos_y < height_sections[2]){
				tooltip.style("display",null);
				date_value = x_dates_linear.invert(pos_x);
				i = date_bisector(dates,date_value,1);
				i = date_value - dates[i-1] < dates[i] - date_value ? (i-1): i;
				tooltip.select("line")
					.attr("x1",x_dates_linear(dates[i]))
					.attr("y1",height_sections[2])
					.attr("x2", x_dates_linear(dates[i]))
					.attr("y2",height_sections[1] );
				tooltip.select("circle")
					.attr("cx",x_dates_linear(dates[i]))
					.attr("cy",y(tides_entries[i]));
				texts = tooltip.select(".tooltip-text")
					.attr("transform","translate("+x_dates_linear(dates[i])+","+y(tides_entries[i])+")");
				text_width = texts.select(".time-text").text(moment(dates[i]).tz("America/Costa_Rica").format("dddd DD, MMMM • hh:mm a")).getBBox();
				texts.select(".high-text").text("Altura: " +tides_entries[i] +" m");
				tooltip.select("rect").attr("x",x_dates_linear(dates[i])-100).attr("y",y(tides_entries[i])-60)
					.attr("width",text_width);	
		}
		else{
			tooltip.style("display","none");
		}

	});
	
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
	.text("marea");
	svg.append("g").append("line")
			.attr("class","cero-line")
			.attr("x1",width_sections[2] + (6/symbology_grid_size)*(total_width-width_sections[2])-10)
			.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
			.attr("x2",width_sections[2] + (7/symbology_grid_size)*(total_width-width_sections[2])-10)
			.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	svg.append("text")
    .attr("y",height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 7/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("0 metros");
	svg.append("g").append("line")
	.attr("class","medium-height-line")
	.attr("x1",width_sections[2] + (11/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
	.attr("x2",width_sections[2] + (12/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	
	svg.append("text")
    .attr("y",height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 12/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("nivel medio");
	svg.append("g").append("line")
	.attr("class","mean-heightest-line")
	.attr("x1",width_sections[2] + (16/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
	.attr("x2",width_sections[2] + (17/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	svg.append("text")
    .attr("y", height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 17/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("promedio de mareas más altas");

	svg.append("g").append("line")
	.attr("class","today-line")
	.attr("x1",width_sections[2] + (25/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y1",height_sections[2] + 1/2*(total_height-height_sections[2])+10)
	.attr("x2",width_sections[2] + (26/symbology_grid_size)*(total_width-width_sections[2])-10)
	.attr("y2",height_sections[2] + 1/2*(total_height-height_sections[2])+10);
	svg.append("text")
    .attr("y", height_sections[2] + 1/2*(total_height-height_sections[2]))
    .attr("x",width_sections[2] + 26/symbology_grid_size*(total_width-width_sections[2]))
    .attr("dy", "1em")
    .attr("class","symbology-tag")
	.text("hora actual");
}
function main(){
	let promises = [];
	promises.push(axios.get("https://miocimarv2.herokuapp.com/api/tide_regions/39/"));
	promises.push(axios.get("https://miocimar-test.herokuapp.com/api/tide_regions/39/search_date/?start=2018-08-23T06:00:00Z&end=2018-08-30T06:00:00Z"));
	

	 
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