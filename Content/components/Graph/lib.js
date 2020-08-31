import { useEffect } from "react";

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

export const defaultProps = {
  connectionHighlighted: () => {},
  definitions: {},
  filters: [],
  match: "",
  nodeHighlighted: () => {},
  nodeUpdated: () => {},
  nodeContextSizeChanged: () => {},
  matchesFound: () => {},
  objectHighlighted: () => {},
  objectHovered: () => {},
  objectToHighlight: null,
  showLabels: true,
  allowDraggingOfNodes: true,
  styles: {},
  traffic: {},
  viewChanged: () => {},
  viewUpdated: () => {},
  view: [],
  targetFramerate: null,
};

function updateStyles(graph, styles) {
  const styleNames = graph.getStyles();
  const customStyles = styleNames.reduce((result, styleName) => {
    result[styleName] = styles[styleName] || result[styleName];
    return result;
  }, {});

  return graph.updateStyles(customStyles);
}

export function useGraph(canvas, props) {
  let graph;

  useEffect(function () {
    const targetFramerate = props.targetFramerate || defaultProps.targetFramerate;
    const viewChanged = props.viewChanged || defaultProps.viewChanged;
    const objectHighlighted = props.objectHighlighted || defaultProps.objectHighlighted;
    const objectHovered = props.objectHovered || defaultProps.objectHovered;
    const nodeUpdated = props.nodeUpdated || defaultProps.nodeUpdated;
    const nodeContextSizeChanged = props.nodeContextSizeChanged || defaultProps.nodeContextSizeChanged;
    const matchesFound = props.matchesFound || defaultProps.matchesFound;
    const viewUpdated = props.viewUpdated || defaultProps.viewUpdated;

    graph = new window.Vizceral.default(canvas.current, targetFramerate);

    graph.on("viewChanged", viewChanged);
    graph.on("objectHighlighted", objectHighlighted);
    graph.on("objectHovered", objectHovered);
    graph.on("nodeUpdated", nodeUpdated);
    graph.on("nodeContextSizeChanged", nodeContextSizeChanged);
    graph.on("matchesFound", matchesFound);
    graph.on("viewUpdated", viewUpdated);

    return () => {
      graph.removeAllListeners();
    };
  }, []);

  useEffect(
    function () {
      const showLabels = props.showshowLabels || defaultProps.showLabels;
      const allowDraggingOfNodes = props.allowDraggingOfNodes || defaultProps.allowDraggingOfNodes;
      const styles = props.styles || defaultProps.styles;
      const filters = props.filters || defaultProps.filters;
      const definitions = props.definitions || defaultProps.definitions;

      updateStyles(graph, styles);
      graph.setOptions({ showLabels, allowDraggingOfNodes });
      graph.setFilters(filters);
      graph.updateDefinitions(definitions);
    },
    [props.options, props.styles, props.filters, props.definitions]
  );

  useEffect(function () {
    const view = props.view || defaultProps.view;
    const objectToHighlight = props.objectToHighlight || defaultProps.objectToHighlight;
    const traffic = props.traffic || defaultProps.traffic;

    const timer = window.setTimeout(() => {
      graph.setView(view, objectToHighlight);
      graph.updateData(traffic);

      const perfNow = getPerformanceNow();

      graph.animate(perfNow === null ? 0 : perfNow);
      graph.updateBoundingRectCache();
    }, 0);

    // TODO: Temporary code to handle graph from dev tools. Remove after testing.
    window.graph = graph;

    return () => window.clearTimeout(timer);
  });

  return graph;
}
