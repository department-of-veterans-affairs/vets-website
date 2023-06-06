// added until testing of new radio buttons is completed

import React from 'react';
import { connect } from 'react-redux';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PreSubmitInfo from '../../containers/PreSubmitInfo';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const { vrrapConfirmation } = formData;

  const options = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  const handlers = {
    onSelection: event => {
      setPreSubmit('vrrapConfirmation', event.detail.value === 'true');
    },
  };

  const confirmEligibilityNote = (
    <div>
      <div>
        <h4 id="confirmEligibility_title">Confirm you’re eligible for VRRAP</h4>
        <div>
          <p>
            To be eligible for VRRAP, the 3 following statements must be true:
          </p>
          <ul>
            <li>
              As of the date of this application, you’re currently unemployed
              due to the COVID-19 pandemic.
            </li>
            <li>
              You’re not currently enrolled in a federal or state jobs program,
              and you don’t expect to be enrolled in one while using VRRAP.
            </li>
            <li>
              You won’t receive unemployment compensation, including any cash
              benefit received under the CARES Act, while training using VRRAP.
            </li>
          </ul>
        </div>
      </div>
      <VaRadio
        class="vads-u-margin-y--4"
        name="confirmEligibility"
        error={null}
        label="The statements above are true and accurate to the best of my knowledge and belief."
        onVaValueChange={handlers.onSelection}
        ariaDescribedby="confirmEligibility"
      >
        {options.map(({ value, label }) => (
          <VaRadioOption
            key={value}
            class="vads-u-margin-y--3"
            name="confirmEligibility_options"
            label={label}
            id={`confirmEligibility_options ${value}`}
            value={value}
            checked={vrrapConfirmation === value}
            ariaDescribedby="confirmEligibility_options"
          />
        ))}
      </VaRadio>
    </div>
  );

  return (
    <>
      {confirmEligibilityNote}
      <PreSubmitInfo
        formData={formData}
        showError={showError}
        onSectionComplete={onSectionComplete}
        setPreSubmit={setPreSubmit}
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
