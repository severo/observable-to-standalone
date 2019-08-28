// undefined v1.0.0 Copyright 2019 undefined
(function () {
'use strict';

// https://observablehq.com/@mbostock/psr-b1919-21@100
function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# PSR B1919+21

Data: [Borgar Þorsteinsson](https://bl.ocks.org/borgar/31c1e476b8e92a11d7e9), [Michael Zöllner](http://i.document.m05.de/2013/05/23/joy-divisions-unknown-pleasures-printed-in-3d/)`
)});
  main.variable(observer("chart")).define("chart", ["d3","DOM","width","height","data","y","area","line","xAxis"], function(d3,DOM,width,height,data,y,area,line,xAxis)
{
  const svg = d3.select(DOM.svg(width, height));

  const serie = svg.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", (d, i) => `translate(0,${y(i) + 1})`);
  
  serie.append("path")
      .attr("fill", "#fff")
      .attr("d", area);
  
  serie.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", line);

  svg.append("g")
      .call(xAxis);
  
  return svg.node();
}
);
  main.variable(observer("overlap")).define("overlap", function(){return(
16
)});
  main.variable(observer("height")).define("height", function(){return(
720
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 60, right: 10, bottom: 20, left: 10}
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain([0, data[0].length - 1])
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","margin","height"], function(d3,data,margin,height){return(
d3.scalePoint()
    .domain(data.map((d, i) => i))
    .range([margin.top, height - margin.bottom])
)});
  main.variable(observer("z")).define("z", ["d3","data","overlap","y"], function(d3,data,overlap,y){return(
d3.scaleLinear()
    .domain([
      d3.min(data, d => d3.min(d)),
      d3.max(data, d => d3.max(d))
    ])
    .range([0, -overlap * y.step()])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x.copy().domain([0, 92])).ticks(width / 80))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:first-of-type text").append("tspan").attr("x", 10).text(" ms"))
)});
  main.variable(observer("area")).define("area", ["d3","x","z"], function(d3,x,z){return(
d3.area()
    .defined(d => !isNaN(d))
    .x((d, i) => x(i))
    .y0(0)
    .y1(z)
)});
  main.variable(observer("line")).define("line", ["area"], function(area){return(
area.lineY1()
)});
  main.variable(observer("data")).define("data", ["d3"], function(d3){return(
d3.text("https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv").then(data => d3.csvParseRows(data, row => row.map(Number)))
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}

function dispatch(node, type, detail) {
  detail = detail || {};
  var document = node.ownerDocument, event = document.defaultView.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, {detail: detail});
  } else {
    event = document.createEvent("Event");
    event.initEvent(type, false, false);
    event.detail = detail;
  }
  node.dispatchEvent(event);
}

// TODO https://twitter.com/mbostock/status/702737065121742848
function isarray(value) {
  return Array.isArray(value)
      || value instanceof Int8Array
      || value instanceof Int16Array
      || value instanceof Int32Array
      || value instanceof Uint8Array
      || value instanceof Uint8ClampedArray
      || value instanceof Uint16Array
      || value instanceof Uint32Array
      || value instanceof Float32Array
      || value instanceof Float64Array;
}

// Non-integer keys in arrays, e.g. [1, 2, 0.5: "value"].
function isindex(key) {
  return key === (key | 0) + "";
}

function inspectName(name) {
  const n = document.createElement("span");
  n.className = "observablehq--cellname";
  n.textContent = `${name} = `;
  return n;
}

const symbolToString = Symbol.prototype.toString;

// Symbols do not coerce to strings; they must be explicitly converted.
function formatSymbol(symbol) {
  return symbolToString.call(symbol);
}

const {getOwnPropertySymbols, prototype: {hasOwnProperty}} = Object;
const {toStringTag} = Symbol;

const FORBIDDEN = {};

const symbolsof = getOwnPropertySymbols;

function isown(object, key) {
  return hasOwnProperty.call(object, key);
}

function tagof(object) {
  return object[toStringTag]
      || (object.constructor && object.constructor.name)
      || "Object";
}

function valueof(object, key) {
  try {
    const value = object[key];
    if (value) value.constructor; // Test for SecurityError.
    return value;
  } catch (ignore) {
    return FORBIDDEN;
  }
}

const SYMBOLS = [
  { symbol: "@@__IMMUTABLE_INDEXED__@@", name: "Indexed", modifier: true },
  { symbol: "@@__IMMUTABLE_KEYED__@@", name: "Keyed", modifier: true },
  { symbol: "@@__IMMUTABLE_LIST__@@", name: "List", arrayish: true },
  { symbol: "@@__IMMUTABLE_MAP__@@", name: "Map" },
  {
    symbol: "@@__IMMUTABLE_ORDERED__@@",
    name: "Ordered",
    modifier: true,
    prefix: true
  },
  { symbol: "@@__IMMUTABLE_RECORD__@@", name: "Record" },
  {
    symbol: "@@__IMMUTABLE_SET__@@",
    name: "Set",
    arrayish: true,
    setish: true
  },
  { symbol: "@@__IMMUTABLE_STACK__@@", name: "Stack", arrayish: true }
];

function immutableName(obj) {
  try {
    let symbols = SYMBOLS.filter(({ symbol }) => obj[symbol] === true);
    if (!symbols.length) return;

    const name = symbols.find(s => !s.modifier);
    const prefix =
      name.name === "Map" && symbols.find(s => s.modifier && s.prefix);

    const arrayish = symbols.some(s => s.arrayish);
    const setish = symbols.some(s => s.setish);

    return {
      name: `${prefix ? prefix.name : ""}${name.name}`,
      symbols,
      arrayish: arrayish && !setish,
      setish
    };
  } catch (e) {
    return null;
  }
}

function inspectExpanded(object, _, name) {
  let arrayish = isarray(object);
  let tag, fields, next, n;

  if (object instanceof Map) {
    tag = `Map(${object.size})`;
    fields = iterateMap;
  } else if (object instanceof Set) {
    tag = `Set(${object.size})`;
    fields = iterateSet;
  } else if (arrayish) {
    tag = `${object.constructor.name}(${object.length})`;
    fields = iterateArray;
  } else if ((n = immutableName(object))) {
    tag = `Immutable.${n.name}${n.name === 'Record' ? '' : `(${object.size})`}`;
    arrayish = n.arrayish;
    fields = n.arrayish ? iterateImArray : n.setish ? iterateImSet : iterateImObject;
  } else {
    tag = tagof(object);
    fields = iterateObject;
  }

  const span = document.createElement("span");
  span.className = "observablehq--expanded";
  if (name) {
    span.appendChild(inspectName(name));
  }
  const a = span.appendChild(document.createElement("a"));
  a.innerHTML =`<svg width=8 height=8 class='observablehq--caret'>
    <path d='M4 7L0 1h8z' fill='currentColor' />
  </svg>`;
  a.appendChild(document.createTextNode(`${tag}${arrayish ? " [" : " {"}`));
  a.addEventListener("mouseup", function(event) {
    event.stopPropagation();
    replace(span, inspectCollapsed(object, null, name));
  });

  fields = fields(object);
  for (let i = 0; !(next = fields.next()).done && i < 20; ++i) {
    span.appendChild(next.value);
  }

  if (!next.done) {
    const a = span.appendChild(document.createElement("a"));
    a.className = "observablehq--field";
    a.style.display = "block";
    a.appendChild(document.createTextNode(`  … more`));
    a.addEventListener("mouseup", function(event) {
      event.stopPropagation();
      span.insertBefore(next.value, span.lastChild.previousSibling);
      for (let i = 0; !(next = fields.next()).done && i < 19; ++i) {
        span.insertBefore(next.value, span.lastChild.previousSibling);
      }
      if (next.done) span.removeChild(span.lastChild.previousSibling);
      dispatch(span, "load");
    });
  }

  span.appendChild(document.createTextNode(arrayish ? "]" : "}"));

  return span;
}

