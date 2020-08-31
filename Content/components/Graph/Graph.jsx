import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useGraph } from "./lib";
import PropTypes from "prop-types";

export const GraphContext = React.createContext({});

function Graph(props = defaultProps) {
  const canvas = useRef();
  let graph = useGraph(canvas, props);

  useEffect(function () {
    canvas.current.height = window.innerHeight - 100;
  });

  return (
    <GraphContext.Provider value={graph}>
      <div className="vizceral">
        <canvas style={{ width: "100%", height: "100%" }} ref={canvas} />
        <div className="vizceral-notice"></div>
      </div>
    </GraphContext.Provider>
  );
}

const StyledGraph = styled(Graph)`
  .vizceral {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .vizceral .vizceral-notice {
    display: block;
    position: absolute;
    padding: 0 3px;
    width: 200px;

    background-color: black;
    border-left: 2px solid grey;

    font-size: 11px;
    color: grey;
  }

  .vizceral .vizceral-notice ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .vizceral .vizceral-notice > ul > li {
    line-height: 12px;
    padding-top: 3px;
    padding-bottom: 3px;
  }

  .vizceral .vizceral-notice .subtitle {
    font-weight: 900;
  }
`;

Graph.propTypes = {
  /**
   * Callback for when a connection is highlighted. The highlighted connection is the only parameter.
   */
  connectionHighlighted: PropTypes.func,
  /**
   * Object map of definitions. Refer to [github.com/Netflix/Vizceral/wiki/Configuration#definitions-for-data-to-display](https://github.com/Netflix/Vizceral/wiki/Configuration#definitions-for-data-to-display)
   */
  definitions: PropTypes.object,
  /**
   * Array of filter definitions and current values to filter out nodes and connections. Refer to
   * [github.com/Netflix/Vizceral/wiki/Configuration#filters](https://github.com/Netflix/Vizceral/wiki/Configuration#filters)
   */
  filters: PropTypes.array,
  /**
   * A search string to highlight nodes that match
   */
  match: PropTypes.string,
  /**
   * Callback for when an object is highlighted. The highlighted object is the only parameter.
   * `object.type` will be either 'node' or 'connection'
   */
  objectHighlighted: PropTypes.func,
  /**
   * Pass in the name of the object to highlight
   */
  objectToHighlight: PropTypes.string,
  /**
   * Callback for when the top level node context panel size changes. The updated dimensions is the only parameter.
   */
  nodeContextSizeChanged: PropTypes.func,
  /**
   * Callback when nodes match the match string. The matches object { total, visible } is the only property.
   */
  matchesFound: PropTypes.func,
  /**
   * Whether or not to show labels on the nodes.
   */
  showLabels: PropTypes.bool,
  /**
   * Nodes can be repositioned through dragging if and only if this is true.
   */
  allowDraggingOfNodes: PropTypes.bool,
  /**
   * Styles to override default properties.
   */
  styles: PropTypes.object,
  /**
   * The traffic data. See [github.com/Netflix/Vizceral/wiki/How-to-Use#graph-data-format](https://github.com/Netflix/Vizceral/wiki/How-to-Use#graph-data-format) for specification.
   */
  traffic: PropTypes.object,
  /**
   * Callback for when the view changed. The view array is the only property.
   */
  viewChanged: PropTypes.func,
  /**
   * Callback for when the current view is updated.
   */
  viewUpdated: PropTypes.func,
  /**
   * Target framerate for rendering engine
   */
  targetFramerate: PropTypes.number,
};

export default StyledGraph;
