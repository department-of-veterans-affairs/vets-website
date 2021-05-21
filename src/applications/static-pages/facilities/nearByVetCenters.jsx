import React from 'react';
import PropTypes from 'prop-types';

const NearByVetCenters = () => {
  return (
    <div>
      <h2
        className="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5
                  medium-screen:vads-u-margin-bottom--3"
        id="other-near-locations"
      >
        Other nearby Vet Centers
      </h2>
    </div>
  );
};

NearByVetCenters.propTypes = {
  vetCenters: PropTypes.array,
};

export default NearByVetCenters;
