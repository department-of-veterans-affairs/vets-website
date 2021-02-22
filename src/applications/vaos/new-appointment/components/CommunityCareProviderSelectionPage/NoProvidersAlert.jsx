import React from 'react';

export default function NoProvidersAlert({ sortMethod, typeOfCareName }) {
  return (
    <div className="vads-u-margin-top--2 vaos-appts__block-label vads-u-background-color--primary-alt-lightest vads-u-padding--2p5">
      <h3 className="vads-u-margin-top--0">
        We can't find any {typeOfCareName} providers close to you
      </h3>
      <p>
        We can’t find any providers within 60 miles from your{' '}
        {sortMethod ? 'current location' : 'home'}. To request this appointment,
        you can: <br />
      </p>
      <ul>
        <li>
          Call your VA or community care facility.{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            Find your health facility’s phone number
          </a>
          , <strong>or</strong>
        </li>
        <li>
          Continue your request without choosing a provider. We’ll contact you
          about about a provider.
        </li>
      </ul>
    </div>
  );
}
