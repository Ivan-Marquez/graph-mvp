import { Component, Fragment } from "react";
import loadable from "@loadable/component";
import { BrowserRouter, Route, Switch, StaticRouter } from "react-router-dom";
const GraphContainer = loadable(() => import("./GraphContainer/GraphContainer.jsx"));

class MainComponent extends Component {
  render() {
    const app = (
      <Fragment>
        <Helmet>
          <title>MVP</title>
        </Helmet>
        <div className="vizceral-container">
          <Switch>
            <Route path="*" component={GraphContainer} />
          </Switch>
        </div>
      </Fragment>
    );

    if (typeof window === "undefined") {
      return (
        <StaticRouter context={this.props.context} location={this.props.location}>
          {app}
        </StaticRouter>
      );
    }
    return <BrowserRouter>{app}</BrowserRouter>;
  }
}

export default MainComponent;
