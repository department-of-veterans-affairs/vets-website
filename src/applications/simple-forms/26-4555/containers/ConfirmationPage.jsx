import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission.timestamp;
  const { confirmationNumber, referenceNumber, status } =
    submission.response || {};

  let submissionAlertContent = (
    <p>
      After we review your application, we’ll contact you to validate your
      information. If you have any questions about your application, contact us
      at 877-827-3702, select the Specially Adapted Housing grant option, and
      give them your confirmation number {referenceNumber}.
    </p>
  );

  if (status === 'REJECTED') {
    submissionAlertContent = (
      <p>
        We received your application, but there was a problem. For more
        information, contact us at 877-827-3702, select the Specially Adapted
        Housing grant option, and give them your confirmation number{' '}
        {referenceNumber}.
      </p>
    );
  } else if (status === 'DUPLICATE') {
    submissionAlertContent = (
      <p>
        We received your application, but we already have an existing housing
        grant application from you on file. We’re still processing your existing
        application. If you have any questions, contact us at 877-827-3702,
        select the Specially Adapted Housing grant option.
      </p>
    );
  }

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert
        title={`Your form submission was succesful${
          isValid(submitDate) ? ` on ${format(submitDate, 'MMMM d, yyyy')}` : ''
        }`}
        content={submissionAlertContent}
        actions={<></>}
      />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.HowToContact
        content={
          <>
            <p>
              Call us at <va-telephone contact="8008773702" /> (
              <va-telephone tty="true" contact={CONTACTS[711]} />) and select
              the specially adapted housing grant option. We’re here Monday
              through Friday, from 8:00 a.m. to 6:00 p.m. ET.
            </p>
            <p>
              Or you can ask us a question online through Ask VA. Select the
              category and topic for the VA benefit this form is related to.
            </p>
            <p>
              <va-link
                href="https://ask.va.gov/"
                text="Contact us online through Ask VA"
              />
            </p>
          </>
        }
      />
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
      response: {
        confirmationNumber: PropTypes.string,
        referenceNumber: PropTypes.string,
        status: PropTypes.string,
      },
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
