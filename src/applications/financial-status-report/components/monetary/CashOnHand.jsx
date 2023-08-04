import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CashOnHand = ({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
}) => {
  const { assets } = data;
  const { cashOnHand } = assets;
  const [cash, setCash] = useState(cashOnHand);

  const updateFormData = () => {
    // update form data & gmtIsShort
    setFormData({
      ...data,
      assets: {
        ...data.assets,
        cashOnHand: cash,
      },
    });
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Cash on hand</h3>
        </legend>
        <div className="input-size-3">
          <VaNumberInput
            currency
            hint={null}
            inputmode="numeric"
            label="What is the dollar amount of available cash (not in a bank) you currently have?"
            name="cash"
            id="cash"
            onInput={event => setCash(event.target.value)}
            value={cash}
            width="md"
          />
        </div>
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={updateFormData}
          submitToContinue
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

CashOnHand.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    assets: PropTypes.shape({
      cashOnHand: PropTypes.string,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default CashOnHand;
