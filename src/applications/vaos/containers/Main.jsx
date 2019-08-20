import React from 'react';
import { Link } from 'react-router';

const Index = () => (
  <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <div>
          <h1>VA Online Scheduling</h1>
          <p>Hello, world.</p>
          <Link to="new-appointment">New appointment</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Index;
