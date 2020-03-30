d3.json("data/samples.json").then((Data) => {
  //  Extrac ID-Names
  var names = Data.names;
  //console.log(names);

  // Add Options in select("#selSubject") OR select("select")
  d3.select("#selSubject")
    .selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .html(function(name) {
      return name;
    });
  
  //*************************************************************//
  // Data Init:
  //*************************************************************//
  // 1. Demographic Info
  var demograp = Data.metadata.filter(function(item){
      return item.id == names[0];         
    });
  //
  var demographic = ["id: " + demograp[0].id,
            "ethnicity: " + demograp[0].ethnicity,
            "gender: " + demograp[0].gender,
            "age: " + demograp[0].age,
            "location: " + demograp[0].location,
            "bbtype: " + demograp[0].bbtype,
            "wfreq: " + demograp[0].wfreq 
            ]
  //
  d3.select("#subject-info")
    .selectAll("p")
    .data(demographic)
    .enter()
    .append("p")
    .html(function(demo) {
      return demo;
    });
  
  // 2. Hovertext and Bar Chart on SAMPLES:
  var samples = Data.samples.filter(function(sample) {
    return sample.id == names[0];         
  });

  var sample_values = samples[0].sample_values;
  var otu_ids = samples[0].otu_ids;
  var otu_labels = samples[0].otu_labels;
  var otu_ids_2 = []
  otu_ids.forEach(function(item){
    otu_ids_2.push( "OTU " + item)
  })
  
  var data = [{
    type: 'bar',
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids_2.slice(0, 10).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    orientation: 'h'
  }];
  var layout = {title: 'Hover over the bars to see the OTU labels'};
  Plotly.newPlot('barh', data, layout);
  
  // 3. BONUS: 
  var level = (180/9) * demograp[0].wfreq;
  var degrees = 180 - level, radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
  var mainPath = path1, pathX = String(x), space = ' ', pathY = String(y), pathEnd = ' Z';
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [{ type: 'scatter', x: [0], y:[0], 
      marker: {size: 15, color:'850000'}, showlegend: false, 
      name: 'speed', 
      text: level,
      hoverinfo: 'text+name'},
  { values: [0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 4],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text', 
    textposition:'inside',
    marker: {colors:['rgba(0, 100, 0, .5)', 'rgba(0, 128, 0, .5)',
                    'rgba(34, 139, 34, .5)', 'rgba(46, 139, 87, .5)',
                    'rgba(60, 179, 113, .5)', 'rgba(102, 205, 170, .5)',
                    'rgba(224, 255, 255, .5)', 'rgba(250, 240, 230, .5)',
                    'rgba(255, 250, 240, .5)', 'rgba(0, 0, 0, 0)']},
    hoverinfo: 'text', 
    hole: .5, type: 'pie',
  showlegend: false
  }];

  var layout = { 
    shapes:[{ type: 'path', path: path, fillcolor: '850000',
    line: { color: '850000' } }],
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
  };
  Plotly.newPlot('gauge', data, layout);

  // 4. Bubble Chart:
  var trace1 = {
    x: otu_ids, y: sample_values,
    text: otu_labels, mode: 'markers',
    marker: {
      color: otu_ids,
      size: sample_values
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Bubble Chart for each sample', showlegend: false,
    height: 500, width: 1000
  };  
  Plotly.newPlot('bubble', data, layout);

  //*************************************************************//
  // Data CHANGE across dropdownn menu:
  //*************************************************************//
  d3.selectAll("#selSubject").on("change", updatePlotly);

  function updatePlotly() {
    var dropdownMenu = d3.select("#selSubject");
    var Subject = dropdownMenu.property("value");
    //
    d3.select("#subject-info").selectAll("p").remove();
    // 1. Demographic Info
    var demograp = Data.metadata.filter(function(item){
    return item.id == Subject;         
    });
    //
    var demographic = ["id: " + demograp[0].id,
          "ethnicity: " + demograp[0].ethnicity,
          "gender: " + demograp[0].gender,
          "age: " + demograp[0].age,
          "location: " + demograp[0].location,
          "bbtype: " + demograp[0].bbtype,
          "wfreq: " + demograp[0].wfreq 
          ]
    //
    d3.select("#subject-info")
      .selectAll("p")
      .data(demographic)
      .enter()
      .append("p")
      .html(function(demo) {
        return demo;
      });
    
    // 2. Hovertext and Bar Chart on SAMPLES:
    var samples = Data.samples.filter(function(sample) {
      return sample.id == Subject;         
    });

    var sample_values = samples[0].sample_values;
    var otu_ids = samples[0].otu_ids;
    var otu_labels = samples[0].otu_labels;
    var otu_ids_2 = []
    otu_ids.forEach(function(item){
      otu_ids_2.push( "OTU " + item)
    })
  
    var data = [{
      type: 'bar',
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids_2.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    }];
    var layout = {title: 'Hover over the bars to see the OTU labels'};
    Plotly.newPlot('barh', data, layout);
    
    // 3. BONUS: 
    var level = (180/9) * demograp[0].wfreq;
    var degrees = 180 - level, radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1, pathX = String(x), space = ' ', pathY = String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{ type: 'scatter', x: [0], y:[0], 
        marker: {size: 15, color:'850000'}, showlegend: false, 
        name: 'speed', 
        text: level,
        hoverinfo: 'text+name'},
    { values: [0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 4],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text', 
      textposition:'inside',
      marker: {colors:['rgba(0, 100, 0, .5)', 'rgba(0, 128, 0, .5)',
                    'rgba(34, 139, 34, .5)', 'rgba(46, 139, 87, .5)',
                    'rgba(60, 179, 113, .5)', 'rgba(102, 205, 170, .5)',
                    'rgba(224, 255, 255, .5)', 'rgba(250, 240, 230, .5)',
                    'rgba(255, 250, 240, .5)', 'rgba(0, 0, 0, 0)']},
      hoverinfo: 'text', 
      hole: .5, type: 'pie',
    showlegend: false
    }];

    var layout = { 
      shapes:[{ type: 'path', path: path, fillcolor: '850000',
      line: { color: '850000' } }],
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('gauge', data, layout);

    // 4. Bubble Chart:
    var trace1 = {
      x: otu_ids, y: sample_values,
      text: otu_labels, mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };
  
    var data = [trace1];
  
    var layout = {
      title: 'Bubble Chart for each sample', showlegend: false,
      height: 500, width: 1000
    };  
    Plotly.newPlot('bubble', data, layout);

    console.log(Subject)
    }
});

