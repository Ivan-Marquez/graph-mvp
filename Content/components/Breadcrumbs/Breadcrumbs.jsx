import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";

const breadcrumbs = css`
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    color: var(--colorNormal);
    font-weight: 200;
    font-size: 20px;
    display: inline;
  }

  li:last-of-type {
    font-weight: 600;
  }

  li a {
    color: var(--colorNormal);
    text-decoration: none;
  }

  li:after {
    content: " / ";
  }

  li:last-child:after {
    content: none;
  }
`;

function Breadcrumbs(props) {
  const navStack = props.navigationStack.slice() || [];
  navStack.unshift(props.rootTitle);

  function handleClick(index) {
    const newState = props.navigationStack.slice(0, index + 1);
    props.navigationCallback(newState);
  }

  function setListItems(state, index) {
    return index !== navStack.length - 1 ? (
      <li key={index + state}>
        <a
          className="clickable"
          onClick={() => {
            handleClick(index - 1);
          }}
        >
          {state}
        </a>
      </li>
    ) : (
      <li key={index + state}>{state}</li>
    );
  }

  return (
    <div className={breadcrumbs}>
      <ol>{navStack.map(setListItems)}</ol>
    </div>
  );
}

Breadcrumbs.propTypes = {
  rootTitle: PropTypes.string.isRequired,
  navigationStack: PropTypes.array.isRequired,
  navigationCallback: PropTypes.func.isRequired,
};

export default Breadcrumbs;
