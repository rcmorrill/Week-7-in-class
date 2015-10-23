/*Start by setting up the canvas */
var margin = {t:50,r:50,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

/* Scales */
var scaleX = d3.scale.log().range([0,width]),
    scaleY = d3.scale.log().range([height,0]),
    scaleR = d3.scale.sqrt().range([10,50]);

//Axis generator
var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height,0)
    .scale(scaleX);
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width,0)
    .scale(scaleY);



queue()
    .defer(d3.csv,'data/world_bank_1995_gdp_co2.csv',parse)
    .defer(d3.csv,'data/world_bank_2010_gdp_co2.csv',parse)
    .await(function(err,data1995,data2010){

        scaleX.domain( d3.extent(data1995, function(d){
            return d.gdpPerCap; })
        );
        scaleY.domain( d3.extent(data1995, function(d){ return d.co2PerCap; }));
        scaleR.domain( d3.extent(data1995, function(d){ return d.co2Total; }));

        //Draw axes
        plot.append('g')
            .attr('class','axis axis-x')
            .attr('transform','translate(0,'+height+')')
            .call(axisX);
        plot.append('g')
            .attr('class','axis axis-y')
            .call(axisY);

        console.log(data1995);
        console.log(data2010);

        d3.selectAll('.btn').on('click',function(){
            //find out which year is clicked
            var year = d3.select(this).attr('id');

            if(year == 'year-1995'){
                    draw(data1995);
            }else{
                    draw(data2010);
            }
        })



    });

function draw(data){
    var nodes = plot.selectAll('.country') //unknown length
        .data(data, function(d){return d.cCode});//unknown

    var nodesEnter = nodes.enter().append('g')
        .attr('class','country')
        /*.attr('transform',function(d){
            return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.gdpPerCap)+')';
        });*/
        .on('click', function(d){
            d3.select(this).select('circle')
                .style('fill','red');
        })

        nodesEnter.append('circle')
        .attr('r',function(d){
            return scaleR(d.co2Total);
        })
        .style('fill','rgba(80,80,80,.3)')
        .style('stroke','rgb(50,50,50)')
        .style('stroke-width','1px');
        nodesEnter.append('text')
            .text(function(d){
                return d.cCode;
            })
    nodes.exit()
        .remove()
    nodes//update selection
        .transition()
        /*.delay(function(d,i){
            return i*200
        })*/
        //.duration(1000)
        .attr('transform',function(d){
            return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.co2PerCap)+')';
        })
        .select('circle')
        .attr('r',function(d){
            return scaleR(d.co2Total);
        })

    console.log(nodes);

};
function parse(row){
    //@param row is each unparsed row from the dataset

    var parsedRow = {
      cName: row['Country Name'],
      cCode: row['Country Code'],
      gdpPerCap: +row["GDP per capita, PPP (constant 2011 international $)"],
      co2PerCap: +row["CO2 emissions (metric tons per capita)"],
      co2Total: +row["CO2 emissions (kt)"]
    };

    if( parsedRow.gdpPerCap && parsedRow.co2PerCap && parsedRow.co2Total){
        return parsedRow;
    }
    else{
        //if any one of the three data columns is missing data, eliminate that row
        return;
    }
}