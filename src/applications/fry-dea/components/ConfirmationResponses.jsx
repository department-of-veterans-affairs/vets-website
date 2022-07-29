import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import GetFormHelp from './GetFormHelp';

export function UnderReview(response, name) {
  return (
    <>
      <div>
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h2 id="track-your-status-on-mobile" slot="headline">
            We’ve received your application
          </h2>
          <div>
            <p className="vads-u-margin-y--0">
              Your application requires additional review. Once we have reviewed
              your application, we will reach out to notify you about next
              steps.
            </p>
          </div>
        </va-alert>
        <div className="inset">
          <h4>Application for VA education benefits (Form 22-5490)</h4>
          {name ? (
            <p>
              For {name.first} {name.middle} {name.last} {name.suffix}
            </p>
          ) : null}

          {response ? (
            <>
              <ul className="claim-list">
                <li>
                  <strong>Date received</strong>
                  <br />
                  <span>{format(new Date(), 'MMM d, yyyy')}</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => window.print()}
                className="usa-button vads-u-margin-top--3 vads-u-width--auto"
              >
                Print this page
              </button>
            </>
          ) : null}
        </div>
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
          <li>We will review your eligibility for the Fry Scholarship.</li>
          <li>We may reach out with questions about your application.</li>
          <li>There is no further action required by you at this time.</li>
        </ul>
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What can I do while I wait?</h2>
        <ul>
          {/* ▪	Learn more about VA benefits and programs through the Building Your Future with the GI Bill Series. */}
          {/* ▪	Measure your interests and skill levels and help figure out your career path with CareerScope®. */}

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
      <div className="help-footer-box">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </>
  );
}

UnderReview.prototype = {
  response: PropTypes.object || PropTypes.bool,
  name: PropTypes.object,
};
