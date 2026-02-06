import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import NextStepsSection from '../components/NextStepsSection';
import SupplementaryFormsSection from '../components/SupplementaryFormsSection';

let mockData;
if (!environment.isProduction() && !environment.isStaging()) {
  mockData = require('../tests/e2e/fixtures/data/test-data.json');
  mockData = mockData?.data;
}

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { formConfig } = props.route;
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber =
    submission.response?.attributes?.confirmationNumber;
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
      <ConfirmationView.SubmissionAlert
        content={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <>
            <p>Your submission is in progress.</p>
            <p>
              It can take up to 10 days for us to receive your form.
              {confirmationNumber && (
                <>
                  {' '}
                  Your confirmation number is{' '}
                  <strong>{confirmationNumber}</strong>.
                </>
              )}
            </p>
          </>
        }
      />

      <h2>Save a copy of your form</h2>
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <NextStepsSection />
      <SupplementaryFormsSection formData={form.data} />
      <ConfirmationView.WhatsNextProcessList
        item1Content={
          <>
            <p>
              This can take up to 10 days. When we receive your form, we’ll
              update the status on My VA.
            </p>
          </>
        }
      />
      <section>
        <h2>When to tell us if your information changes</h2>
        <p>
          If you receive Veterans Pension benefits, you’ll need to tell us if
          certain information changes. Tell us right away if any of these are
          true for you:
        </p>
        <ul>
          <li>
            Your income or the income of your dependents changes (including
            earnings, Social Security benefits, or lottery and gambling
            winnings)
          </li>
          <li>
            Your net worth increases (including bank accounts, investments, or
            real estate)
          </li>
          <li>Your medical expenses decrease</li>
          <li>
            You add or remove a dependent (including children, parents, or
            spouses)
          </li>
          <li>Your address or phone number changes</li>
        </ul>
      </section>
      <ConfirmationView.HowToContact />
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
      response: PropTypes.shape({
        attributes: PropTypes.shape({
          confirmationNumber: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      timestamp: PropTypes.string,
    }),
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired,
  }),
};

export default ConfirmationPage;
