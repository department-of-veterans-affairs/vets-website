import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

const BuildPage = ({ title, goToPath }) => {
  const headerRef = useRef(null);

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
    returnToContactInfo: () => {
      goToPath('/contact-information');
    },
  };

  return (
    <form className="va-profile-wrapper" onSubmit={handlers.onSubmit}>
      <h1 ref={headerRef}>{title}</h1>
      <p>This page has not been implemented</p>
      <va-button onClick={handlers.returnToContactInfo} text="Return" uswds />
    </form>
  );
};

BuildPage.propTypes = {
  field: PropTypes.string,
  goToPath: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
};

export const EditHomePhone = props => (
  <BuildPage {...props} field="HOME_PHONE" id="home-phone" />
);

export const EditMobilePhone = props => (
  <BuildPage {...props} field="MOBILE_PHONE" id="mobile-phone" />
);

export const EditEmail = props => (
  <BuildPage {...props} field="EMAIL" id="email" />
);

export const EditAddress = props => (
  <BuildPage {...props} field="MAILING_ADDRESS" id="address" />
);
