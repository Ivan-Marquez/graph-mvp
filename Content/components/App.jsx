import { Component, Fragment } from "react";
import GraphContainer from "./GraphContainer/GraphContainer.jsx";
import {
  BrowserRouter,
  Route,
  Switch,
  StaticRouter,
  Redirect,
} from "react-router-dom";

class MainComponent extends Component {
  render() {
    const app = (
      <Fragment>
        <Helmet>
          <title>MVP</title>
        </Helmet>
        <div className="vizceral-container">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/graph" />} />
            <Route path="/graph" component={GraphContainer} />
            <Route
              path="*"
              component={({ staticContext }) => {
                if (staticContext) staticContext.status = 404;
                return <h1>Not Found :(</h1>;
              }}
            />
          </Switch>
        </div>
      </Fragment>
    );

    if (typeof window === "undefined") {
      return (
        <StaticRouter
          context={this.props.context}
          location={this.props.location}
        >
          {app}
        </StaticRouter>
      );
    }
    return <BrowserRouter>{app}</BrowserRouter>;
  }
}

export default MainComponent;
