import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function LoadProvidersErrorAlert() {
  const headline = `We can’t load provider information`;
  return (
    <AlertBox
      status="error"
      headline={headline}
      className="vads-u-margin-top--3"
      content={
        <>
          <p>
            We’re sorry. Something went wrong on our end. To request this
            appointment, you can: <br />
          </p>
          <ul>
            <li>
              Call your VA or community care facility.{' '}
              <NewTabAnchor href="/find-locations">
                Find your health facility’s phone number
              </NewTabAnchor>
              , <strong>or</strong>
            </li>
            <li>
              Continue your request without choosing a provider. We’ll contact
              you about about a provider.
            </li>
          </ul>
        </>
      }
    />
  );
}
