import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import RegistrationOnlyAlert from '../FormAlerts/RegistrationOnlyAlert';
import content from '../../locales/en/content.json';

const RegistrationOnlyGuest = ({ goBack }) => {
  return (
    <>
      <RegistrationOnlyAlert />
      <div className="row form-progress-buttons schemaform-buttons">
        <div className="small-5 medium-4 columns">
          <ProgressButton
            buttonClass="hca-button-progress usa-button-secondary"
            onButtonClick={goBack}
            buttonText={content['button-back']}
            beforeText="«"
          />
        </div>
      </div>
    </>
  );
};

RegistrationOnlyGuest.propTypes = {
  goBack: PropTypes.func,
};

export default RegistrationOnlyGuest;
