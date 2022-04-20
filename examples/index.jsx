import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
  >
    <h1>VA Forms System Core Examples</h1>
    <ul>
      <li>
        <a href="simple-form">Simple form</a>
      </li>
      <li>
        <a href="multipage-form">Multipage form</a>
      </li>
      <li>
        <a href="form-state">Form State</a>
      </li>
    </ul>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