function* iterateMap(map) {
  for (const [key, value] of map) {
    yield formatMapField(key, value);
  }
  yield* iterateObject(map);
}

function* iterateSet(set) {
  for (const value of set) {
    yield formatSetField(value);
  }
  yield* iterateObject(set);
}

function* iterateImSet(set) {
  for (const value of set) {
    yield formatSetField(value);
  }
}

function* iterateArray(array) {
  for (let i = 0, n = array.length; i < n; ++i) {
    if (i in array) {
      yield formatField(i, valueof(array, i), "observablehq--index");
    }
  }
  for (const key in array) {
    if (!isindex(key) && isown(array, key)) {
      yield formatField(key, valueof(array, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(array)) {
    yield formatField(formatSymbol(symbol), valueof(array, symbol), "observablehq--symbol");
  }
}

function* iterateImArray(array) {
  let i1 = 0;
  for (const n = array.size; i1 < n; ++i1) {
    yield formatField(i1, array.get(i1), true);
  }
}

function* iterateObject(object) {
  for (const key in object) {
    if (isown(object, key)) {
      yield formatField(key, valueof(object, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(object)) {
    yield formatField(formatSymbol(symbol), valueof(object, symbol), "observablehq--symbol");
  }
}

function* iterateImObject(object) {
  for (const [key, value] of object) {
    yield formatField(key, value, "observablehq--key");
  }
}

function formatField(key, value, className) {
  const item = document.createElement("div");
  const span = item.appendChild(document.createElement("span"));
  item.className = "observablehq--field";
  span.className = className;
  span.textContent = `  ${key}`;
  item.appendChild(document.createTextNode(": "));
  item.appendChild(inspect(value));
  return item;
}

function formatMapField(key, value) {
  const item = document.createElement("div");
  item.className = "observablehq--field";
  item.appendChild(document.createTextNode("  "));
  item.appendChild(inspect(key));
  item.appendChild(document.createTextNode(" => "));
  item.appendChild(inspect(value));
  return item;
}

function formatSetField(value) {
  const item = document.createElement("div");
  item.className = "observablehq--field";
  item.appendChild(document.createTextNode("  "));
  item.appendChild(inspect(value));
  return item;
}

function hasSelection(elem) {
  const sel = window.getSelection();
  return (
    sel.type === "Range" &&
    (sel.containsNode(elem, true) ||
      sel.anchorNode.isSelfOrDescendant(elem) ||
      sel.focusNode.isSelfOrDescendant(elem))
  );
}

function inspectCollapsed(object, shallow, name) {
  let arrayish = isarray(object);
  let tag, fields, next, n;

  if (object instanceof Map) {
    tag = `Map(${object.size})`;
    fields = iterateMap$1;
  } else if (object instanceof Set) {
    tag = `Set(${object.size})`;
    fields = iterateSet$1;
  } else if (arrayish) {
    tag = `${object.constructor.name}(${object.length})`;
    fields = iterateArray$1;
  } else if ((n = immutableName(object))) {
    tag = `Immutable.${n.name}${n.name === 'Record' ? '' : `(${object.size})`}`;
    arrayish = n.arrayish;
    fields = n.arrayish ? iterateImArray$1 : n.setish ? iterateImSet$1 : iterateImObject$1;
  } else {
    tag = tagof(object);
    fields = iterateObject$1;
  }

  if (shallow) {
    const span = document.createElement("span");
    span.className = "observablehq--shallow";
    if (name) {
      span.appendChild(inspectName(name));
    }
    span.appendChild(document.createTextNode(tag));
    span.addEventListener("mouseup", function(event) {
      if (hasSelection(span)) return;
      event.stopPropagation();
      replace(span, inspectCollapsed(object));
    });
    return span;
  }

  const span = document.createElement("span");
  span.className = "observablehq--collapsed";
  if (name) {
    span.appendChild(inspectName(name));
  }
  const a = span.appendChild(document.createElement("a"));
  a.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M7 4L1 8V0z' fill='currentColor' />
  </svg>`;
  a.appendChild(document.createTextNode(`${tag}${arrayish ? " [" : " {"}`));
  span.addEventListener("mouseup", function(event) {
    if (hasSelection(span)) return;
    event.stopPropagation();
    replace(span, inspectExpanded(object, null, name));
  }, true);

  fields = fields(object);
  for (let i = 0; !(next = fields.next()).done && i < 20; ++i) {
    if (i > 0) span.appendChild(document.createTextNode(", "));
    span.appendChild(next.value);
  }

  if (!next.done) span.appendChild(document.createTextNode(", …"));
  span.appendChild(document.createTextNode(arrayish ? "]" : "}"));

  return span;
}

function* iterateMap$1(map) {
  for (const [key, value] of map) {
    yield formatMapField$1(key, value);
  }
  yield* iterateObject$1(map);
}

function* iterateSet$1(set) {
  for (const value of set) {
    yield inspect(value, true);
  }
  yield* iterateObject$1(set);
}

function* iterateImSet$1(set) {
  for (const value of set) {
    yield inspect(value, true);
  }
}

function* iterateImArray$1(array) {
  let i0 = -1, i1 = 0;
  for (const n = array.size; i1 < n; ++i1) {
    if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
    yield inspect(array.get(i1), true);
    i0 = i1;
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
}

function* iterateArray$1(array) {
  let i0 = -1, i1 = 0;
  for (const n = array.length; i1 < n; ++i1) {
    if (i1 in array) {
      if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
      yield inspect(valueof(array, i1), true);
      i0 = i1;
    }
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
  for (const key in array) {
    if (!isindex(key) && isown(array, key)) {
      yield formatField$1(key, valueof(array, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(array)) {
    yield formatField$1(formatSymbol(symbol), valueof(array, symbol), "observablehq--symbol");
  }
}

function* iterateObject$1(object) {
  for (const key in object) {
    if (isown(object, key)) {
      yield formatField$1(key, valueof(object, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(object)) {
    yield formatField$1(formatSymbol(symbol), valueof(object, symbol), "observablehq--symbol");
  }
}

function* iterateImObject$1(object) {
  for (const [key, value] of object) {
    yield formatField$1(key, value, "observablehq--key");
  }
}

function formatEmpty(e) {
  const span = document.createElement("span");
  span.className = "observablehq--empty";
  span.textContent = e === 1 ? "empty" : `empty × ${e}`;
  return span;
}

function formatField$1(key, value, className) {
  const fragment = document.createDocumentFragment();
  const span = fragment.appendChild(document.createElement("span"));
  span.className = className;
  span.textContent = key;
  fragment.appendChild(document.createTextNode(": "));
  fragment.appendChild(inspect(value, true));
  return fragment;
}

function formatMapField$1(key, value) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(inspect(key, true));
  fragment.appendChild(document.createTextNode(" => "));
  fragment.appendChild(inspect(value, true));
  return fragment;
}

function pad(value, width) {
  var s = value + "", length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

function isUTCMidnight(date) {
  return date.getUTCMilliseconds() === 0
      && date.getUTCSeconds() === 0
      && date.getUTCMinutes() === 0
      && date.getUTCHours() === 0;
}

function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6)
    : year > 9999 ? "+" + pad(year, 6)
    : pad(year, 4);
}

function formatDate(date) {
  return isNaN(date)
    ? "Invalid Date"
    : isUTCMidnight(date)
      ? formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
      : formatYear(date.getFullYear()) + "-" + pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2)
        + "T" + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2)
        + (date.getMilliseconds() ? ":" + pad(date.getSeconds(), 2) + "." + pad(date.getMilliseconds(), 3)
          : date.getSeconds() ? ":" + pad(date.getSeconds(), 2)
          : "");
}

var errorToString = Error.prototype.toString;

function formatError(value) {
  return value.stack || errorToString.call(value);
}

var regExpToString = RegExp.prototype.toString;

function formatRegExp(value) {
  return regExpToString.call(value);
}

/* eslint-disable no-control-regex */
const NEWLINE_LIMIT = 20;

function formatString(string, shallow, expanded, name) {
  if (shallow === false) {
    // String has fewer escapes displayed with double quotes
    if (count(string, /["\n]/g) <= count(string, /`|\${/g)) {
      const span = document.createElement("span");
      if (name) span.appendChild(inspectName(name));
      const textValue = span.appendChild(document.createElement("span"));
      textValue.className = "observablehq--string";
      textValue.textContent = JSON.stringify(string);
      return span;
    }
    const lines = string.split("\n");
    if (lines.length > NEWLINE_LIMIT && !expanded) {
      const div = document.createElement("div");
      if (name) div.appendChild(inspectName(name));
      const textValue = div.appendChild(document.createElement("span"));
      textValue.className = "observablehq--string";
      textValue.textContent = "`" + templatify(lines.slice(0, NEWLINE_LIMIT).join("\n"));
      const splitter = div.appendChild(document.createElement("span"));
      const truncatedCount = lines.length - NEWLINE_LIMIT;
      splitter.textContent = `Show ${truncatedCount} truncated line${truncatedCount > 1 ? "s": ""}`; splitter.className = "observablehq--string-expand";
      splitter.addEventListener("mouseup", function (event) {
        event.stopPropagation();
        replace(div, inspect(string, shallow, true, name));
      });
      return div;
    }
    const span = document.createElement("span");
    if (name) span.appendChild(inspectName(name));
    const textValue = span.appendChild(document.createElement("span"));
    textValue.className = `observablehq--string${expanded ? " observablehq--expanded" : ""}`;
    textValue.textContent = "`" + templatify(string) + "`";
    return span;
  }

  const span = document.createElement("span");
  if (name) span.appendChild(inspectName(name));
  const textValue = span.appendChild(document.createElement("span"));
  textValue.className = "observablehq--string";
  textValue.textContent = JSON.stringify(string.length > 100 ?
    `${string.slice(0, 50)}…${string.slice(-49)}` : string);
  return span;
}

function templatify(string) {
  return string.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, templatifyChar);
}

function templatifyChar(char) {
  var code = char.charCodeAt(0);
  switch (code) {
    case 0x8: return "\\b";
    case 0x9: return "\\t";
    case 0xb: return "\\v";
    case 0xc: return "\\f";
    case 0xd: return "\\r";
  }
  return code < 0x10 ? "\\x0" + code.toString(16)
      : code < 0x20 ? "\\x" + code.toString(16)
      : "\\" + char;
}

function count(string, re) {
  var n = 0;
  while (re.exec(string)) ++n;
  return n;
}

var toString = Function.prototype.toString,
    TYPE_ASYNC = {prefix: "async ƒ"},
    TYPE_ASYNC_GENERATOR = {prefix: "async ƒ*"},
    TYPE_CLASS = {prefix: "class"},
    TYPE_FUNCTION = {prefix: "ƒ"},
    TYPE_GENERATOR = {prefix: "ƒ*"};

function inspectFunction(f, name) {
  var type, m, t = toString.call(f);

  switch (f.constructor && f.constructor.name) {
    case "AsyncFunction": type = TYPE_ASYNC; break;
    case "AsyncGeneratorFunction": type = TYPE_ASYNC_GENERATOR; break;
    case "GeneratorFunction": type = TYPE_GENERATOR; break;
    default: type = /^class\b/.test(t) ? TYPE_CLASS : TYPE_FUNCTION; break;
  }

  // A class, possibly named.
  // class Name
  if (type === TYPE_CLASS) {
    return formatFunction(type, "", name);
  }

  // An arrow function with a single argument.
  // foo =>
  // async foo =>
  if ((m = /^(?:async\s*)?(\w+)\s*=>/.exec(t))) {
    return formatFunction(type, "(" + m[1] + ")", name);
  }

  // An arrow function with parenthesized arguments.
  // (…)
  // async (…)
  if ((m = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(t))) {
    return formatFunction(type, m[1] ? "(" + m[1].replace(/\s*,\s*/g, ", ") + ")" : "()", name);
  }

  // A function, possibly: async, generator, anonymous, simply arguments.
  // function name(…)
  // function* name(…)
  // async function name(…)
  // async function* name(…)
  if ((m = /^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(t))) {
    return formatFunction(type, m[1] ? "(" + m[1].replace(/\s*,\s*/g, ", ") + ")" : "()", name);
  }

  // Something else, like destructuring, comments or default values.
  return formatFunction(type, "(…)", name);
}

function formatFunction(type, args, cellname) {
  var span = document.createElement("span");
  span.className = "observablehq--function";
  if (cellname) {
    span.appendChild(inspectName(cellname));
  }
  var spanType = span.appendChild(document.createElement("span"));
  spanType.className = "observablehq--keyword";
  spanType.textContent = type.prefix;
  span.appendChild(document.createTextNode(args));
  return span;
}

const {prototype: {toString: toString$1}} = Object;

function inspect(value, shallow, expand, name) {
  let type = typeof value;
  switch (type) {
    case "boolean":
    case "undefined": { value += ""; break; }
    case "number": { value = value === 0 && 1 / value < 0 ? "-0" : value + ""; break; }
    case "bigint": { value = value + "n"; break; }
    case "symbol": { value = formatSymbol(value); break; }
    case "function": { return inspectFunction(value, name); }
    case "string": { return formatString(value, shallow, expand, name); }
    default: {
      if (value === null) { type = null, value = "null"; break; }
      if (value instanceof Date) { type = "date", value = formatDate(value); break; }
      if (value === FORBIDDEN) { type = "forbidden", value = "[forbidden]"; break; }
      switch (toString$1.call(value)) {
        case "[object RegExp]": { type = "regexp", value = formatRegExp(value); break; }
        case "[object Error]": // https://github.com/lodash/lodash/blob/master/isError.js#L26
        case "[object DOMException]": { type = "error", value = formatError(value); break; }
        default: return (expand ? inspectExpanded : inspectCollapsed)(value, shallow, name);
      }
      break;
    }
  }
  const span = document.createElement("span");
  if (name) span.appendChild(inspectName(name));
  const n = span.appendChild(document.createElement("span"));
  n.className = `observablehq--${type}`;
  n.textContent = value;
  return span;
}

function replace(spanOld, spanNew) {
  if (spanOld.classList.contains("observablehq--inspect")) spanNew.classList.add("observablehq--inspect");
  spanOld.parentNode.replaceChild(spanNew, spanOld);
  dispatch(spanNew, "load");
}

const LOCATION_MATCH = /\s+\(\d+:\d+\)$/m;

class Inspector {
  constructor(node) {
    if (!node) throw new Error("invalid node");
    this._node = node;
    node.classList.add("observablehq");
  }
  pending() {
    const {_node} = this;
    _node.classList.remove("observablehq--error");
    _node.classList.add("observablehq--running");
  }
  fulfilled(value, name) {
    const {_node} = this;
    if (!(value instanceof Element || value instanceof Text) || (value.parentNode && value.parentNode !== _node)) {
      value = inspect(value, false, _node.firstChild // TODO Do this better.
          && _node.firstChild.classList
          && _node.firstChild.classList.contains("observablehq--expanded"), name);
      value.classList.add("observablehq--inspect");
    }
    _node.classList.remove("observablehq--running", "observablehq--error");
    if (_node.firstChild !== value) {
      if (_node.firstChild) {
        while (_node.lastChild !== _node.firstChild) _node.removeChild(_node.lastChild);
        _node.replaceChild(value, _node.firstChild);
      } else {
        _node.appendChild(value);
      }
    }
    dispatch(_node, "update");
  }
  rejected(error, name) {
    const {_node} = this;
    _node.classList.remove("observablehq--running");
    _node.classList.add("observablehq--error");
    while (_node.lastChild) _node.removeChild(_node.lastChild);
    var div = document.createElement("div");
    div.className = "observablehq--inspect";
    if (name) div.appendChild(inspectName(name));
    div.appendChild(document.createTextNode((error + "").replace(LOCATION_MATCH, "")));
    _node.appendChild(div);
    dispatch(_node, "error", {error: error});
  }
}

Inspector.into = function(container) {
  if (typeof container === "string") {
    container = document.querySelector(container);
    if (container == null) throw new Error("container not found");
  }
  return function() {
    return new Inspector(container.appendChild(document.createElement("div")));
  };
};

function constant(x) {
  return function() {
    return x;
  };
}

function canvas(width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function context2d(width, height, dpi) {
  if (dpi == null) dpi = devicePixelRatio;
  var canvas = document.createElement("canvas");
  canvas.width = width * dpi;
  canvas.height = height * dpi;
  canvas.style.width = width + "px";
  var context = canvas.getContext("2d");
  context.scale(dpi, dpi);
  return context;
}

function download(value, name = "untitled", label = "Save") {
  const a = document.createElement("a");
  const b = a.appendChild(document.createElement("button"));
  b.textContent = label;
  a.download = name;

  async function reset() {
    await new Promise(requestAnimationFrame);
    URL.revokeObjectURL(a.href);
    a.removeAttribute("href");
    b.textContent = label;
    b.disabled = false;
  }

  a.onclick = async event => {
    b.disabled = true;
    if (a.href) return reset(); // Already saved.
    b.textContent = "Saving…";
    try {
      const object = await (typeof value === "function" ? value() : value);
      b.textContent = "Download";
      a.href = URL.createObjectURL(object); // eslint-disable-line require-atomic-updates
    } catch (ignore) {
      b.textContent = label;
    }
    if (event.eventPhase) return reset(); // Already downloaded.
    b.disabled = false;
  };

  return a;
}

var namespaces = {
  math: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function element(name, attributes) {
  var prefix = name += "", i = prefix.indexOf(":"), value;
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  var element = namespaces.hasOwnProperty(prefix) // eslint-disable-line no-prototype-builtins
      ? document.createElementNS(namespaces[prefix], name)
      : document.createElement(name);
  if (attributes) for (var key in attributes) {
    prefix = key, i = prefix.indexOf(":"), value = attributes[key];
    if (i >= 0 && (prefix = key.slice(0, i)) !== "xmlns") key = key.slice(i + 1);
    if (namespaces.hasOwnProperty(prefix)) element.setAttributeNS(namespaces[prefix], key, value); // eslint-disable-line no-prototype-builtins
    else element.setAttribute(key, value);
  }
  return element;
}

function input(type) {
  var input = document.createElement("input");
  if (type != null) input.type = type;
  return input;
}

function range(min, max, step) {
  if (arguments.length === 1) max = min, min = null;
  var input = document.createElement("input");
  input.min = min = min == null ? 0 : +min;
  input.max = max = max == null ? 1 : +max;
  input.step = step == null ? "any" : step = +step;
  input.type = "range";
  return input;
}

function select(values) {
  var select = document.createElement("select");
  Array.prototype.forEach.call(values, function(value) {
    var option = document.createElement("option");
    option.value = option.textContent = value;
    select.appendChild(option);
  });
  return select;
}

function svg(width, height) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", [0, 0, width, height]);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  return svg;
}

function text(value) {
  return document.createTextNode(value);
}

var count$1 = 0;

function uid(name) {
  return new Id("O-" + (name == null ? "" : name + "-") + ++count$1);
}

function Id(id) {
  this.id = id;
  this.href = window.location.href + "#" + id;
}

Id.prototype.toString = function() {
  return "url(" + this.href + ")";
};

var DOM = {
  canvas: canvas,
  context2d: context2d,
  download: download,
  element: element,
  input: input,
  range: range,
  select: select,
  svg: svg,
  text: text,
  uid: uid
};

function buffer(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader;
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function text$1(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader;
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function url(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader;
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

var Files = {
  buffer: buffer,
  text: text$1,
  url: url
};

function that() {
  return this;
}

function disposable(value, dispose) {
  let done = false;
  return {
    [Symbol.iterator]: that,
    next: () => done ? {done: true} : (done = true, {done: false, value}),
    return: () => (done = true, dispose(value), {done: true}),
    throw: () => ({done: done = true})
  };
}

function* filter(iterator, test) {
  var result, index = -1;
  while (!(result = iterator.next()).done) {
    if (test(result.value, ++index)) {
      yield result.value;
    }
  }
}

function observe(initialize) {
  let stale = false;
  let value;
  let resolve;
  const dispose = initialize(change);

  function change(x) {
    if (resolve) resolve(x), resolve = null;
    else stale = true;
    return value = x;
  }

  function next() {
    return {done: false, value: stale
        ? (stale = false, Promise.resolve(value))
        : new Promise(_ => (resolve = _))};
  }

  return {
    [Symbol.iterator]: that,
    throw: () => ({done: true}),
    return: () => (dispose != null && dispose(), {done: true}),
    next
  };
}

function input$1(input) {
  return observe(function(change) {
    var event = eventof(input), value = valueof$1(input);
    function inputted() { change(valueof$1(input)); }
    input.addEventListener(event, inputted);
    if (value !== undefined) change(value);
    return function() { input.removeEventListener(event, inputted); };
  });
}

function valueof$1(input) {
  switch (input.type) {
    case "range":
    case "number": return input.valueAsNumber;
    case "date": return input.valueAsDate;
    case "checkbox": return input.checked;
    case "file": return input.multiple ? input.files : input.files[0];
    default: return input.value;
  }
}

function eventof(input) {
  switch (input.type) {
    case "button":
    case "submit":
    case "checkbox": return "click";
    case "file": return "change";
    default: return "input";
  }
}

function* map(iterator, transform) {
  var result, index = -1;
  while (!(result = iterator.next()).done) {
    yield transform(result.value, ++index);
  }
}

function queue(initialize) {
  let resolve;
  const queue = [];
  const dispose = initialize(push);

  function push(x) {
    queue.push(x);
    if (resolve) resolve(queue.shift()), resolve = null;
    return x;
  }

  function next() {
    return {done: false, value: queue.length
        ? Promise.resolve(queue.shift())
        : new Promise(_ => (resolve = _))};
  }

  return {
    [Symbol.iterator]: that,
    throw: () => ({done: true}),
    return: () => (dispose != null && dispose(), {done: true}),
    next
  };
}

function* range$1(start, stop, step) {
  start = +start;
  stop = +stop;
  step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1, n = Math.max(0, Math.ceil((stop - start) / step)) | 0;
  while (++i < n) {
    yield start + i * step;
  }
}

function valueAt(iterator, i) {
  if (!isFinite(i = +i) || i < 0 || i !== i | 0) return;
  var result, index = -1;
  while (!(result = iterator.next()).done) {
    if (++index === i) {
      return result.value;
    }
  }
}

function worker(source) {
  const url = URL.createObjectURL(new Blob([source], {type: "text/javascript"}));
  const worker = new Worker(url);
  return disposable(worker, () => {
    worker.terminate();
    URL.revokeObjectURL(url);
  });
}

var Generators = {
  disposable: disposable,
  filter: filter,
  input: input$1,
  map: map,
  observe: observe,
  queue: queue,
  range: range$1,
  valueAt: valueAt,
  worker: worker
};

function template(render, wrapper) {
  return function(strings) {
    var string = strings[0],
        parts = [], part,
        root = null,
        node, nodes,
        walker,
        i, n, j, m, k = -1;

    // Concatenate the text using comments as placeholders.
    for (i = 1, n = arguments.length; i < n; ++i) {
      part = arguments[i];
      if (part instanceof Node) {
        parts[++k] = part;
        string += "<!--o:" + k + "-->";
      } else if (Array.isArray(part)) {
        for (j = 0, m = part.length; j < m; ++j) {
          node = part[j];
          if (node instanceof Node) {
            if (root === null) {
              parts[++k] = root = document.createDocumentFragment();
              string += "<!--o:" + k + "-->";
            }
            root.appendChild(node);
          } else {
            root = null;
            string += node;
          }
        }
        root = null;
      } else {
        string += part;
      }
      string += strings[i];
    }

    // Render the text.
    root = render(string);

    // Walk the rendered content to replace comment placeholders.
    if (++k > 0) {
      nodes = new Array(k);
      walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT, null, false);
      while (walker.nextNode()) {
        node = walker.currentNode;
        if (/^o:/.test(node.nodeValue)) {
          nodes[+node.nodeValue.slice(2)] = node;
        }
      }
      for (i = 0; i < k; ++i) {
        if (node = nodes[i]) {
          node.parentNode.replaceChild(parts[i], node);
        }
      }
    }

    // Is the rendered content
    // … a parent of a single child? Detach and return the child.
    // … a document fragment? Replace the fragment with an element.
    // … some other node? Return it.
    return root.childNodes.length === 1 ? root.removeChild(root.firstChild)
        : root.nodeType === 11 ? ((node = wrapper()).appendChild(root), node)
        : root;
  };
}

var html = template(function(string) {
  var template = document.createElement("template");
  template.innerHTML = string.trim();
  return document.importNode(template.content, true);
}, function() {
  return document.createElement("span");
});

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace$1(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace$1(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace$1(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace$1(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace$1(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace$1(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ <>]+(@|:\/)[^ <>]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^<'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|\\[\[\]]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace$1(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace$1(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace$1(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace$1(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace$1(inline.br)('{2,}', '*')(),
  text: replace$1(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(
          cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1])
        );
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return text;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return text;
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace$1(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false,
  baseUrl: null
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

const HL_ROOT =
  "https://cdn.jsdelivr.net/npm/@observablehq/highlight.js@2.0.0/";

function md(require) {
  return function() {
    return template(
      function(string) {
        var root = document.createElement("div");
        root.innerHTML = marked(string, { langPrefix: "" }).trim();
        var code = root.querySelectorAll("pre code[class]");
        if (code.length > 0) {
          require(HL_ROOT + "highlight.min.js").then(function(hl) {
            code.forEach(function(block) {
              function done() {
                hl.highlightBlock(block);
                block.parentNode.classList.add("observablehq--md-pre");
              }
              if (hl.getLanguage(block.className)) {
                done();
              } else {
                require(HL_ROOT + "async-languages/index.js")
                  .then(index => {
                    if (index.has(block.className)) {
                      return require(HL_ROOT +
                        "async-languages/" +
                        index.get(block.className)).then(language => {
                        hl.registerLanguage(block.className, language);
                      });
                    }
                  })
                  .then(done, done);
              }
            });
          });
        }
        return root;
      },
      function() {
        return document.createElement("div");
      }
    );
  };
}

function Mutable(value) {
  let change;
  Object.defineProperties(this, {
    generator: {value: observe(_ => void (change = _))},
    value: {get: () => value, set: x => change(value = x)}
  });
  if (value !== undefined) change(value);
}

function* now() {
  while (true) {
    yield Date.now();
  }
}

function delay(duration, value) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(value);
    }, duration);
  });
}

var timeouts = new Map;

function timeout(now, time) {
  var t = new Promise(function(resolve) {
    timeouts.delete(time);
    var delay = time - now;
    if (!(delay > 0)) throw new Error("invalid time");
    if (delay > 0x7fffffff) throw new Error("too long to wait");
    setTimeout(resolve, delay);
  });
  timeouts.set(time, t);
  return t;
}

function when(time, value) {
  var now;
  return (now = timeouts.get(time = +time)) ? now.then(constant(value))
      : (now = Date.now()) >= time ? Promise.resolve(value)
      : timeout(now, time).then(constant(value));
}

function tick(duration, value) {
  return when(Math.ceil((Date.now() + 1) / duration) * duration, value);
}

var Promises = {
  delay: delay,
  tick: tick,
  when: when
};

function resolve(name, base) {
  if (/^(\w+:)|\/\//i.test(name)) return name;
  if (/^[.]{0,2}\//i.test(name)) return new URL(name, base == null ? location : base).href;
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new Error("illegal name");
  return "https://unpkg.com/" + name;
}

const metas = new Map;
const queue$1 = [];
const map$1 = queue$1.map;
const some = queue$1.some;
const hasOwnProperty$1 = queue$1.hasOwnProperty;
const origin = "https://cdn.jsdelivr.net/npm/";
const identifierRe = /^((?:@[^/@]+\/)?[^/@]+)(?:@([^/]+))?(?:\/(.*))?$/;
const versionRe = /^\d+\.\d+\.\d+(-[\w-.+]+)?$/;
const extensionRe = /\.[^/]*$/;
const mains = ["unpkg", "jsdelivr", "browser", "main"];

class RequireError extends Error {
  constructor(message) {
    super(message);
  }
}

RequireError.prototype.name = RequireError.name;

function main(meta) {
  for (const key of mains) {
    const value = meta[key];
    if (typeof value === "string") {
      return extensionRe.test(value) ? value : `${value}.js`;
    }
  }
}

function parseIdentifier(identifier) {
  const match = identifierRe.exec(identifier);
  return match && {
    name: match[1],
    version: match[2],
    path: match[3]
  };
}

function resolveMeta(target) {
  const url = `${origin}${target.name}${target.version ? `@${target.version}` : ""}/package.json`;
  let meta = metas.get(url);
  if (!meta) metas.set(url, meta = fetch(url).then(response => {
    if (!response.ok) throw new RequireError("unable to load package.json");
    if (response.redirected && !metas.has(response.url)) metas.set(response.url, meta);
    return response.json();
  }));
  return meta;
}

async function resolve$1(name, base) {
  if (name.startsWith(origin)) name = name.substring(origin.length);
  if (/^(\w+:)|\/\//i.test(name)) return name;
  if (/^[.]{0,2}\//i.test(name)) return new URL(name, base == null ? location : base).href;
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new RequireError("illegal name");
  const target = parseIdentifier(name);
  if (!target) return `${origin}${name}`;
  if (!target.version && base != null && base.startsWith(origin)) {
    const meta = await resolveMeta(parseIdentifier(base.substring(origin.length)));
    target.version = meta.dependencies && meta.dependencies[target.name] || meta.peerDependencies && meta.peerDependencies[target.name];
  }
  if (target.path && !extensionRe.test(target.path)) target.path += ".js";
  if (target.path && target.version && versionRe.test(target.version)) return `${origin}${target.name}@${target.version}/${target.path}`;
  const meta = await resolveMeta(target);
  return `${origin}${meta.name}@${meta.version}/${target.path || main(meta) || "index.js"}`;
}

const require = requireFrom(resolve$1);

function requireFrom(resolver) {
  const cache = new Map;
  const requireBase = requireRelative(null);

  function requireAbsolute(url) {
    if (typeof url !== "string") return url;
    let module = cache.get(url);
    if (!module) cache.set(url, module = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.onload = () => {
        try { resolve(queue$1.pop()(requireRelative(url))); }
        catch (error) { reject(new RequireError("invalid module")); }
        script.remove();
      };
      script.onerror = () => {
        reject(new RequireError("unable to load module"));
        script.remove();
      };
      script.async = true;
      script.src = url;
      window.define = define$1;
      document.head.appendChild(script);
    }));
    return module;
  }

  function requireRelative(base) {
    return name => Promise.resolve(resolver(name, base)).then(requireAbsolute);
  }

  function requireAlias(aliases) {
    return requireFrom((name, base) => {
      if (name in aliases) {
        name = aliases[name], base = null;
        if (typeof name !== "string") return name;
      }
      return resolver(name, base);
    });
  }

  function require(name) {
    return arguments.length > 1
        ? Promise.all(map$1.call(arguments, requireBase)).then(merge$1)
        : requireBase(name);
  }

  require.alias = requireAlias;
  require.resolve = resolver;

  return require;
}

function merge$1(modules) {
  const o = {};
  for (const m of modules) {
    for (const k in m) {
      if (hasOwnProperty$1.call(m, k)) {
        if (m[k] == null) Object.defineProperty(o, k, {get: getter(m, k)});
        else o[k] = m[k];
      }
    }
  }
  return o;
}

function getter(object, name) {
  return () => object[name];
}

function isbuiltin(name) {
  name = name + "";
  return name === "exports" || name === "module";
}

function define$1(name, dependencies, factory) {
  const n = arguments.length;
  if (n < 2) factory = name, dependencies = [];
  else if (n < 3) factory = dependencies, dependencies = typeof name === "string" ? [] : name;
  queue$1.push(some.call(dependencies, isbuiltin) ? require => {
    const exports = {};
    const module = {exports};
    return Promise.all(map$1.call(dependencies, name => {
      name = name + "";
      return name === "exports" ? exports : name === "module" ? module : require(name);
    })).then(dependencies => {
      factory.apply(null, dependencies);
      return module.exports;
    });
  } : require => {
    return Promise.all(map$1.call(dependencies, require)).then(dependencies => {
      return typeof factory === "function" ? factory.apply(null, dependencies) : factory;
    });
  });
}

define$1.amd = {};

function requirer(resolve) {
  return resolve == null ? require : requireFrom(resolve);
}

var svg$1 = template(function(string) {
  var root = document.createElementNS("http://www.w3.org/2000/svg", "g");
  root.innerHTML = string.trim();
  return root;
}, function() {
  return document.createElementNS("http://www.w3.org/2000/svg", "g");
});

var raw = String.raw;

function style(href) {
  return new Promise(function(resolve, reject) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onerror = reject;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

function tex(require) {
  return function() {
    return Promise.all([
      require("@observablehq/katex@0.11.1/dist/katex.min.js"),
      require.resolve("@observablehq/katex@0.11.1/dist/katex.min.css").then(style)
    ]).then(function(values) {
      var katex = values[0], tex = renderer();

      function renderer(options) {
        return function() {
          var root = document.createElement("div");
          katex.render(raw.apply(String, arguments), root, options);
          return root.removeChild(root.firstChild);
        };
      }

      tex.options = renderer;
      tex.block = renderer({displayMode: true});
      return tex;
    });
  };
}

function width() {
  return observe(function(change) {
    var width = change(document.body.clientWidth);
    function resized() {
      var w = document.body.clientWidth;
      if (w !== width) change(width = w);
    }
    window.addEventListener("resize", resized);
    return function() {
      window.removeEventListener("resize", resized);
    };
  });
}

function Library(resolver) {
  const require = requirer(resolver);
  Object.defineProperties(this, {
    DOM: {value: DOM, writable: true, enumerable: true},
    Files: {value: Files, writable: true, enumerable: true},
    Generators: {value: Generators, writable: true, enumerable: true},
    html: {value: constant(html), writable: true, enumerable: true},
    md: {value: md(require), writable: true, enumerable: true},
    Mutable: {value: constant(Mutable), writable: true, enumerable: true},
    now: {value: now, writable: true, enumerable: true},
    Promises: {value: Promises, writable: true, enumerable: true},
    require: {value: constant(require), writable: true, enumerable: true},
    resolve: {value: constant(resolve), writable: true, enumerable: true},
    svg: {value: constant(svg$1), writable: true, enumerable: true},
    tex: {value: tex(require), writable: true, enumerable: true},
    width: {value: width, writable: true, enumerable: true}
  });
}

function RuntimeError(message, input) {
  this.message = message + "";
  this.input = input;
}

RuntimeError.prototype = Object.create(Error.prototype);
RuntimeError.prototype.name = "RuntimeError";
RuntimeError.prototype.constructor = RuntimeError;

function generatorish(value) {
  return value
      && typeof value.next === "function"
      && typeof value.return === "function";
}

function load(notebook, library, observer) {
  if (typeof library == "function") observer = library, library = null;
  if (typeof observer !== "function") throw new Error("invalid observer");
  if (library == null) library = new Library();

  const {modules, id} = notebook;
  const map = new Map;
  const runtime = new Runtime(library);
  const main = runtime_module(id);

  function runtime_module(id) {
    let module = map.get(id);
    if (!module) map.set(id, module = runtime.module());
    return module;
  }

  for (const m of modules) {
    const module = runtime_module(m.id);
    let i = 0;
    for (const v of m.variables) {
      if (v.from) module.import(v.remote, v.name, runtime_module(v.from));
      else if (module === main) module.variable(observer(v, i, m.variables)).define(v.name, v.inputs, v.value);
      else module.define(v.name, v.inputs, v.value);
      ++i;
    }
  }

  return runtime;
}

var prototype = Array.prototype;
var map$2 = prototype.map;
var forEach = prototype.forEach;

function constant$1(x) {
  return function() {
    return x;
  };
}

function identity(x) {
  return x;
}

function rethrow(e) {
  return function() {
    throw e;
  };
}

function noop$1() {}

var TYPE_NORMAL = 1; // a normal variable
var TYPE_IMPLICIT = 2; // created on reference
var TYPE_DUPLICATE = 3; // created on duplicate definition

var no_observer = {};

function Variable(type, module, observer) {
  if (observer == null) observer = no_observer;
  Object.defineProperties(this, {
    _observer: {value: observer, writable: true},
    _definition: {value: variable_undefined, writable: true},
    _duplicate: {value: undefined, writable: true},
    _duplicates: {value: undefined, writable: true},
    _indegree: {value: NaN, writable: true}, // The number of computing inputs.
    _inputs: {value: [], writable: true},
    _invalidate: {value: noop$1, writable: true},
    _module: {value: module},
    _name: {value: null, writable: true},
    _outputs: {value: new Set, writable: true},
    _promise: {value: Promise.resolve(undefined), writable: true},
    _reachable: {value: observer !== no_observer, writable: true}, // Is this variable transitively visible?
    _rejector: {value: variable_rejector(this)},
    _type: {value: type},
    _value: {value: undefined, writable: true},
    _version: {value: 0, writable: true}
  });
}

Object.defineProperties(Variable.prototype, {
  _pending: {value: variable_pending, writable: true, configurable: true},
  _fulfilled: {value: variable_fulfilled, writable: true, configurable: true},
  _rejected: {value: variable_rejected, writable: true, configurable: true},
  define: {value: variable_define, writable: true, configurable: true},
  delete: {value: variable_delete, writable: true, configurable: true},
  import: {value: variable_import, writable: true, configurable: true}
});

function variable_attach(variable) {
  variable._module._runtime._dirty.add(variable);
  variable._outputs.add(this);
}

function variable_detach(variable) {
  variable._module._runtime._dirty.add(variable);
  variable._outputs.delete(this);
}

function variable_undefined() {
  throw variable_undefined;
}

function variable_rejector(variable) {
  return function(error) {
    if (error === variable_undefined) throw new RuntimeError(variable._name + " is not defined", variable._name);
    throw new RuntimeError(variable._name + " could not be resolved", variable._name);
  };
}

function variable_duplicate(name) {
  return function() {
    throw new RuntimeError(name + " is defined more than once");
  };
}

function variable_define(name, inputs, definition) {
  switch (arguments.length) {
    case 1: {
      definition = name, name = inputs = null;
      break;
    }
    case 2: {
      definition = inputs;
      if (typeof name === "string") inputs = null;
      else inputs = name, name = null;
      break;
    }
  }
  return variable_defineImpl.call(this,
    name == null ? null : name + "",
    inputs == null ? [] : map$2.call(inputs, this._module._resolve, this._module),
    typeof definition === "function" ? definition : constant$1(definition)
  );
}

function variable_defineImpl(name, inputs, definition) {
  var scope = this._module._scope, runtime = this._module._runtime;

  this._inputs.forEach(variable_detach, this);
  inputs.forEach(variable_attach, this);
  this._inputs = inputs;
  this._definition = definition;
  this._value = undefined;

  // Is this an active variable (that may require disposal)?
  if (definition === noop$1) runtime._variables.delete(this);
  else runtime._variables.add(this);

  // Did the variable’s name change? Time to patch references!
  if (name == this._name && scope.get(name) === this) {
    this._outputs.forEach(runtime._updates.add, runtime._updates);
  } else {
    var error, found;

    if (this._name) { // Did this variable previously have a name?
      if (this._outputs.size) { // And did other variables reference this variable?
        scope.delete(this._name);
        found = this._module._resolve(this._name);
        found._outputs = this._outputs, this._outputs = new Set;
        found._outputs.forEach(function(output) { output._inputs[output._inputs.indexOf(this)] = found; }, this);
        found._outputs.forEach(runtime._updates.add, runtime._updates);
        runtime._dirty.add(found).add(this);
        scope.set(this._name, found);
      } else if ((found = scope.get(this._name)) === this) { // Do no other variables reference this variable?
        scope.delete(this._name); // It’s safe to delete!
      } else if (found._type === TYPE_DUPLICATE) { // Do other variables assign this name?
        found._duplicates.delete(this); // This variable no longer assigns this name.
        this._duplicate = undefined;
        if (found._duplicates.size === 1) { // Is there now only one variable assigning this name?
          found = found._duplicates.keys().next().value; // Any references are now fixed!
          error = scope.get(this._name);
          found._outputs = error._outputs, error._outputs = new Set;
          found._outputs.forEach(function(output) { output._inputs[output._inputs.indexOf(error)] = found; });
          found._definition = found._duplicate, found._duplicate = undefined;
          runtime._dirty.add(error).add(found);
          runtime._updates.add(found);
          scope.set(this._name, found);
        }
      } else {
        throw new Error;
      }
    }

    if (this._outputs.size) throw new Error;

    if (name) { // Does this variable have a new name?
      if (found = scope.get(name)) { // Do other variables reference or assign this name?
        if (found._type === TYPE_DUPLICATE) { // Do multiple other variables already define this name?
          this._definition = variable_duplicate(name), this._duplicate = definition;
          found._duplicates.add(this);
        } else if (found._type === TYPE_IMPLICIT) { // Are the variable references broken?
          this._outputs = found._outputs, found._outputs = new Set; // Now they’re fixed!
          this._outputs.forEach(function(output) { output._inputs[output._inputs.indexOf(found)] = this; }, this);
          runtime._dirty.add(found).add(this);
          scope.set(name, this);
        } else { // Does another variable define this name?
          found._duplicate = found._definition, this._duplicate = definition; // Now they’re duplicates.
          error = new Variable(TYPE_DUPLICATE, this._module);
          error._name = name;
          error._definition = this._definition = found._definition = variable_duplicate(name);
          error._outputs = found._outputs, found._outputs = new Set;
          error._outputs.forEach(function(output) { output._inputs[output._inputs.indexOf(found)] = error; });
          error._duplicates = new Set([this, found]);
          runtime._dirty.add(found).add(error);
          runtime._updates.add(found).add(error);
          scope.set(name, error);
        }
      } else {
        scope.set(name, this);
      }
    }

    this._name = name;
  }

  runtime._updates.add(this);
  runtime._compute();
  return this;
}

function variable_import(remote, name, module) {
  if (arguments.length < 3) module = name, name = remote;
  return variable_defineImpl.call(this, name + "", [module._resolve(remote + "")], identity);
}

function variable_delete() {
  return variable_defineImpl.call(this, null, [], noop$1);
}

function variable_pending() {
  if (this._observer.pending) this._observer.pending();
}

function variable_fulfilled(value) {
  if (this._observer.fulfilled) this._observer.fulfilled(value, this._name);
}

function variable_rejected(error) {
  if (this._observer.rejected) this._observer.rejected(error, this._name);
}

var none = new Map;

function Module(runtime) {
  Object.defineProperties(this, {
    _runtime: {value: runtime},
    _scope: {value: new Map}
  });
}

Object.defineProperties(Module.prototype, {
  _copy: {value: module_copy, writable: true, configurable: true},
  _resolve: {value: module_resolve, writable: true, configurable: true},
  redefine: {value: module_redefine, writable: true, configurable: true},
  define: {value: module_define, writable: true, configurable: true},
  derive: {value: module_derive, writable: true, configurable: true},
  import: {value: module_import, writable: true, configurable: true},
  value: {value: module_value, writable: true, configurable: true},
  variable: {value: module_variable, writable: true, configurable: true}
});

function module_redefine(name) {
  var v = this._scope.get(name);
  if (!v) throw new RuntimeError(name + " is not defined");
  if (v._type === TYPE_DUPLICATE) throw new RuntimeError(name + " is defined more than once");
  return v.define.apply(v, arguments);
}

function module_define() {
  var v = new Variable(TYPE_NORMAL, this);
  return v.define.apply(v, arguments);
}

function module_import() {
  var v = new Variable(TYPE_NORMAL, this);
  return v.import.apply(v, arguments);
}

function module_variable(observer) {
  return new Variable(TYPE_NORMAL, this, observer);
}

async function module_value(name) {
  var v = this._scope.get(name);
  if (!v) throw new RuntimeError(name + " is not defined");
  if (v._observer === no_observer) {
    v._observer = true;
    this._runtime._dirty.add(v);
  }
  await this._runtime._compute();
  return v._promise;
}

function module_derive(injects, injectModule) {
  var injectByAlias = new Map;
  forEach.call(injects, function(inject) {
    if (typeof inject !== "object") inject = {name: inject + ""};
    if (inject.alias == null) inject.alias = inject.name;
    injectByAlias.set(inject.alias, inject);
  });
  var copy = new Module(this._runtime);
  Promise.resolve().then(() => this._copy(copy, injectByAlias, injectModule, new Map));
  return copy;
}

function module_copy(copy, injectByAlias, injectModule, map) {
  map.set(this, copy);
  this._scope.forEach(function(source, name) {
    var target = new Variable(source._type, copy), inject;
    if (inject = injectByAlias.get(name)) {
      target.import(inject.name, inject.alias, injectModule);
    } else if (source._definition === identity) { // import!
      var sourceInput = source._inputs[0],
          sourceModule = sourceInput._module,
          targetModule = map.get(sourceModule) || sourceModule._copy(new Module(copy._runtime), none, null, map);
      target.import(sourceInput._name, name, targetModule);
    } else {
      target.define(name, source._inputs.map(variable_name), source._definition);
    }
  });
  return copy;
}

function module_resolve(name) {
  var variable = this._scope.get(name), value;
  if (!variable)  {
    variable = new Variable(TYPE_IMPLICIT, this);
    if (this._runtime._builtin._scope.has(name)) {
      variable.import(name, this._runtime._builtin);
    } else if (name === "invalidation") {
      variable.define(name, variable_invalidation);
    } else if (name === "visibility") {
      variable.define(name, variable_visibility);
    } else {
      try {
        value = this._runtime._global(name);
      } catch (error) {
        return variable.define(name, rethrow(error));
      }
      if (value === undefined) {
        this._scope.set(variable._name = name, variable);
      } else {
        variable.define(name, constant$1(value));
      }
    }
  }
  return variable;
}

function variable_name(variable) {
  return variable._name;
}

const frame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setImmediate;

var variable_invalidation = {};
var variable_visibility = {};

function Runtime(builtins = new Library, global = window_global) {
  var builtin = this.module();
  Object.defineProperties(this, {
    _dirty: {value: new Set},
    _updates: {value: new Set},
    _computing: {value: null, writable: true},
    _init: {value: null, writable: true},
    _modules: {value: new Map},
    _variables: {value: new Set},
    _disposed: {value: false, writable: true},
    _builtin: {value: builtin},
    _global: {value: global}
  });
  if (builtins) for (var name in builtins) {
    (new Variable(TYPE_IMPLICIT, builtin)).define(name, [], builtins[name]);
  }
}

Object.defineProperties(Runtime, {
  load: {value: load, writable: true, configurable: true}
});

Object.defineProperties(Runtime.prototype, {
  _compute: {value: runtime_compute, writable: true, configurable: true},
  _computeSoon: {value: runtime_computeSoon, writable: true, configurable: true},
  _computeNow: {value: runtime_computeNow, writable: true, configurable: true},
  dispose: {value: runtime_dispose, writable: true, configurable: true},
  module: {value: runtime_module, writable: true, configurable: true}
});

function runtime_dispose() {
  this._computing = Promise.resolve();
  this._disposed = true;
  this._variables.forEach(v => {
    v._invalidate();
    v._version = NaN;
  });
}

function runtime_module(define, observer = noop$1) {
  let module;
  if (define === undefined) {
    if (module = this._init) {
      this._init = null;
      return module;
    }
    return new Module(this);
  }
  module = this._modules.get(define);
  if (module) return module;
  this._init = module = new Module(this);
  this._modules.set(define, module);
  try {
    define(this, observer);
  } finally {
    this._init = null;
  }
  return module;
}

function runtime_compute() {
  return this._computing || (this._computing = this._computeSoon());
}

function runtime_computeSoon() {
  var runtime = this;
  return new Promise(function(resolve) {
    frame(function() {
      resolve();
      runtime._disposed || runtime._computeNow();
    });
  });
}

function runtime_computeNow() {
  var queue = [],
      variables,
      variable;

  // Compute the reachability of the transitive closure of dirty variables.
  // Any newly-reachable variable must also be recomputed.
  // Any no-longer-reachable variable must be terminated.
  variables = new Set(this._dirty);
  variables.forEach(function(variable) {
    variable._inputs.forEach(variables.add, variables);
    const reachable = variable_reachable(variable);
    if (reachable > variable._reachable) {
      this._updates.add(variable);
    } else if (reachable < variable._reachable) {
      variable._invalidate();
    }
    variable._reachable = reachable;
  }, this);

  // Compute the transitive closure of updating, reachable variables.
  variables = new Set(this._updates);
  variables.forEach(function(variable) {
    if (variable._reachable) {
      variable._indegree = 0;
      variable._outputs.forEach(variables.add, variables);
    } else {
      variable._indegree = NaN;
      variables.delete(variable);
    }
  });

  this._computing = null;
  this._updates.clear();
  this._dirty.clear();

  // Compute the indegree of updating variables.
  variables.forEach(function(variable) {
    variable._outputs.forEach(variable_increment);
  });

  // Identify the root variables (those with no updating inputs).
  variables.forEach(function(variable) {
    if (variable._indegree === 0) {
      queue.push(variable);
    }
  });

  // Compute the variables in topological order.
  while (variable = queue.pop()) {
    variable_compute(variable);
    variable._outputs.forEach(postqueue);
    variables.delete(variable);
  }

  // Any remaining variables have circular definitions.
  variables.forEach(function(variable) {
    var error = new RuntimeError("circular definition");
    variable._value = undefined;
    (variable._promise = Promise.reject(error)).catch(noop$1);
    variable._rejected(error);
  });

  function postqueue(variable) {
    if (--variable._indegree === 0) {
      queue.push(variable);
    }
  }
}

function variable_increment(variable) {
  ++variable._indegree;
}

function variable_value(variable) {
  return variable._promise.catch(variable._rejector);
}

function variable_invalidator(variable) {
  return new Promise(function(resolve) {
    variable._invalidate = resolve;
  });
}

function variable_intersector(invalidation, variable) {
  let node = typeof IntersectionObserver === "function" && variable._observer && variable._observer._node;
  let visible = !node, resolve = noop$1, reject = noop$1, promise, observer;
  if (node) {
    observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting) && (promise = null, resolve()));
    observer.observe(node);
    invalidation.then(() => (observer.disconnect(), observer = null, reject()));
  }
  return function(value) {
    if (visible) return Promise.resolve(value);
    if (!observer) return Promise.reject();
    if (!promise) promise = new Promise((y, n) => (resolve = y, reject = n));
    return promise.then(() => value);
  };
}

function variable_compute(variable) {
  variable._invalidate();
  variable._invalidate = noop$1;
  variable._pending();
  var value0 = variable._value,
      version = ++variable._version,
      invalidation = null,
      promise = variable._promise = Promise.all(variable._inputs.map(variable_value)).then(function(inputs) {
    if (variable._version !== version) return;

    // Replace any reference to invalidation with the promise, lazily.
    for (var i = 0, n = inputs.length; i < n; ++i) {
      switch (inputs[i]) {
        case variable_invalidation: {
          inputs[i] = invalidation = variable_invalidator(variable);
          break;
        }
        case variable_visibility: {
          if (!invalidation) invalidation = variable_invalidator(variable);
          inputs[i] = variable_intersector(invalidation, variable);
          break;
        }
      }
    }

    // Compute the initial value of the variable.
    return variable._definition.apply(value0, inputs);
  }).then(function(value) {
    // If the value is a generator, then retrieve its first value,
    // and dispose of the generator if the variable is invalidated.
    if (generatorish(value)) {
      (invalidation || variable_invalidator(variable)).then(variable_return(value));
      return variable_precompute(variable, version, promise, value);
    }
    return value;
  });
  promise.then(function(value) {
    if (variable._version !== version) return;
    variable._value = value;
    variable._fulfilled(value);
  }, function(error) {
    if (variable._version !== version) return;
    variable._value = undefined;
    variable._rejected(error);
  });
}

function variable_precompute(variable, version, promise, generator) {
  function recompute() {
    var promise = new Promise(function(resolve) {
      resolve(generator.next());
    }).then(function(next) {
      return next.done ? undefined : Promise.resolve(next.value).then(function(value) {
        if (variable._version !== version) return;
        variable_postrecompute(variable, value, promise).then(recompute);
        variable._fulfilled(value);
        return value;
      });
    });
    promise.catch(function(error) {
      if (variable._version !== version) return;
      variable_postrecompute(variable, undefined, promise);
      variable._rejected(error);
    });
  }
  return new Promise(function(resolve) {
    resolve(generator.next());
  }).then(function(next) {
    if (next.done) return;
    promise.then(recompute);
    return next.value;
  });
}

function variable_postrecompute(variable, value, promise) {
  var runtime = variable._module._runtime;
  variable._value = value;
  variable._promise = promise;
  variable._outputs.forEach(runtime._updates.add, runtime._updates); // TODO Cleaner?
  return runtime._compute();
}

function variable_return(generator) {
  return function() {
    generator.return();
  };
}

function variable_reachable(variable) {
  if (variable._observer !== no_observer) return true; // Directly reachable.
  var outputs = new Set(variable._outputs);
  for (const output of outputs) {
    if (output._observer !== no_observer) return true;
    output._outputs.forEach(outputs.add, outputs);
  }
  return false;
}

function window_global(name) {
  return window[name];
}

// Import Observable notebook

// Render selected notebook cells into DOM elements of this page
const runtime = new Runtime();
const main$1 = runtime.module(define, name => {
  switch (name) {
    case 'chart':
      // render 'chart' notebook cell into <div id="joyplot"></div>
      return new Inspector(document.querySelector('#joyplot'));
      break;
  }
});

}());
