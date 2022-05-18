import React from 'react';
import PropTypes from 'prop-types';

export default function UnderReview({ user, dateReceived }) {
  const { fullName, confirmationNumber } = user;
  return (
    <>
      <div className="vads-u-margin-bottom--6">
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h3 slot="headline">We’ve received your application</h3>
          <div>
            Your application requires additional review. Once we have reviewed
            your application, we will reach out to notify you about next steps.
          </div>
        </va-alert>
      </div>
      <div className="vads-u-margin-bottom--6">
        <va-alert
          background-only
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <div>
            <h3
              slot="headline"
              className="vads-u-margin-top--2 vads-u-margin-bottom--4"
            >
              Application for VA education benefits (Form 22-1990e)
            </h3>
            For {fullName}
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-y--4">
              <strong>Confirmation number</strong>
              {confirmationNumber}
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--column">
              <strong>Date received</strong>
              {dateReceived}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="usa-button vads-u-margin-top--3 vads-u-width--auto"
            >
              Print this page
            </button>
          </div>
        </va-alert>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>When will I hear back about my application?</h2>
        <va-alert
          background-only
          close-btn-aria-label="Close notification"
          status="continue"
          visible
        >
          <div>
            <h2 className="vads-u-margin-y--0">In 1 month</h2>
            <hr className="meb-hr" />
            If more than a month has passed since you gave us your application
            and you haven’t heard back, please don’t apply again. Call our
            toll-free Education Call Center at{' '}
            <a href="tel:888-442-4551">1-888-442-4551</a> or{' '}
            <a href="tel:001-918-781-5678">001-918-781-5678</a> if you are
            outside the U.S.
          </div>
        </va-alert>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What happens next?</h2>
        <ul>
          <li>
            We will review your eligibility for the Transfer of Entitlement
            Post-9/11 GI Bill.
          </li>
          <li>We may reach out with questions about your application.</li>
          <li>
            You will be notified if you are eligible for VA education benefits.
          </li>
          <li>There is no further action required by you at this time.</li>
        </ul>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What can I do while I wait?</h2>
        <ul>
          <li>
            If you need to submit documentation to VA, such as service records,
            please send this through our{' '}
            <a href="https://nam04.safelinks.protection.outlook.com/?url=https%3A%2F%2Fask.va.gov%2F&data=04%7C01%7Cherbert.anagho%40accenturefederal.com%7C5b0be35e33a2487d4a0c08d9ecb991bc%7C0ee6c63b4eab4748b74ad1dc22fc1a24%7C0%7C0%7C637801104030719343%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&sdata=QuGxWs9osAHjaGwInFjQO5cwEQ%2BK84u9J3XH2QcwZNk%3D&reserved=0">
              Ask VA feature
            </a>
            .
          </li>
          <li>
            Review and/or update your direct deposit information on your{' '}
            <a href="/profile">VA.gov profile</a> .
          </li>
          <li>
            Use our{' '}
            <a href="/education/gi-bill-comparison-tool/">
              GI Bill Comparison Tool
            </a>{' '}
            to help you decide which education program and school is best for
            you.
          </li>
          <li>
            Learn more about VA benefits and programs through the{' '}
            <a href="https://blogs.va.gov/VAntage/78073/new-guide-series-provides-gi-bill-benefits-information/">
              Building Your Future with the GI Bill Series
            </a>
            .
          </li>
          <li>
            Measure your interests and skill levels and help figure out your
            career path with{' '}
            <a href="https://www.benefits.va.gov/gibill/careerscope.asp">
              CareerScope®
            </a>
            .
          </li>
        </ul>
      </div>
    </>
  );
}

UnderReview.prototype = {
  dateReceived: PropTypes.string,
  user: PropTypes.object,
};
