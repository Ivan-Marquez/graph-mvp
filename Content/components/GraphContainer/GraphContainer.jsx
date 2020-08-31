import { Fragment } from "react";
import styled from "styled-components";
import Graph from "../Graph/Graph.jsx";
import data from "./mockData";

function GraphContainer() {
  return (
    <Fragment>
      <div className="subheader"></div>
      <div className="service-traffic-map">
        <Graph traffic={data} />
      </div>
    </Fragment>
  );
}

const StyledGraphContainer = styled(GraphContainer)`
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

export default StyledGraphContainer;
