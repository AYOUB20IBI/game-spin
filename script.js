var padding = { top: 0, right: 0, bottom: 0, left: 0 },
            w = 450 - padding.left - padding.right,
            h = 450 - padding.top - padding.bottom,
            r = Math.min(w, h) / 2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.category20(); // Category colors

        var data = [
            { "label": "Casquette", "value": "Casquette" },
            { "label": "Flasque", "value": "Flasque" },
            { "label": "T-Shirt", "value": "T-Shirt" },
            { "label": "Carte", "value": "Carte" },
            { "label": "Casquette", "value": "Casquette" },
            { "label": "Flasque", "value": "Flasque" },
            { "label": "T-Shirt", "value": "T-Shirt" },
            { "label": "Carte", "value": "Carte" },
            { "label": "Casquette", "value": "Casquette" },
            { "label": "Flasque", "value": "Flasque" },
            { "label": "T-Shirt", "value": "T-Shirt" },
            { "label": "Carte", "value": "Carte" },
        ];

        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width", w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);

        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");

        var vis = container.append("g");

        var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
        var arc = d3.svg.arc().outerRadius(r);

        var arcs = vis.selectAll("g.slice")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "slice");

        arcs.append("path")
            .attr("fill", function (d, i) { return i % 2 === 0 ? "black" : "white"; }) // Alternate arc colors
            .attr("d", arc);

        arcs.append("text")
            .attr("transform", function (d) {
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle) / 2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
            })
            .attr("text-anchor", "end")
            .attr("fill", function (d, i) { return i % 2 === 0 ? "white" : "black"; }) // Alternate text colors
            .text(function (d, i) { return data[i].label; });

        container.on("click", spin);

        function spin() {
            var id_win = document.getElementById("win");
            container.on("click", null);

            if (oldpick.length === data.length) {
                console.log("done");
                container.on("click", null);
                return;
            }

            var ps = 360 / data.length,
                rng = Math.floor((Math.random() * 360) + 360); // Random between 360 and 720 degrees
            rotation = (Math.round(rng / ps) * ps);

            var pickedIndex = Math.floor(Math.random() * data.length); // Randomly pick a slice
            if (oldpick.indexOf(pickedIndex) !== -1) {
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(pickedIndex);
            }

            // Calculate the rotation needed to position the selected slice at the bottom
            var degreesToBottom = 180; // Rotate to position the picked slice at the bottom
            var angleForPickedSlice = pickedIndex * ps;

            // Ensure the wheel rotates with the picked slice ending up at the bottom
            rotation = (360 - angleForPickedSlice) + degreesToBottom;

            // Ensure the speed remains consistent by resetting oldrotation after each spin
            oldrotation = 0;

            vis.transition()
                .duration(500) // Shorter duration for maximum speed
                .ease("linear") // Linear easing for consistent high speed
                .attrTween("transform", rotTween)
                .each("end", function () {
                    d3.select("#question p").text(data[pickedIndex].value);
                    alert(data[pickedIndex].value);
                    oldrotation = rotation;
                    container.on("click", spin);
                });
        }

        // Add triangle pointer at the bottom of the wheel
        svg.append("g")
            .attr("transform", "translate(150,450)") 
            .append("image")
            .attr("xlink:href", "https://i.ibb.co/KWfj5Yz/IMAGE-TEST-2x-8.png")
            .attr("width", 150) 
            .attr("height", 180)

        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 70)
            .style({ "fill": "white", "cursor": "pointer", "background": "#CCEAF1" });

        container.append("text")
            .attr("x", 0)
            .attr("y", 8)
            .attr("text-anchor", "middle")
            .text("Lancer")
            .style({ "font-weight": "bold", "font-size": "22px" });

        function rotTween() {
            var i = d3.interpolate(oldrotation % 360, rotation);
            return function (t) {
                return "rotate(" + i(t) + ")";
            };
        }

        function getRandomNumbers() {
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

            if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                for (var i = 0; i < 1000; i++) {
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }

            return array;
        }