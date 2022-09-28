import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { shouldHideFormFooter } from '../utils/selectors';

const FormFooter = ({ formConfig, currentLocation, isHidden }) => {
  const GetHelp = formConfig.getHelp;
  const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
  const isConfirmationPage = trimmedPathname.endsWith('confirmation');

  return !isConfirmationPage && !isHidden ? (
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
  isHidden: PropTypes.bool,
};

const mapStateToProps = state => ({
  isHidden: shouldHideFormFooter(state),
});

export { FormFooter };
export default connect(mapStateToProps)(FormFooter);
