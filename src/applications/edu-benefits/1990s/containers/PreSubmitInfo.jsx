import React, { useEffect } from 'react';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import { connect } from 'react-redux';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const privacyAgreementAccepted = formData.privacyAgreementAccepted || false;
  const vrrapConfirmation = formData.vrrapConfirmation;

  // when there is no unsigned signatures set AGREED (onSectionComplete) to true
  // if goes to another page (unmount), set AGREED (onSectionComplete) to false
  useEffect(
    () => {
      onSectionComplete(privacyAgreementAccepted);

      return () => {
        onSectionComplete(false);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [privacyAgreementAccepted],
  );

  const privacyAgreementLabel = (
    <span>
      I have read and accept the{' '}
      <a
        aria-label="Privacy policy, will open in new tab"
        target="_blank"
        href="/privacy-policy/"
      >
        privacy policy
      </a>
    </span>
  );

  const privacyAgreement = (
    <div>
      <div>
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </div>
      <Checkbox
        required
        checked={privacyAgreementAccepted}
        onValueChange={value => setPreSubmit('privacyAgreementAccepted', value)}
        name={'privacyAgreementAccepted'}
        errorMessage={
          showError && !privacyAgreementAccepted
            ? 'You must accept the privacy policy before continuing.'
            : undefined
        }
        label={privacyAgreementLabel}
      />
    </div>
  );

  const confirmEligibilityNote = (
    <div>
      <div>
        <h4 id="confirmEligibility_title">Confirm you're eligible for VRRAP</h4>
        <div>
          <p>
            To be eligible for VRRAP, the 3 following statements must be true:
          </p>
          <ul>
            <li>
              As of the date of this application, you are currently unemployed
              due to the COVID-19 pandemic.
            </li>
            <li>
              You're not currently enrolled in a federal or state jobs program,
              and you don't expect to be enrolled in one while using VRRAP.
            </li>
            <li>
              You won't receive unemployment compensation, including any cash
              benefit received under the CARES Act, while training using VRRAP.
            </li>
          </ul>
        </div>
      </div>
      <div>
        <RadioButtons
          name={'confirmEligibility_options'}
          label={
            'The statements above are true and accurate to the best of my knowledge and belief.'
          }
          id={'confirmEligibility_options'}
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]}
          onValueChange={({ value }) =>
            setPreSubmit('vrrapConfirmation', value === 'true')
          }
          value={{ value: vrrapConfirmation }}
        />
      </div>
    </div>
  );

  return (
    <>
      {confirmEligibilityNote}
      {privacyAgreement}
    </>
  );
}

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitNotice);
