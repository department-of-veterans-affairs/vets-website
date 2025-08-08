import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

export const MissingEmailAlert = ({ emailAddress }) => {
  if (!emailAddress) {
    return (
      <div data-testid="missing-email-info-alert">
        <VaAlert status="info" visible>
          <h2 slot="headline">Add your email to get delivery updates</h2>
          <p>
            Your email address isn’t on file. So you won’t get an email update
            when your documents are available online. Add your email address to
            your VA.gov profile to get these updates.
          </p>
        </VaAlert>
      </div>
    );
  }

  return null;
};

MissingEmailAlert.propTypes = {
  emailAddress: PropTypes.string,
};
