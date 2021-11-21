d3.json('offices.json').then(function(data) {
    // console.log(data);
    const nodes = data.nodes;
    const links = data.links;

    const width = 960;
    const height = 500;

    const simulation = d3.forceSimulation(nodes)
                            .force('charge', d3.forceManyBody().strength(-300))
                            .force('link', d3.forceLink(links).id(d => d.id))
                            .force('center', d3.forceCenter(width / 2, height / 2));
    
    const svg = d3.select('#container')
                    .attr('width', width)
                    .attr('height', height);
                    // .attr("viewBox", [-width / 2, -height / 2, width, height]);
                    // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const linkColors = {
        '01': "green",
        '02': "orange",
        '10': "green",
        '11': "orange",
        '12': "gray"
    };

    Object.values(linkColors).forEach(
        function(value){
            svg.append('marker')
            .attr('id', 'end-arrow-' + value)
            .attr('viewBox', '0 -5 15 15')
            .attr('refX', 30)
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L20,0L0,5')
            .attr('fill', value);
        }
    );

    const lines = svg
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', d => linkColors[d.status])
        .attr('stroke-dasharray', d => ["01", "02"].includes(d.status) ? "5, 5" : null);

    const circles = svg
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', 'red');

    const lables = svg
        .selectAll('text')
        .data(nodes)
        .enter()
        .append('text')
        .text((d) => d.name)
        .attr('fill', 'white');

    simulation.on('tick', () => {
        circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
        lables
        .attr('x', d => d.x)
        .attr('y', d => d.y);
        lines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('marker-end', d => 'url(#end-arrow-' + linkColors[d.status] + ')');
    });

});
