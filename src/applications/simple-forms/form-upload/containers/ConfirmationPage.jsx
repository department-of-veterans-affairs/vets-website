import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

let mockData;
if (!environment.isProduction() && !environment.isStaging()) {
  mockData = require('../tests/e2e/fixtures/data/maximal-test.json');
  mockData = mockData?.data;
}

const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { formConfig } = props.route;
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={formConfig}
      devOnly={{
        showButtons: true,
        mockData,
      }}
    >
      <ConfirmationView.SubmissionAlert />
      <h2>Save a copy of your form</h2>
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList />
      <ConfirmationView.HowToContact
        content={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <>
            <p>
              Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
              <va-telephone tty="true" contact={CONTACTS[711]} />) We’re here
              Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
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
    data: PropTypes.shape({
      veteran: PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          middle: PropTypes.string,
          last: PropTypes.string,
        }).isRequired,
      }),
    }),
    submission: PropTypes.shape({
      response: PropTypes.shape({
        confirmationNumber: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired,
  }),
};

export default ConfirmationPage;
