import React from 'react';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

export default function LoadProvidersErrorAlert() {
  const headline = `We can’t load provider information`;
  return (
    <div id="providerSelectionFailed">
      <InfoAlert
        status="error"
        headline={headline}
        className="vads-u-margin-top--3"
      >
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
            Continue your request without choosing a provider. We’ll contact you
            about about a provider.
          </li>
        </ul>
      </InfoAlert>
    </div>
  );
}
