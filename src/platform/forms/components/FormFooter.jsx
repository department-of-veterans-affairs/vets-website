import React from 'react';
import PropTypes from 'prop-types';

export default function FormFooter({ formConfig, currentLocation }) {
  const GetFormHelp = formConfig?.getHelp;
  const trimmedPathname = (currentLocation?.pathname || '').replace(/\/$/, '');
  const isConfirmationPage = trimmedPathname.endsWith('confirmation');

  return isConfirmationPage || !GetFormHelp ? null : (
    <div className="row vads-u-margin-bottom--2">
      <div className="usa-width-two-thirds medium-8 columns">
        <va-need-help>
          <div slot="content">
            <GetFormHelp formConfig={formConfig} />
          </div>
        </va-need-help>
      </div>
    </div>
  );
}

FormFooter.propTypes = {
  currentLocation: PropTypes.object,
  formConfig: PropTypes.object,
};
