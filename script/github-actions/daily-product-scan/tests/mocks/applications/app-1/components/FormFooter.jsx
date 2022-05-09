/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { shouldHideFormFooter } from '../selectors';

function FormFooter({ formConfig, currentLocation, isHidden }) {
  const GetFormHelp = formConfig.getHelp;
  const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
  const isConfirmationPage = trimmedPathname.endsWith('confirmation');

  if (isConfirmationPage) {
    return null;
  }

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="help-footer-box">
          {!isHidden && (
            <>
              <h2 className="help-heading">Need help?</h2>
              <GetFormHelp />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isHidden: shouldHideFormFooter(state),
});

export default connect(mapStateToProps)(FormFooter);

export { FormFooter };
