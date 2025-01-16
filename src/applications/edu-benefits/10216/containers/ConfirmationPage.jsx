import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import Alert from '../components/Alert';
import GetFormHelp from '../components/GetFormHelp';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;

  const childContent = (
    <div>
      {!props?.isAccredited && <Alert />}
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2">
        To submit your forms, follow the steps below
      </h2>
      <va-process-list>
        <va-process-list-item header="Download and save both forms">
          <p>
            First, complete and save your VA Form 22-10216 as a PDF. If you
            didn’t do that on on the previous page, go back and do that now.
            <div className="vads-u-margin-y--2">
              <va-link
                download
                filetype="PDF"
                href=""
                // fileName={''}
                text="Download VA Form 22-10216"
              />
            </div>
            Then, navigate to{' '}
            <va-link
              external
              text="VA Form 22-10215"
              href="/education/apply-for-education-benefits/application/10215"
            />{' '}
            to fill it out. Once completed, save it as a PDF on your device.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Upload the forms to the VA education portal">
          <p>
            Visit the{' '}
            <va-link
              external
              text="VA Education File Upload Portal"
              href="https://www.my.va.gov/EducationFileUploads/s/"
            />
            , and upload both your saved VA Form 22-10216 and VA Form 22-10215.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Submit your forms">
          <p>Once uploaded, click submit to finalize your request.</p>
        </va-process-list-item>
      </va-process-list>
      <va-button
        uswds
        back
        class="screen-only vads-u-margin-top--1"
        onClick={() => {
          props?.router.goBack();
        }}
      />
      <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
        What are my next steps?
      </h2>
      <p>
        After submitting your exemption request, we will review your submission
        within 7-10 business days. Once we complete the review, we will email
        your school a letter with the decision. If we accept your request, we
        will include a copy of WEAMS form 1998 as confirmation in the letter. If
        we deny your request, we will explain the reason for rejection in the
        letter and provide further instructions for resubmission or additional
        steps.
      </p>
      <va-link-action
        href="/education/apply-for-education-benefits/application/10215"
        text="Go to VA Form 22-10215 now"
        class="vads-u-margin-top--1p5 vads-u-margin-bottom--2"
      />
    </div>
  );

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
      pdfUrl={submission?.response?.pdfUrl}
    >
      {childContent}
      <ConfirmationView.NeedHelp content={<GetFormHelp />} />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  isAccredited: PropTypes.bool,
  name: PropTypes.string,
  route: PropTypes.object,
  router: PropTypes.shape({
    goBack: PropTypes.func,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
