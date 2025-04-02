import { focusElement } from 'platform/utilities/ui';
import React, { useEffect, useRef } from 'react';
import BreadCrumbs from '../components/BreadCrumbs';
import NeedHelpFooter from '../components/NeedHelpFooter';
import manifest from '../manifest.json';

const ResponseSentPage = () => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        focusElement(alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div className="row vads-u-padding-x--1">
      <BreadCrumbs currentLocation="/response-sent" />
      <div className="usa-width-two-thirds medium-8 columns vads-u-padding--0">
        <h1 className="vads-u-font-family--serif vads-u-margin-bottom--5">
          Response sent
        </h1>
        <va-alert status="success" visible ref={alertRef} slim>
          <p className="vads-u-margin-y--0">
            Your response was submitted successfully.
          </p>
        </va-alert>

        <p className="vads-u-margin-bottom--3 vads-u-margin-top--3">
          Thank you for sending a response. Your question has now been reopened.
        </p>
        <p className="vads-u-margin-bottom--3">
          You should receive a reply within 7 business days. If we need more
          information to answer your question, we’ll contact you.
        </p>
        <div className="vads-u-margin-bottom--7 vads-u-margin-top--6">
          <va-link-action
            href={`${manifest.rootUrl}`}
            text="Return to Ask VA Inbox"
            type="secondary"
          />
        </div>
        <NeedHelpFooter />
      </div>
    </div>
  );
};

export default ResponseSentPage;
