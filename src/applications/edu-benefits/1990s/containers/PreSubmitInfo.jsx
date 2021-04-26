import React from 'react';
import { connect } from 'react-redux';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

function PreSubmitNotice({ formData, onSectionComplete, setPreSubmit }) {
  const vrrapConfirmation = formData.vrrapConfirmation;

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
              As of the date of this application, you're currently unemployed
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
      <PreSubmitInfo
        formData={formData}
        onSectionComplete={onSectionComplete}
      />
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
