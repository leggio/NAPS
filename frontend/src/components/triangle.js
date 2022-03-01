import React, { useEffect, useState } from "react";
import * as d3 from 'd3';


function Triangle(props) {

    useEffect(() => {
        var width  = 	500
        var height = 	(window.innerHeight) - 30;
        var s =  Math.min(height, width); 	//triangle side length

        var sin30 = Math.pow(3,1/2)/2;
        var cos30 = .5;

        //triangle centered at (cx, cy) with circumradius r
        function addTriangle(cx, cy, r, hue, sat, black, layers){
            let css_color= 'hsl('+hue+","+sat+"%,"+black+"%)"
            svg.append('polygon')
                .attr('fill', css_color)
                .attr('points', (cx) 			+','+ 	(cy-r) 			+' '+ 
                                (cx-r*sin30) 	+','+ 	(cy + r*cos30)	+' '+
                                (cx+r*sin30) 	+','+ 	(cy + r*cos30))
            
            let hueleft;
            let hueright;
            let color_scheme = Math.floor(Math.random()*100)
            //50/50 chance of children's color scheme being Analogous or complimentary
            if (color_scheme % 2 == 0) {
                //analogous
                hueleft = (hue + 30) % 360
                hueright = (hue + 60) % 360
            } else {
                //complimentary
                hueleft = Math.abs((hue + 150) - 360)
                hueright = Math.abs((hue + 210) - 360)
            }
            

            if(layers < 3) {
                addTriangle(	cx - r*sin30/2,	cy + r*cos30/2, r/2, hueleft, sat, black, layers+1);			
                addTriangle(	cx + r*sin30/2,	cy + r*cos30/2, r/2, hueright, sat, black, layers+1);
            }						
        }


        //adds svg & g elements to page so zooming will work
        var div = document.createElement('div');
        var svg = d3.select(div)
        .append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .attr("pointer-events", "all")
        .append('svg:g');

        svg.append('svg:rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'white');

        function redraw() {
        svg.attr("transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
        }

        //add the first triangle
        let cx = width/2
        let cy = height*2/3
        let r = s*2/3
        let hue = Math.floor(Math.random()*255)
        let sat = Math.floor(Math.random()*100)
        sat = 70
        let black = 50
        for (let i = 0; i < 3; i++) {
            addTriangle(cx, cy, r, hue, sat, black, 0)
        }

        const rootElement = document.getElementById('chart');
        rootElement.appendChild(div)
    }, [])

    return (
        <div id="chart">

        </div>
    )

}

export default Triangle;