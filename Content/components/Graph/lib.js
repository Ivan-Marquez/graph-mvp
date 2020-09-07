import { useEffect, useState } from "react";
import WebFont from "webfontloader";
import Vizceral from "vizceral";
import _ from "lodash";

export function getPerformanceNow() {
  const g = window;
  if (g != null) {
    const perf = g.performance;
    if (perf != null) {
      try {
        const perfNow = perf.now();
        if (typeof perfNow === "number") {
          return perfNow;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  return null;
}

function updateStyles(graph, styles) {
  const styleNames = graph.getStyles();
  const customStyles = styleNames.reduce((result, styleName) => {
    result[styleName] = styles[styleName] || result[styleName];
    return result;
  }, {});

  return graph.updateStyles(customStyles);
}

// TODO: fonts are not loading on page load.
function loadFonts() {
  return WebFont.load({
    custom: {
      families: ["Source Sans Pro:n3,n4,n6,n7"],
      urls: ["/fonts/source-sans-pro.css"],
    },
  });
}

export function useGraph(canvasRef, props) {
  const [graph, setGraph] = useState({});

  // Side Effects
  const initializeGraph = function initializeGraph() {
    setGraph(new Vizceral(canvasRef.current), props.targetFramerate);
  };

  const registerGraphEvents = function registerGraphEvents() {
    if (!_.isEmpty(graph)) {
      loadFonts();

      const voidF = function () {};

      graph.on("viewChanged", props.viewChanged || voidF);
      graph.on("objectHighlighted", props.objectHighlighted || voidF);
      graph.on("objectHovered", props.objectHovered || voidF);
      graph.on("nodeUpdated", props.nodeUpdated || voidF);
      graph.on("nodeContextSizeChanged", props.nodeContextSizeChanged || voidF);
      graph.on("matchesFound", props.matchesFound || voidF);
      graph.on("viewUpdated", props.viewUpdated || voidF);

      return () => {
        graph.removeAllListeners();
      };
    }
  };

  const setGraphConfig = function setGraphConfig() {
    if (!_.isEmpty(graph)) {
      const showLabels = props.showshowLabels || true;
      const allowDraggingOfNodes = props.allowDraggingOfNodes || true;
      const styles = props.styles || {};
      const filters = props.filters || [];
      const definitions = props.definitions || {};
      const perfNow = getPerformanceNow();

      updateStyles(graph, styles);
      graph.setOptions({ showLabels, allowDraggingOfNodes });
      graph.setFilters(filters);
      graph.updateDefinitions(definitions);

      graph.animate(perfNow === null ? 0 : perfNow);
      graph.updateBoundingRectCache();
    }
  };

  const setGraphView = function setGraphView() {
    if (!_.isEmpty(graph)) {
      const view = props.view || [];
      const objectToHighlight = props.objectToHighlight || null;
      const traffic = props.traffic || {};

      graph.setView(view, objectToHighlight);
      graph.updateData(traffic);

      canvasRef.current.height = window.innerHeight - 100;
    }
  };

  useEffect(initializeGraph, []);
  useEffect(registerGraphEvents, [graph]);
  useEffect(setGraphConfig, [graph]);
  useEffect(setGraphView, [graph, props.traffic, props.view]);
}
