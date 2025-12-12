import React from 'react';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

export default () => {
  const supportLinks = [
    { text: 'Sign-in errors', url: '/resources/signing-in-to-vagov/' },
    {
      text: 'Verifying your identity',
      url: '/resources/verifying-your-identity-on-vagov/',
    },
    {
      text: 'Deleting your account',
      url: '/resources/can-i-delete-my-logingov-or-idme-account',
    },
    {
      text: 'Common issues with ID.me or Login.gov',
      url: '/resources/support-for-common-logingov-and-idme-issues/',
    },
  ];
  return (
    <div className="row">
      <div className="columns print-full-width sign-in-wrapper">
        <div className="help-info">
          <h2 className="vads-u-margin-top--0">Help and support</h2>

          <div>
            <div>
              <div role="list" className="vads-u-padding-bottom--3">
                {supportLinks.map((link, idx) => (
                  <li className="vads-u-margin--0" key={idx}>
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </div>
            </div>
          </div>
          <p>
            <SubmitSignInForm startSentence />
          </p>
        </div>
      </div>
    </div>
  );
};
