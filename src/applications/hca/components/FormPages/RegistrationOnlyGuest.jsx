import React from 'react';
import PropTypes from 'prop-types';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import RegistrationOnlyAlert from '../FormAlerts/RegistrationOnlyAlert';
import content from '../../locales/en/content.json';

const RegistrationOnlyGuest = ({ goBack }) => {
  return (
    <form className="rjsf" noValidate>
      <div className="vads-u-margin-y--2 rjsf-object-field">
        <RegistrationOnlyAlert />
      </div>
      <div className="row form-progress-buttons schemaform-buttons">
        <div className="small-6 medium-5 columns">
          <ProgressButton
            buttonClass="hca-button-progress usa-button-secondary"
            onButtonClick={goBack}
            buttonText={content['button-back']}
            beforeText="«"
          />
        </div>
      </div>
    </form>
  );
};

RegistrationOnlyGuest.propTypes = {
  goBack: PropTypes.func,
};

export default RegistrationOnlyGuest;
