import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

export const MissingEmailAlert = ({ emailAddress }) => {
  if (!emailAddress) {
    return (
      <VaAlert role="alert" status="info" visible>
        <h2 slot="headline">
          Add your email to get notified when documents are ready
        </h2>
        <p className="vads-u-margin-y--0">
          You don’t have an email address in your VA profile. If you add one,
          we’ll email you when your documents are ready.
        </p>
      </VaAlert>
    );
  }

  return null;
};

MissingEmailAlert.propTypes = {
  emailAddress: PropTypes.string,
};
