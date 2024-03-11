import React from 'react';
import PropTypes from 'prop-types';

const FormFooter = ({ formConfig, currentLocation }) => {
  const GetHelp = formConfig.getHelp;
  const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
  const isConfirmationPage = trimmedPathname.endsWith('confirmation');

  return !isConfirmationPage ? (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="help-footer-box">
          <h2 className="help-heading">Need help?</h2>
          <GetHelp />
        </div>
      </div>
    </div>
  ) : null;
};

FormFooter.propTypes = {
  currentLocation: PropTypes.object,
  formConfig: PropTypes.object,
};

export default FormFooter;
