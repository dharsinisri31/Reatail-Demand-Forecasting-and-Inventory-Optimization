const API_URL = "http://127.0.0.1:5000/predict";

/* =========================
   TRAINED GRAPH
========================= */

Plotly.newPlot('trainedGraph',[

{
    x:[1,2,3,4,5,6,7,8,9,10],
    y:[100,120,140,170,200,230,210,260,280,320],
    type:'scatter',
    mode:'lines+markers',
    name:'Historical Sales',
    line:{
        color:'#00ffc6',
        width:4
    }
},

{
    x:[11,12,13,14],
    y:[340,360,390,420],
    type:'scatter',
    mode:'lines+markers',
    name:'Forecast',
    line:{
        color:'#ff4d6d',
        width:4,
        dash:'dot'
    }
}

],{

paper_bgcolor:'#111827',
plot_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});

/* =========================
   DAILY
========================= */

Plotly.newPlot('dailyChart',[{

x:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
y:[120,150,170,160,220,240,260],
type:'bar',
marker:{
    color:'#00ffc6'
}

}],{

paper_bgcolor:'#111827',
plot_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});

/* =========================
   WEEKLY
========================= */

Plotly.newPlot('weeklyChart',[{

x:['W1','W2','W3','W4'],
y:[1000,1200,1400,1600],
type:'scatter',
mode:'lines+markers',
line:{
    color:'#00ffc6',
    width:4
}

}],{

paper_bgcolor:'#111827',
plot_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});



Plotly.newPlot('monthlyChart',[{

x:['Jan','Feb','Mar','Apr'],
y:[3000,4500,6000,8000],
type:'scatter',
mode:'lines+markers',
line:{
    color:'#00ffc6',
    width:4
}

}],{

paper_bgcolor:'#111827',
plot_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});


Plotly.newPlot('actualChart',[

{
x:[1,2,3,4,5],
y:[100,150,170,210,260],
name:'Actual',
type:'scatter',
line:{
    color:'#00ffc6'
}
},

{
x:[1,2,3,4,5],
y:[110,145,180,200,255],
name:'Predicted',
type:'scatter',
line:{
    color:'#ff4d6d'
}
}

],{

paper_bgcolor:'#111827',
plot_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});


Plotly.newPlot('lossChart',[

{
x:[1,2,3,4,5],
y:[0.8,0.6,0.4,0.3,0.2],
name:'Training Loss',
type:'scatter',
line:{
    color:'#00ffc6'
}
},

{
x:[1,2,3,4,5],
y:[0.9,0.7,0.5,0.35,0.25],
name:'Validation Loss',
type:'scatter',
line:{
    color:'#ff4d6d'
}
}

],{

paper_bgcolor:'#111827',
plot_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});


Plotly.newPlot('comparisonChart',[{

x:['Accuracy','RMSE','Speed'],
y:[94,15,70],
name:'LSTM',
type:'bar',
marker:{
    color:'#00ffc6'
}

},

{

x:['Accuracy','RMSE','Speed'],
y:[91,22,90],
name:'GRU',
type:'bar',
marker:{
    color:'#ff4d6d'
}

}

],{

barmode:'group',
paper_bgcolor:'#111827',
plot_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});


Plotly.newPlot('inventoryChart',[{

values:[40,30,20,10],
labels:['Optimal','Overstock','Low Stock','Safety'],
type:'pie'

}],{

paper_bgcolor:'#111827',
font:{color:'white'}

},
{
displayModeBar:false,
responsive:true
});


async function predictDemand() {

    try {

        const store =
        document.getElementById("store").value;

        const dept =
        document.getElementById("dept").value;

        const sales =
        document.getElementById("sales").value;

        const holiday =
        document.getElementById("holiday").value;

        const temperature =
        document.getElementById("temp").value;

        const fuel =
        document.getElementById("fuel").value;

        const cpi =
        document.getElementById("cpi").value;

        const unemployment =
        document.getElementById("unemployment").value;

        // =========================
        // VALIDATION
        // =========================

        if(
            !store ||
            !dept ||
            !sales ||
            !temperature ||
            !fuel ||
            !cpi ||
            !unemployment
        ){

            alert("Please fill all fields");

            return;
        }

        // =========================
        // API REQUEST
        // =========================

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                Store: store,

                Dept: dept,

                Weekly_Sales: sales,

                Holiday_Flag: holiday,

                Temperature: temperature,

                Fuel_Price: fuel,

                CPI: cpi,

                Unemployment: unemployment

            })
        });

        const data = await response.json();

        // =========================
        // UPDATE OUTPUT
        // =========================

        const prediction =
        parseFloat(data.prediction).toFixed(2);

        document.getElementById("forecast").innerHTML =
        "$ " + prediction;

        document.getElementById("inventory").innerHTML =
        Math.round(prediction * 1.2);

        if(prediction > 50000){

            document.getElementById("status").innerHTML =
            "HIGH DEMAND";

        }
        else{

            document.getElementById("status").innerHTML =
            "NORMAL";

        }

        // =========================
        // FUTURE FORECAST GRAPH
        // =========================

        Plotly.newPlot(

            'futureSalesChart',

            [

                {

                    x:[
                        'Current',
                        'Week 1',
                        'Week 2',
                        'Week 3',
                        'Week 4',
                        'Week 5'
                    ],

                    y:[

                        prediction * 0.85,

                        prediction * 0.92,

                        prediction,

                        prediction * 1.08,

                        prediction * 1.15,

                        prediction * 1.22
                    ],

                    type:'scatter',

                    mode:'lines+markers',

                    name:'Forecast',

                    line:{
                        color:'#00ffc6',
                        width:5,
                        shape:'spline'
                    },

                    marker:{
                        size:10
                    },

                    fill:'tozeroy',

                    fillcolor:'rgba(0,255,198,0.15)'
                }

            ],

            {

                paper_bgcolor:'#111827',

                plot_bgcolor:'#111827',

                font:{
                    color:'white'
                },

                title:'Future AI Forecast'

            },

            {
                responsive:true,
                displayModeBar:false
            }

        );

        // =========================
        // UPDATE HISTORICAL GRAPH
        // =========================

        loadHistoricalData();

    }
    catch(error){

        console.log(error);

    }
}


