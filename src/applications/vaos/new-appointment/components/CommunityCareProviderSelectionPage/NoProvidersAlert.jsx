import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function NoProvidersAlert({ sortMethod, typeOfCareName }) {
  const headline = `We can’t find any ${typeOfCareName} providers close to you`;
  return (
    <AlertBox
      status="info"
      headline={headline}
      className="vads-u-margin-top--3"
      content={
        <>
          <p>
            We can’t find providers within 60 miles from your{' '}
            {sortMethod ? 'current location' : 'home'}. To request this
            appointment, you can: <br />
          </p>
          <ul>
            <li>
              Call your VA or community care facility.{' '}
              <a
                href="/find-locations"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find your health facility’s phone number
              </a>
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
