import React from "react";

export default function Menu({ handleRunButton, clearAll, clear }) {
  return (
    <div className="menu">
      <h1>PathFinder</h1>
      <button onClick={handleRunButton} class="button is-light">
        Run Script
      </button>
      <button onClick={clearAll} class="button is-danger">
        Clear
      </button>
      <button onClick={clear} class="button is-danger">
        Clear All
      </button>
    </div>
  );
}
