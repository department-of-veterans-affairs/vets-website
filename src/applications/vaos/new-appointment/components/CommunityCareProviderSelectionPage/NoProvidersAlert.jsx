import React from 'react';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

export default function NoProvidersAlert({ sortMethod, typeOfCareName }) {
  const headline = `We can’t find any ${typeOfCareName} providers close to you`;
  return (
    <InfoAlert
      status="info"
      headline={headline}
      className="vads-u-margin-top--3"
      backgroundOnly
    >
      <>
        <p>
          We can’t find any {typeOfCareName} providers within 60 miles from your{' '}
          {sortMethod ? 'current location' : 'home'}. To request this
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
      </>
    </InfoAlert>
  );
}
