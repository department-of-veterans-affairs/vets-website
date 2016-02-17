import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
  render() {
    return <h1>Hello World</h1>
  }
}

function init() {
  ReactDOM.render(<Hello/>, document.getElementById('react-root'));
}

export { init };
