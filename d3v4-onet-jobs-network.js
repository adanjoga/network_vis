function createJobsNetwork_onet(svg, graph) {
    d3v4 = d3;

    let parentWidth = d3v4.select('svg').node().parentNode.clientWidth;
    let parentHeight = d3v4.select('svg').node().parentNode.clientHeight;

    var svg = d3v4.select('svg')
        .attr('width', parentWidth)
        .attr('height', parentHeight)

    // Define the div for the tooltip
    var div = d3.select("#d3_fd_network").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // remove any previous graphs
    svg.selectAll('.g-main').remove();

    var gMain = svg.append('g')
    .classed('g-main', true);

    var rect = gMain.append('rect')
        .attr('width', parentWidth)
        .attr('height', parentHeight)
        .style('fill', 'white')

    var gDraw = gMain.append('g');

    var zoom = d3v4.zoom()
        .on('zoom', zoomed)

    gMain.call(zoom);

    function zoomed() {
        gDraw.attr('transform', d3v4.event.transform);
    }

    var color = d3v4.scaleOrdinal(d3v4.schemeCategory20);

    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    var nodes = {};
    var i;
    for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        graph.nodes[i].weight = 1.01;
    }

    var link = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("g");

    node.append("circle")
        .attr("r", function(d) {
            if ('size' in d)
                return d.size;
            else
                return 6;
        })
        .attr("fill", function(d) { 
            if ('color' in d)
                return d.color;
            else
                return color(d.group); 
        })
        .attr("stroke", function(d) {
            if (d.group_it == 1)
                return "blue";
        })
        .on("click", click)
        .on("mouseover", function(d,i) {
            d3v4.select(this)
                .transition()
                .attr("r", 10);
                
            div.transition()
                .duration(500)		
                .style("opacity", .9);
            div.html("<br/>"  + d.name + "<br/>" + d.dist + " %" + "<br/>")	
                .style("left", (d3v4.event.pageX + 15) + "px")		
                .style("top", (d3v4.event.pageY - 10) + "px");
        })
        .on("mouseout", function(d,i) {
            d3v4.select(this)
                .transition()
                .duration(1000)
                .attr("r", function(d){return d.size});

            div.transition()
                .duration(500)
                .style("opacity", 0)
        })
        .call(d3v4.drag());
    
    var simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink()
                .id(function(d) { return d.id; })
                .distance(function(d) { 
                    return 15;
                    return dist; 
                })
              )
        .force("charge", d3v4.forceManyBody())
        .force("center", d3v4.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3v4.forceX())
        .force("y", d3v4.forceY().strength(function(d){ return .30 }));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        // update node and line positions at every step of the force simulation
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
    }

    function click() { 
        d3v4.select(this).transition()
        .attr("class", "selected");
    }

    var texts = ['+ Use the scroll wheel to zoom',
                    '+ Hold the mouse over a node to display the name'];
    
    svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', 10)
        .attr('y', function(d,i) { return 400 + i * 20; })
        .text(function(d) { return d; });
    return graph;
};
