import React from 'react';

const CriticalInformationDemo = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <h1>Critical Information Demo</h1>
      <p>This is a demo of the Critical Information component pattern.</p>

      <div className="vads-l-column vads-u-padding-bottom--4">
        <h3>Critical Information component only</h3>
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-critical-information
            link="https://www.va.gov/disability"
            text="Submit documents by July 12, 2025"
          />
        </div>
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-critical-information
            link="https://www.va.gov/disability"
            text="Required action: Submit payment documents by September 12, 2025"
          />
        </div>
      </div>

      <div className="vads-l-row">
        <h3>Service list items using Critical Information component</h3>
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-service-list-item
            service-details={JSON.stringify({
              'Approved on': 'May 5, 2011',
              Program: 'Post-9/11 GI Bill',
              Eligibility: '70%',
            })}
            icon="school"
            service-name="Education"
            service-link="https://google.com"
            service-status="Eligible"
            action={JSON.stringify({
              href: 'https://www.va.gov/education',
              text: 'Verify income',
            })}
            optional-link={{
              href: 'https://www.va.gov',
              text: 'VA.gov - optional link',
            }}
          />
        </div>
      </div>
      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-service-list-item
            service-details={JSON.stringify({
              'Single Item': 'Something cool here',
            })}
            icon="shield"
            service-name="Some really long service name is here"
            service-link="https://google.com"
            service-status="Eligible"
            action={JSON.stringify({
              href: 'https://www.va.gov/education',
              text: 'Verify income',
            })}
            optional-link={JSON.stringify({
              href: 'https://www.va.gov',
              text: 'VA.gov - optional link',
            })}
          />
        </div>
      </div>
      <div className="vads-l-column">
        <h3>Card using Critical Information component</h3>
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-card class="claim-list-item">
            <h3 className="claim-list-item-header vads-u-margin-bottom--2">
              <div>
                <span className="usa-label">IN PROGRESS</span>
                Claim for compensation
                <span className="vads-u-margin-top--0p5 submitted-on">
                  Received on June 15, 2023
                </span>
              </div>
            </h3>
            <va-critical-information
              link="https://www.va.gov/claim-or-appeal-status/"
              text="We requested more information from you. Submit by May 21, 2025."
            />
            <ul className="details">
              <li className="vads-u-margin--0">
                <va-icon
                  icon="mail"
                  size={3}
                  class="vads-u-margin-right--1"
                  aria-hidden="true"
                />
                We sent you a development letter
              </li>
              <li className="vads-u-margin--0">
                Step 3 of 8: Evidence gathering
              </li>
              <li>Moved to this step on June 18, 2023</li>
            </ul>
            <va-link
              href="https://www.va.gov/claim-or-appeal-status/"
              text="Details"
              active="true"
            />
          </va-card>
        </div>
      </div>
    </div>
  );
};

export default CriticalInformationDemo;
