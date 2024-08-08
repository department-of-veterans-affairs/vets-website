import React from 'react';
import PropTypes from 'prop-types';
import VAFacilityInfoSection from './VAFacilityInfoSection';
import VetCenterImageSection from './VetCenterImageSection';

const VAFacility = props => {
  const { vaFacility, mainPhone } = props;
  return (
    <div
      className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column
        small-screen:vads-u-flex-direction--row facility
      vads-u-margin-bottom--4 medium-screen:vads-u-margin-bottom--5"
      key={vaFacility.id || vaFacility.fieldFacilityLocatorApiId}
    >
      <section className="region-grid vads-u-margin-right--2">
        <VAFacilityInfoSection vaFacility={vaFacility} mainPhone={mainPhone} />
      </section>

      {vaFacility.fieldMedia && (
        <section
          className="region-grid usa-width-one-half vads-u-order--first small-screen:vads-u-order--initial
        vads-u-margin-bottom--2"
        >
          <VetCenterImageSection vetCenter={vaFacility} />
        </section>
      )}
    </div>
  );
};

VAFacility.propTypes = {
  mainPhone: PropTypes.string,
  vaFacility: PropTypes.object,
};

export default VAFacility;
