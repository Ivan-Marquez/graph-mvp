import React, { Fragment } from "react";
import { injectGlobal } from "emotion";
import { useGraphContainer } from "./lib";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs.jsx";
import Graph from "../Graph/Graph.jsx";
import _ from "lodash";

injectGlobal`
  .selected-formatted-date-time,
  .reset-layout-link {
    display: inline-block;
    line-height: 24px;
    color: var(--colorNormalDimmed);
  }

  .reset-layout-link {
    padding-left: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

function GraphContainer(props) {
  const state = useGraphContainer(props);

  const { trafficData } = state;
  const breadcrumbsRoot = _.get(trafficData, "name", "root");
  const showBreadcrumbs = trafficData && trafficData.nodes && trafficData.nodes.length > 0;

  function navigationCallback(newNavigationState) {
    state.setCurrentView(newNavigationState);
  }

  function viewChanged({ graph, view }) {
    state.setSearchTerm("");
    state.setCurrentView(view);
    state.setMatches({ total: -1, visible: -1 });
    state.setCurrentGraph(graph);
    graph.type !== "global" ? state.setRedirectFrom(graph.parentGraph.name) : state.setRedirectFrom("");
  }

  function objectHighlighted(highlightedObject) {
    state.setHighlightedObject(highlightedObject);
    state.setObjectToHighlight(highlightedObject ? highlightedObject.getName() : undefined);
    state.setSearchTerm("");
    state.setMatches({ total: -1, visible: -1 });
    state.setRedirectFrom(undefined);
  }

  const { displayOptions } = state;

  return (
    <Fragment>
      <div className="subheader">
        {showBreadcrumbs && (
          <Breadcrumbs
            rootTitle={breadcrumbsRoot}
            navigationStack={state.currentView}
            navigationCallback={navigationCallback}
          />
        )}
      </div>
      <div className="service-traffic-map">
        <Graph
          traffic={trafficData}
          view={state.currentView}
          viewChanged={viewChanged}
          allowDraggingOfNodes={displayOptions.allowDraggingOfNodes}
          targetFramerate={state.targetFramerate}
          objectToHighlight={state.objectToHighlight}
          objectHighlighted={objectHighlighted}
          showLabels={displayOptions.showLabels}
          definitions={state.definitions}
          match={state.searchTerm}
        />
      </div>
    </Fragment>
  );
}

export default GraphContainer;
