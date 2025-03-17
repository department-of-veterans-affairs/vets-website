import React from 'react';
import { VaServiceListItem } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ServiceListDemo = () => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--2">
      <h1>Service List Demo</h1>
      <p>This is a demo of the Service List Item component pattern.</p>

      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--6 vads-l-col--12">
          <VaServiceListItem
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
