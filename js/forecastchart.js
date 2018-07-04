

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
    options= {
        responsive:true, 
        maintainAspectRatio: false,
    };
    let chart_options = {
        type: 'bar',
        data: {
            // labels:dates,
            datasets: [
                {
                    label:"Altura significativa de la ola",
                    backgroundColor: '#52C6FF',
                    borderColor: '#52C6FF',
                    data: waves,
                    yAxisID:"y-axis"
                },
            ]
        },
        options: {
            responsive:true, 
            maintainAspectRatio: false,
            legend:{
                display:true,
                position:"left",
                labels: {
                    boxWidth:0,
                    rotation: 180
                }
            },
            // legendCallback: function(chart) {
            //     return "<p> Altura siginificativa de la ola</p>";
            //    },
            scales:{
                xAxes:[
                    {
                    type:'category',
                    position:"top",
                    labels:dates,
                    label: "Hora"
                }
            ],
                yAxes:[
                    {
                    id:"y-axis",
                    type:'linear',
                    postion:"left",
                    ticks:{
                        min:0,
                        max:3
                    }
                },
            ]
            }
        }
    };
    var element = document.getElementById("forecastchart");
    var chart = new Chart(element,chart_options);
    chart.generateLegend();
}
function main(){
    var data = axios.get("https://miocimar-test.herokuapp.com/api/local_forecasts/15/weekly_view/")
    .then(function(response){
        console.log(response);
        renderChart(response.data); 
    });

}

main();