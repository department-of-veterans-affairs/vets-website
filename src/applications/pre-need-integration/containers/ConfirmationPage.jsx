import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const HowToContactContent = () => (
  <>
    <p>
      Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
      <va-telephone tty="true" contact={CONTACTS[711]} />) We’re here Monday
      through Friday, 8:00 a.m. to 7:30 p.m. ET, and Saturday 9:00 a.m. to 5:30
      p.m E.T.
    </p>
    <p>
      Or, check our resources and support section for answers to common
      questions.
    </p>
    <p>
      <va-link
        external
        href="https://ask.va.gov/"
        text="Go to resources and support section on VA.gov"
      />
    </p>
  </>
);

const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const { formConfig } = props?.route;
  const submitDate = submission?.timestamp || submission?.submittedAt;
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  useEffect(() => {
    scrollToTop('topScrollElement');
    focusElement('.confirmation-page-title');
  }, []);

  return (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={formConfig}
      pdfUrl={
        submission?.response?.pdfUrl ||
        'https://www.va.gov/vaforms/va/pdf/VA%20Form%2040-10007.pdf'
      }
    >
      <ConfirmationView.SubmissionAlert
        title="You've submitted your application"
        content="You'll receive a confirmation email shortly. We'll let you know by mail or phone if we need more details."
        actions={null}
      />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList
        item1Header="We’ll review your application"
        item1Content="If we need more information about your information, we’ll contact you."
        item1Actions={null}
        item2Header="We’ll reach a decision"
        item2Content="You’ll receive a pre-need decision letter notifying you of your eligibility for burial in a VA national cemetery."
      />
      <h3>If you need to submit supporting documents</h3>
      <p className="mail-or-fax-message">
        You can mail your supporting documents to this address:
      </p>
      <p className="va-address-block">
        NCA FP Evidence Intake Center <br />
        P.O. Box 5237
        <br />
        Janesville, WI 53547
        <br />
      </p>
      <p>
        Or you can fax your supporting documents to{' '}
        <va-telephone contact="8558408299" />.
      </p>
      <ConfirmationView.HowToContact content={<HowToContactContent />} />
      <ConfirmationView.GoBackLink />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
export { ConfirmationPage };
