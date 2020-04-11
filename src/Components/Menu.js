import React from "react";

export default function Menu(props) {
  return (
    <div className="menu">
      <h1>PathFinder</h1>
      <button onClick={() => props.runScript()} class="button is-light">
        Run Script
      </button>
      <button onClick={() => props.clearPath()} class="button is-danger">
        Clear 
      </button>
      <button onClick={() => props.clear()} class="button is-danger">
        Clear All
      </button>
    </div>
  );
}
