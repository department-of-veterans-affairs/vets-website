import React from 'react';
import ViewRepresentativeBody from './ViewRepresentativeBody';

const ViewRepresentativeLayout = props => {
  return (
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <header>
          <h1>View your representative for VA claims</h1>
          <ViewRepresentativeBody
            representative={props.representative}
            searchRepresentative={props.searchRepresentative}
          />
        </header>
      </div>
    </div>
  );
};

export default ViewRepresentativeLayout;
