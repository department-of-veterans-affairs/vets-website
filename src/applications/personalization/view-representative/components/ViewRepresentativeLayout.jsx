import React from 'react';
import ViewRepresentativeBody from './ViewRepresentativeBody';

const ViewRepresentativeLayout = props => {
  return (
    <div className="vads-l-row">
      <main className="vads-l-col--12 medium-screen:vads-l-col--8">
        <header>
          <h1>View your VA representative</h1>
          <ViewRepresentativeBody representative={props.representative} />
        </header>
      </main>
    </div>
  );
};

export default ViewRepresentativeLayout;
