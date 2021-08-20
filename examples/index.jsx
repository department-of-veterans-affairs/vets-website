import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
  >
    <h1>Formulate Examples</h1>
    <ul>
      <li>
        <a href="simple-form">Simple form</a>
      </li>
    </ul>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
