import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { setSubmission } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import environment from '~/platform/utilities/environment';

const CLAIM_ID = '0803ClaimId';

export const setClaimIdInLocalStage = submission => {
  if (submission?.response?.id) {
    localStorage.setItem(CLAIM_ID, JSON.stringify(submission?.response?.id));
  }
};

export const getClaimIdFromLocalStage = () => {
  return JSON.parse(localStorage.getItem(CLAIM_ID));
};

function AlertBox() {
  return (
    <va-alert close-btn-aria-label="Close notification" status="into" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
  );
}

function ProcessList({ pdfUrl, trackingPrefix }) {
  return (
    <va-process-list uswds>
      <va-process-list-item>
        <div
          itemProp="itemListElement"
          className="confirmation-save-pdf-download-section screen-only custom-classname"
        >
          <h2>Download and save your form</h2>
          <p>
            Make sure that your completed form is saved as a PDF on your device.{' '}
            <span className="vads-u-display--inline-block">
              <va-link
                download
                filetype="PDF"
                href={pdfUrl}
                onClick={() =>
                  recordEvent({
                    event: `${trackingPrefix}confirmation-pdf-download`,
                  })
                }
                text="Download completed VA Form 22-0803"
              />
            </span>
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Gather relevant attachments">
        <div itemProp="itemListElement">
          <p>
            When you submit this form, you will need to attach the following
            documents:
          </p>
          <ul>
            <li>
              The receipt for the test fees, <strong>and</strong>
            </li>
            <li>A copy of your test results</li>
          </ul>
          <p>Gather those documents now.</p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Upload your form and attachments to QuickSubmit or mail them to your Regional Processing Office">
        <div itemProp="itemListElement">
          <p>
            Visit{' '}
            <va-link
              external
              text="QuickSubmit on AccessVA (opens in a new tab)"
              href="https://www.my.va.gov/EducationFileUploads/s/"
            />{' '}
            and upload your saved VA Form 22-0803 as well as your receipt and
            test results.
          </p>
          <p>
            If you would rather print and mail your form and attachments, the
            addresses for your region are listed below.
          </p>
        </div>
      </va-process-list-item>
    </va-process-list>
  );
}
ProcessList.propTypes = {
  pdfUrl: PropTypes.string,
  trackingPrefix: PropTypes.string,
};

function RegionalAccordion() {
  return (
    <va-accordion>
      <va-accordion-item header="Eastern region" id="easter_region">
        <p className="va-address-block">
          VA Regional Office
          <br />
          P.O. Box 4616
          <br />
          Buffalo, NY 1420-4616
          <br />
        </p>
        <p>
          <strong>This office serves the following states:</strong> Colorado,
          Connecticut, Delaware, District of Columbia, Illinois, Indiana, Iowa,
          Kansas, Kentucky, Maine, Maryland, Massachusetts, Michigan, Minnesota,
          Missouri, Montana, Nebraska, New Hampshire, New Jersey, New York,
          North Carolina, North Dakota, Ohio, Pennsylvania, Rhode Island, South
          Dakota, Tennessee, Vermont, Virginia, West Virginia, Wisconsin, and
          Wyoming.
        </p>
        <p>
          <strong>Additional locations served by this office:</strong> APO / FPO
          AA, Foreign Schools, and the U.S. Virgin Islands.
        </p>
      </va-accordion-item>
      <va-accordion-item header="Western region" id="western_region">
        <p className="va-address-block">
          VA Regional Office
          <br />
          P.O. Box 8888
          <br />
          Muskogee, OK 74402-8888
          <br />
        </p>
        <p>
          <strong>This office serves the following states:</strong> Alabama,
          Alaska, Arizona, Arkansas, California, Florida, Georgia, Hawaii,
          Idaho, Louisiana, Mississippi, New Mexico, Nevada, Oklahoma, Oregon,
          South Carolina, Texas, Utah, and Washington.
        </p>
        <p>
          <strong>Additional locations served by this office:</strong> APO / FPO
          AP, Guam, Philippines, American Samoa, and Mariana Islands.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
}

export const ConfirmationPage = props => {
  const [claimId, setClaimId] = useState(null);
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';
  const { route, router } = props;
  const dispatch = useDispatch();

  const resetSubmissionStatus = () => {
    const now = new Date().getTime();

    dispatch(setSubmission('status', false));
    dispatch(setSubmission('timestamp', now));
  };

  const goBack = e => {
    e.preventDefault();
    resetSubmissionStatus();
    router.push('/review-and-submit');
  };

  useEffect(
    () => {
      setClaimIdInLocalStage(submission);
      setClaimId(getClaimIdFromLocalStage());
    },
    [submission],
  );

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      devOnly={{
        showButtons: true,
      }}
    >
      <div data-testid="download-link">
        <AlertBox />
        <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
          To submit your form, follow the steps below
        </h2>
        <ProcessList
          pdfUrl={`${
            environment.API_URL
          }/v0/education_benefits_claims/download_pdf/${claimId}`}
          trackingPrefix={route?.formConfig?.trackingPrefix}
        />
        <va-alert status="warning" visible={!form.data.hasAppliedPreviously}>
          <h2 slot="headline">Additional form needed</h2>
          <p>
            You’ll need to apply for at least one of these VA education benefits
            and be found eligible in order for your reimbursement to be
            processed.
          </p>
          <p>
            <a href="/todo">
              Application for VA Education Benefits Form 22-1990 (opens in a new
              tab)
            </a>
            , <strong>or</strong>{' '}
            <a href="/todo">
              Dependents’ Application for VA Education Benefits Form 22-5490
              (opens in a new tab)
            </a>
          </p>
        </va-alert>
        <p>
          <va-button
            className="custom-classname"
            secondary
            text="Print this page"
            data-testid="print-page"
            onClick={() => window.print()}
          />
        </p>
        <p>
          <va-link
            onClick={goBack}
            class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
            data-testid="back-button"
            text="Back"
            href="#"
          />
        </p>
        <h2>Regional Processing Office mailing addresses</h2>
        <RegionalAccordion />
        <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
          What are my next steps?
        </h2>
        <p>
          After you successfully submit your form, we will review your
          documents. You should hear back within 30 days about your
          reimbursement.
        </p>
      </div>
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ConfirmationPage;
