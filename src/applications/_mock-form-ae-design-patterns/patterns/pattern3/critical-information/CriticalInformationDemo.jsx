import React from 'react';

const ServiceListDemo = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <h1>Critical Information Demo</h1>
      <p>This is a demo of the Critical Information component pattern.</p>

      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-critical-information
            link="https://www.va.gov/disability"
            text="Submit documents by July 12, 2025"
          />
        </div>
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-service-list-item
            serviceDetails={{
              'Approved on': 'May 5, 2011',
              Program: 'Post-9/11 GI Bill',
              Eligibility: '70%',
            }}
            icon="school"
            serviceName="Education"
            serviceLink="https://google.com"
            serviceStatus="Eligible"
            action={{
              href: 'https://www.va.gov/education',
              text: 'Verify income',
            }}
            optionalLink={{
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
      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-service-list-item
            icon="home"
            service-name="No action variant"
            service-link="https://google.com"
            service-status="Eligible"
            optional-link={JSON.stringify({
              href: 'https://www.va.gov',
              text: 'VA.gov - optional link',
            })}
            service-details={JSON.stringify({
              'Single Item': 'Something cool here',
            })}
          />
        </div>
      </div>
      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <va-service-list-item
            icon="handshake"
            service-name="No optional link variant"
            service-link="https://google.com"
            service-status="Eligible"
            service-details={JSON.stringify({
              'Single Item': 'Something cool here',
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceListDemo;
