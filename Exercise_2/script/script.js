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

var dataset1 = [
    {x:100, y:300, name:"red", r:50, color:"red"},
    {x:400, y:300, name:"blue", r:50, color:"blue"},
    {x:800, y:300, name:"green", r:50, color:"green"}
];

var dataset2 = [
    {x:150, y:300, name:"red", r:80, color:"red"},
    {x:450, y:300, name:"green", r:100, color:"green"}
];

var dataset3 = [
    {x:100, y:300, name:"yellow", r:20, color:"yellow"},
    {x:400, y:300, name:"blue", r:30, color:"blue"},
    {x:800, y:300, name:"green", r:20, color:"green"},
    {x:800, y:500, name:"purple", r:30, color:"purple"}
];


//TASK 1.1: represent dataset 1 using <circle>

/*plot.selectAll('.node')
.data(dataset1)
.enter()
.append('circle')
.attr('class','node')
.attr('cx', function(d){return d.x;})
.attr('cy', function(d){return d.y;})
.attr('r', function(d){return d.r;})
.style('fill', function(d){return d.color;})*/


//TASK 1.2: represent dataset 2 using <g>, containing <rect> and <text>


/*var groups = plot.selectAll('.group')
    .data(dataset2)
    .enter()
    .append('g')
    .attr('class', 'group')
    .attr('transform',function(d){return 'translate('+d.x + ',' +d.y +')';
    });

groups.append('rect')
.attr('width', 330)
.attr('height', 330)
.style('fill', function(d){return d.color;});


groups.append('text')
    .text(function(d){return d.name;});*/


//TASK 2: Use enter/exit/update to toggle between these three datasets


d3.selectAll('.btn').on('click',function(){
    //when clicked, do something
    console.log('click');

    //fin out the id of the button we clicked
    var id=d3.select(this).attr('id')
    console.log(id);

    if(id== 'btn-1'){
        //draw dataset1
        draw(dataset1)
}else if(id == 'btn-2'){
    //draw dataset2
    draw(dataset2)
}else {
    //draw dataset3
    draw(dataset3)
}
})

function draw(dataArray){

    var nodes = plot.selectAll('.node') //unknown length
        .data(dataArray, function(d){return d.color;});//unknown
    nodes.enter()
        .append('circle')
        .attr('class','node')
        .attr('r',0)
    nodes.exit()
        .remove()
    nodes//update selection
        .transition()
        /*.delay(function(d,i){
            return i*200
        })*/
        .duration(1000)
        .attr('r',function(d){return d.r;})
        .attr('cx',function(d){return d.x;})
        .attr('cy',function(d){return d.y})
        .style('fill',function(d){return d.color;})

    console.log(nodes);

};


//TASK 3: Use enter/exit/udpate, and ensure object constancy
