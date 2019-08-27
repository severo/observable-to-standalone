// https://observablehq.com/@fil/tissots-indicatrix@90
import define1 from "../@fil/base-map.js";
import define2 from "../@jashkenas/inputs.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Tissot's indicatrix`
)});
  main.variable(observer("viewof p")).define("viewof p", ["radio","md"], function(radio,md){return(
radio({
  title: "Projection",
  description: md`More projections are available: see https://github.com/d3/d3-geo-projection &  https://github.com/d3/d3-geo-polygon.`,
  options: "Airocean Bertin1953 CahillKeyes Mercator Orthographic PolyhedralButterfly Gnomonic"
    .split(/ /g),
  value: "Airocean"
})
)});
  main.variable(observer("p")).define("p", ["Generators", "viewof p"], (G, _) => G.input(_));
  main.variable(observer("display")).define("display", ["map","p","d3","tissot"], function*(map,p,d3,tissot)
{
  const m = map(p),
        _render = m.render;
  yield m;
  
  // read the projection from m
  const projection = m.projection,
        context = m.getContext("2d"),
        path = d3.geoPath(projection).context(context);

  // overload m.render to add the circles
  m.render = function() {
    _render();
    
    context.beginPath(),
      path(tissot),
      context.fillStyle = "rgba(255,99,71,.5)",
      context.fill();
  }
  
  m.render();
}
);
  main.variable(observer("tissot")).define("tissot", ["d3"], function(d3)
{
  const circle = d3.geoCircle().radius(4.5),
    tissot = {
      type: "MultiPolygon",
      coordinates: []
    };

  [-60, -30, 0, 30, 60].forEach(lat => {
    [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180].forEach(lon => {
      tissot.coordinates.push([lon, lat]);
    });
  });
  tissot.coordinates.push([0, 90]);
  tissot.coordinates.push([0, -90]);
  tissot.coordinates = tissot.coordinates.map(
    d => circle.center(d)().coordinates
  );

  return tissot;
}
);
  const child1 = runtime.module(define1);
  main.import("d3", child1);
  main.import("map", child1);
  const child2 = runtime.module(define2);
  main.import("radio", child2);
  return main;
}
