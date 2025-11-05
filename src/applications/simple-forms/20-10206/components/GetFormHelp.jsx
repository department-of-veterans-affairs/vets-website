import React from 'react';

const GetFormHelp = () => (
  <>
    <p className="help-talk">
      <strong>If you have trouble using this online form</strong>, call us at{' '}
      <va-telephone contact="8006982411" /> (<va-telephone tty contact="711" />
      ). We’re here 24/7.
    </p>
    <p>
      <strong>
        If you need help gathering your information or filling out your form
      </strong>
      , contact a local Veterans Service Organization (VSO).
    </p>
    <va-link
      text="Find a local
        Veterans Service Organization"
      label="Find a local
        Veterans Service Organization"
      href="/get-help-from-accredited-representative"
    />
    <div className="usa-grid usa-grid-full vads-u-margin-top--4">
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

export default GetFormHelp;
