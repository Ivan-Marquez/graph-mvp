import { useState, useEffect } from "react";
import queryString from "query-string";
import keypress from "keypress.js";
import _ from "lodash";

function checkInitialRoute(props) {
  // Check the location bar for any direct routing information
  const pathArray = props.location.pathname.split("/");
  const parsedQuery = queryString.parse(window.location.search);
  const views = [];

  if (pathArray[1]) {
    views.push(pathArray[1]);
    if (pathArray[2]) {
      views.push(pathArray[2]);
    }
  }

  return { parsedQuery, views };
}

export function useGraphContainer(props) {
  // State
  const [styles, setStyles] = useState({});
  const [filters, setFilters] = useState([]);
  const [definitions, setDefinitions] = useState({});
  const [currentView, setCurrentView] = useState([]);
  const [poppedState, setPoppedState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [redirectFrom, setRedirectFrom] = useState("");
  const [currentGraph, setCurrentGraph] = useState({});
  const [objectToHighlight, setObjectToHighlight] = useState("");
  const [highlightedObject, setHighlightedObject] = useState({});
  const [matches, setMatches] = useState({ total: 0, visible: 0 });
  const [modes, setModes] = useState({ detailedNode: "volume" });
  const [targetFramerate, setTargetFramerate] = useState(null);
  const [displayOptions, setDisplayOptions] = useState({ allowDraggingOfNodes: true, showLabels: true });
  const [trafficData, setTrafficData] = useState({});

  const source = new EventSource("/api/graph");
  const listener = new keypress.Listener();

  // Side Effects
  const initialize = function initialize() {
    const { views, parsedQuery } = checkInitialRoute(props);

    source.onmessage = (evt) => {
      const stream = JSON.parse(evt.data);
      setTrafficData(stream);
    };

    source.onerror = (evt) => {
      console.log("error:", evt);
      source.close();
    };

    setObjectToHighlight(parsedQuery.highlighted);
    setCurrentView(views);
  };

  const registerPopStateListener = function registerPopStateListener() {
    const listener = window.addEventListener("popstate", function handlePopState() {
      const state = props.history.state || {};

      setPoppedState(true);
      setCurrentView(state.selected);
      setObjectToHighlight(state.highlighted);
    });

    return function disposePopStateListener() {
      window.removeEventListener("popState", listener);
    };
  };

  const setKeypressListener = function setKeypressListener() {
    if (!_.isEmpty(currentView)) {
      listener.simple_combo("esc", () => {
        setModes({ detailedNode: undefined });
        setCurrentView([]);
      });
    }
  };

  useEffect(initialize, []);
  useEffect(registerPopStateListener, []);
  useEffect(setKeypressListener, [currentView]);

  const state = {
    styles,
    setStyles,
    filters,
    setFilters,
    definitions,
    setDefinitions,
    currentView,
    setCurrentView,
    poppedState,
    setPoppedState,
    searchTerm,
    setSearchTerm,
    redirectFrom,
    setRedirectFrom,
    currentGraph,
    setCurrentGraph,
    objectToHighlight,
    setObjectToHighlight,
    matches,
    setMatches,
    modes,
    setModes,
    displayOptions,
    setDisplayOptions,
    trafficData,
    setTrafficData,
    highlightedObject,
    setHighlightedObject,
    targetFramerate,
    setTargetFramerate,
  };

  return state;
}
