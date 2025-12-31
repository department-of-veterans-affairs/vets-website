import React from 'react';

export default function() {
  return (
    <>
      <p className="help-talk">
        <strong>If you have trouble using this tool,</strong> call us at{' '}
        <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ).
        <br />
        We&rsquo;re here 24/7.
      </p>
      <p className="help-talk">
        <strong>
          If you need help gathering your information to use this tool,
        </strong>{' '}
        <br />
        contact a local Veterans Service Organization (VSO).
      </p>
      <va-link
        href="https://va.gov/vso/"
        text="Find a local Veterans Service Organization"
      />
      <div className="usa-grid usa-grid-full vads-u-margin-top--2">
        <div className="last-updated vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
          <div className="vads-u-display--flex above-footer-elements-container">
            <div className="vads-u-flex--auto">
              <span className="vads-u-text-align--justify">
                <p />
              </span>
            </div>
            <div className="vads-u-flex--1 vads-u-text-align--right">
              <span className="vads-u-text-align--right">
                <va-button
                  type="button"
                  id="mdFormButton"
                  text="Feedback"
                  class="vads-u-padding--0 vads-u-margin-right--0 vads-u-background-color--white hydrated"
                  secondary=""
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
