import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import GetFormHelp from './GetFormHelp';

const NeedHelpComponent = () => {
  return (
    <div className="help-footer-box">
      <h2 className="help-heading">Need help?</h2>
      <GetFormHelp />
    </div>
  );
};

const ConfirmationReceiptBox = ({ name }) => {
  return (
    <div className="inset vads-u-margin-top--3 vads-u-padding-y--3">
      <h3 className="vads-u-margin-top--0p5">
        Application for VA education benefits (Form 22-5490)
      </h3>
      {name ? (
        <p>
          For {name.first} {name.middle} {name.last} {name.suffix}
        </p>
      ) : null}

      {/* {response ? ( */}
      {/*  <> */}
      <dl>
        <dt>
          <strong>Date received</strong>
        </dt>
        <dd>{format(new Date(), 'MMMM d, yyyy')}</dd>
      </dl>

      <button
        type="button"
        onClick={() => window.print()}
        className="usa-button vads-u-margin-bottom--0"
      >
        Print this page
      </button>
      {/*  </> */}
      {/* ) : null} */}
    </div>
  );
};

ConfirmationReceiptBox.propTypes = {
  name: PropTypes.object,
};

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
        <ConfirmationReceiptBox name={name} />
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
            <hr className="custom-fry-hr" />
            If more than a month has passed since you gave us your application
            and you haven’t heard back, please don’t apply again. Call our
            toll-free Education Call Center at{' '}
            <va-telephone contact="8884424551" /> or{' '}
            <va-telephone contact="9187815678" international />
            if you are outside the U.S.
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
          <li>
            If you need to submit documentation to VA, such as service records,
            please send this through our{' '}
            <a target="_blank" href="https://ask.va.gov/ " rel="noreferrer">
              Ask VA feature.
            </a>
          </li>
          <li>
            <a target="_blank" href="/profile">
              Review and/or update your direct deposit information on your{' '}
              VA.gov profile.
            </a>
          </li>
          <li>
            <a target="_blank" href="/education/gi-bill-comparison-tool/">
              Use our GI Bill Comparison Tool to help you decide which education
              program and school is best for you.
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://blogs.va.gov/VAntage/78073/new-guide-series-provides-gi-bill-benefits-information/"
              rel="noreferrer"
            >
              Learn more about VA benefits and programs through the Building
              Your Future with the GI Bill Series.
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.benefits.va.gov/gibill/careerscope.asp"
              rel="noreferrer"
            >
              Measure your interests and skill levels and help figure out your
              career path with CareerScope®.
            </a>
          </li>
        </ul>
      </div>
      <NeedHelpComponent />
    </>
  );
}

UnderReview.prototype = {
  name: PropTypes.object,
  response: PropTypes.object || PropTypes.bool,
};

export function Approved(name) {
  return (
    <>
      <div>
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h2 slot="headline">
            Congratulations, you’ve been approved for Survivors’ and Dependents’
            Educational Assistance
          </h2>
          <div className="vads-u-margin-top--1p5">
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
              We reviewed your application and have determined that you’re
              entitled to educational benefits under Survivors’ and Dependents’
              Educational Assistance (DEA, Chapter 35). Your decision letter is
              now available. A physical copy will also be mailed to your mailing
              address.
            </p>
            <a
              href="https://www.va.gov"
              rel="noopener noreferrer"
              target="_blank"
            >
              <va-icon
                //  className="fa fa-download vads-u-margin-right--1"
                icon="file_download"
                size={3}
              />
              <span className="vads-u-margin-left--0p25 vads-u-font-weight--bold">
                Download your decision letter (PDF)
              </span>
            </a>
            .
          </div>
        </va-alert>
        <ConfirmationReceiptBox name={name} />
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What happens next?</h2>
        <ul>
          <li>
            Download a copy of your decision letter. This can also be found at{' '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="/education/download-letters/letters/"
            >
              Download your VA education letters
            </a>
            .
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="/education/gi-bill-comparison-tool/"
            >
              Use our GI Bill Comparison Tool to help you decide which education
              program and school are best for you
            </a>
            .
          </li>
          <li>
            Once you’ve selected a school or program, you may bring your
            decision letter to your School Certifying Official to provide proof
            of eligibility.
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="/?next=%2Fprofile"
            >
              Review and/or update your direct deposit information on your
              VA.gov profile
            </a>
            .
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://benefits.va.gov/GIBILL/docs/GIBguideseries/ChooseYourEducationPathway.pdf"
            >
              Learn more about VA benefits and programs through the Building
              Your Future with the GI Bill Series
            </a>
            .
          </li>
        </ul>
      </div>
      <div className="vads-u-margin-bottom--4">
        <va-additional-info trigger="What is a decision letter?">
          <div>
            A decision letter is an official document from the U.S. Department
            of Veterans Affairs that details your GI Bill benefit status. If you
            are approved to receive benefits, you may provide this official
            document to your educational institution to prove your eligibility
            status.
          </div>
        </va-additional-info>
      </div>
      <NeedHelpComponent />
    </>
  );
}

Approved.prototype = {
  name: PropTypes.object,
  response: PropTypes.object || PropTypes.bool,
};

export function NotEligible(name) {
  return (
    <>
      <div>
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h2 id="track-your-status-on-mobile" slot="headline">
            You’re not eligible for this benefit
          </h2>
          <div className="vads-u-margin-top--1p5">
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
              Unfortunately, based on the information you provided and
              Department of Defense records, we have determined you’re not
              eligible for the Survivors’ and Dependents’ Educational Assistance
              (DEA, Chapter 35) benefit at this time. You can now download your
              decision letter, which explains why you're not eligible. We'll
              also mail a physical copy to your mailing address.
            </p>
            <a
              href="https://www.va.gov"
              rel="noopener noreferrer"
              target="_blank"
            >
              <va-icon
                //  className="fa fa-download vads-u-margin-right--1"
                icon="file_download"
                size={3}
              />
              <span className="vads-u-margin-left--0p25 vads-u-font-weight--bold">
                Download your decision letter (PDF)
              </span>
            </a>
            .
          </div>
        </va-alert>
        <ConfirmationReceiptBox name={name} />
      </div>
      <div className="vads-u-margin-bottom--4">
        <h2>What happens next?</h2>
        <ul>
          <li>
            Download a copy of your decision letter. This can also be found at{' '}
            <a
              href="/education/download-letters/letters/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Download your VA education letters
            </a>
            .
          </li>
          <li>We don’t require further action required by you at this time.</li>
        </ul>
      </div>
      <NeedHelpComponent />
    </>
  );
}

NotEligible.prototype = {
  name: PropTypes.object,
  response: PropTypes.object || PropTypes.bool,
};

export function LoadingResults() {
  return (
    <div className="vads-u-margin-y--5">
      <va-loading-indicator
        label="Loading"
        message="Loading your results"
        set-focus
      />
    </div>
  );
}
