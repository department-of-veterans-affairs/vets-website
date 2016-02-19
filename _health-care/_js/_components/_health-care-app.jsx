import React from 'react';

import { Nav } from './_hello-world.jsx';

class HealthCareApp extends React.Component {
  render()  {
    return (
      <div>
        <h1>Top-Level of App</h1>
        <Nav/>
        {this.props.children}
      </div>
    )
  }
}

export default HealthCareApp;
