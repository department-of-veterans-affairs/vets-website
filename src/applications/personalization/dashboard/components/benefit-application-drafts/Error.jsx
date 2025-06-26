import React from 'react';
import { Toggler } from '~/platform/utilities/feature-toggles';

const Error = () => {
  const content = (
    <>
      <h3 slot="headline" className="vads-u-margin-top--0">
        We can’t access your benefit applications and forms right now
      </h3>
      <p className="vads-u-margin-bottom--0">
        We’re sorry. We’re working to fix this problem. Check back later.
      </p>
    </>
  );

  const redesignContent = (
    <h3
      slot="headline"
      className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans vads-u-line-height--6 vads-u-margin-bottom--0"
    >
      We can’t show your forms and applications right now. Refresh this page or
      try again later.
    </h3>
  );

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid="benefit-application-error"
    >
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Enabled>
          <va-alert status="warning">{redesignContent}</va-alert>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <va-alert status="warning">{content}</va-alert>
        </Toggler.Disabled>
      </Toggler>
    </div>
  );
};

export default Error;
