import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { shouldHideFormFooter } from '../../utils/selectors';

const FormFooter = ({ formConfig, currentLocation }) => {
  const GetHelp = formConfig.getHelp;
  const hideFooter = useSelector(shouldHideFormFooter);
  const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
  const isConfirmationPage = trimmedPathname.endsWith('confirmation');

  return !isConfirmationPage && !hideFooter ? (
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
