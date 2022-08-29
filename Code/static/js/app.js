// D3 DATA
    d3.json("samples.json").then(function(data) {
        console.log(data);

        // DROPDOWN
            // Use D3 to select the dropdown menu
            var dropdownMenu = d3.select("#selDataset");
            // Assign the value of the dropdown menu option to a variable
            data.names.forEach((id) => {
                // console.log(id)
                dropdownMenu.append("option").text(id).property("value", id);
                
            })
            loadcharts(data.names[0])  
    });

    function optionChanged(this_id){
        loadcharts(this_id)
    }
    function loadcharts(selected){
        d3.json("samples.json").then(function(data){
            console.log(selected)

            // BAR CHART
                let results = data.samples.filter(obj => obj.id == selected);

                // Trace1 for the OTU Data
                let trace1 = {
                    x: results[0].sample_values.slice(0,10).reverse(),
                    y: results[0].otu_ids.slice(0,10).map(obj => "OTU " + obj ).reverse(),
                    text: results[0].otu_labels.slice(0,10).reverse(),
                    name: "OTUs by Sample Size",
                    type: "bar",
                    orientation: "h"
                };
            
                // Data array
                let traceData1 = [trace1];
            
                // Apply a title to the layout1
                let layout1 = {
                    title: "OTUs by Sample Size",
                    margin: {
                        l: 100,
                        r: 100,
                        t: 100,
                        b: 100
                    }
                };
            
                // Render the plot
                Plotly.newPlot("bar", traceData1, layout1);

            // BUBBLE CHART
                // Trace2 for the OTU Data
                let trace2 = {
                    y: results[0].sample_values,
                    x: results[0].otu_ids,
                    text: results[0].otu_labels,
                    mode:"markers",
                    marker: {
                        size: results[0].sample_values,
                        color: results[0].otu_ids
                    },
                    name: "OTU ID",
                    type: "bubble",
                };

                // Data array
                let traceData2 = [trace2];

                // Apply a title to the layout
                let layout2 = {
                    title: "OTU ID",
                    margin: {
                        l: 100,
                        r: 100,
                        t: 100,
                        b: 100
                    }
                };
                
                // Render the plot
                Plotly.newPlot("bubble", traceData2, layout2);

            // DEMOGRAPHIC INFO
                let metaresults = data.metadata.filter(obj => obj.id == selected);
                console.log(metaresults[0]);

                let demoref= d3.select("#sample-metadata")
                demoref.html("")
                Object.entries(metaresults[0]).forEach(([key, value]) => {
                    demoref.append("h5").text(key + ": " + value)
                })

            // BONUS
                var gdata = [{
                    domain: { x: [0, 1], y: [0, 1] },
                    value: metaresults[0].wfreq,
                    title: { text: "Scrubs per Week" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 9] },
                        steps: [
                            { range: [0, 3], color: "gray" },
                            { range: [3, 6], color: "darkgray" },
                            {range: [6,9], color: "lightgrey"}
                        ],
                        threshold: {
                            line: { color: "red", width: 4 },
                            thickness: 0.75,
                            value: [9]
                        }
                    }
                }];
                
                var layout3 = { 
                    width: 600, 
                    height: 450, 
                    margin: { t: 0, b: 0 } 
                };
                Plotly.newPlot('gauge', gdata, layout3);
        })
    }
