import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import ButtonGroup from '../shared/ButtonGroup';

const defaultRecord = {
  make: '',
  model: '',
  year: '',
  resaleValue: '',
};

const MAX_VEHICLE_MAKE_LENGTH = 32;

const EnhancedVehicleRecord = ({ data, goToPath, setFormData }) => {
  const { assets } = data;
  const { automobiles = [] } = assets;

  const searchIndex = new URLSearchParams(window.location.search);
  let editIndex = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(editIndex)) {
    editIndex = automobiles?.length ?? 0;
  }
  const isEditing = editIndex >= 0 && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const MAXIMUM_RESALE_VALUE = 1000000;

  // if we have vehicles and plan to edit, we need to get it from the automobiles
  const specificRecord = automobiles ? automobiles[index] : defaultRecord[0];

  const [vehicleRecord, setVehicleRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord),
  });

  const [vehicleRecordIsDirty, setVehicleRecordIsDirty] = useState(false);
  const [makeIsDirty, setVehicleMakeIsDirty] = useState(false);
  const [modelIsDirty, setVehicleModelIsDirty] = useState(false);
  const [yearIsDirty, setVehicleYearIsDirty] = useState(false);
  const [resaleValueIsDirty, setEstValueIsDirty] = useState(false);

  const makeError = !vehicleRecord.make ? 'Please enter a vehicle make' : null;
  const modelError = !vehicleRecord.model
    ? 'Please enter a vehicle model'
    : null;
  const yearError = !vehicleRecord.year ? 'Please enter a valid year' : null;
  const resaleValueError =
    !vehicleRecord.resaleValue ||
    !isValidCurrency(vehicleRecord.resaleValue) ||
    (vehicleRecord.resaleValue > MAXIMUM_RESALE_VALUE ||
      vehicleRecord.resaleValue < 0)
      ? 'Please enter an estimated value less than $1,000,000'
      : null;

  const handleChange = (key, value) => {
    setVehicleRecord({
      ...vehicleRecord,
      [key]: value,
    });
    setVehicleRecordIsDirty(true);
  };

  const handleVehicleMakeChange = ({ target }) => {
    handleChange('make', target.value);
    setVehicleMakeIsDirty(true);
  };

  const handleVehicleModelChange = ({ target }) => {
    handleChange('model', target.value);
    setVehicleModelIsDirty(true);
  };

  const handleVehicleYearChange = event => {
    handleChange('year', event.target.value);
    setVehicleYearIsDirty(true);
  };

  const handleVehicleEstValueChange = event => {
    handleChange('resaleValue', event.target.value);
    setEstValueIsDirty(true);
  };

  const handleBack = event => {
    event.preventDefault();
    goToPath('/vehicles-summary');
  };

  const updateFormData = e => {
    e.preventDefault();
    const newVehicleArray = [...automobiles];
    newVehicleArray[index] = vehicleRecord;

    // set dirty flags so validation errors show
    setVehicleRecordIsDirty(true);
    setVehicleMakeIsDirty(true);
    setVehicleModelIsDirty(true);
    setEstValueIsDirty(true);

    if (resaleValueError) {
      return;
    }

    if (
      vehicleRecord.make &&
      vehicleRecord.model &&
      vehicleRecord.resaleValue
    ) {
      // update form data
      setFormData({
        ...data,
        assets: {
          ...data.assets,
          automobiles: newVehicleArray,
        },
      });
      goToPath('/vehicles-summary');
    }
  };

  const labelText = automobiles.length === editIndex ? 'Add' : 'Update';

  const renderAddCancelButtons = () => {
    return (
      <>
        <ButtonGroup
          buttons={[
            {
              label: 'Cancel',
              onClick: handleBack, // Define this function based on page-specific logic
              isSecondary: true,
            },
            {
              label: `${labelText} vehicle`,
              onClick: updateFormData,
              isSubmitting: 'prevent', // If this button submits a form
            },
          ]}
        />
      </>
    );
  };

  const renderContinueBackButtons = () => {
    return (
      <>
        <ButtonGroup
          buttons={[
            {
              label: 'Back',
              onClick: handleBack, // Define this function based on page-specific logic
              isSecondary: true,
            },
            {
              label: 'Continue',
              onClick: updateFormData,
              isSubmitting: 'prevent', // If this button submits a form
            },
          ]}
        />
      </>
    );
  };

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your car or other vehicle</h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            Enter your vehicle’s information below.
          </p>
        </legend>
        <VaTextInput
          error={(vehicleRecordIsDirty && makeIsDirty && makeError) || null}
          id="add-make-name"
          label="Vehicle make"
          maxlength={MAX_VEHICLE_MAKE_LENGTH}
          name="make"
          onInput={handleVehicleMakeChange}
          required
          type="text"
          value={vehicleRecord.make || ''}
          width="lg"
        />
        <VaTextInput
          error={(vehicleRecordIsDirty && modelIsDirty && modelError) || null}
          id="add-model-name"
          label="Vehicle Model"
          maxlength={MAX_VEHICLE_MAKE_LENGTH}
          name="model"
          onInput={handleVehicleModelChange}
          required
          type="text"
          value={vehicleRecord.model || ''}
          width="lg"
        />
        <va-text-input
          error={(vehicleRecordIsDirty && yearIsDirty && yearError) || null}
          hint={null}
          inputmode="numeric"
          label="Vehicle year"
          name="year"
          id="year"
          onInput={handleVehicleYearChange}
          value={vehicleRecord.year || ''}
          width="md"
        />
        <va-text-input
          error={
            (vehicleRecordIsDirty && resaleValueIsDirty && resaleValueError) ||
            null
          }
          hint={null}
          inputmode="decimal"
          label="Estimated value"
          name="estValue"
          currency
          id="estValue"
          required
          onInput={handleVehicleEstValueChange}
          value={vehicleRecord.resaleValue}
          min={0}
          max={MAXIMUM_RESALE_VALUE}
          type="decimal"
          width="md"
        />
        <va-additional-info
          class="vads-u-margin-top--4"
          trigger="Why do I need to provide this information?"
        >
          We ask for vehicle details such as type, make, model, year, and
          estimated value because this allows us to make a more informed
          decision regarding your request.
          <br />
          We won’t take collection action against your cars or other vehicles in
          order to resolve your debt.
        </va-additional-info>
        <va-additional-info
          class="vads-u-margin-y--2"
          trigger="What if I don’t know the estimated value of car or other vehicle?"
        >
          Include the amount of money you think you would get if you sold the
          vehicle in your local community. To get an idea of prices, you can
          check these places:
          <ul>
            <li>Online forums for your community</li>
            <li>Classified ads in local newspapers</li>
            <li>Websites or forums that appraise the value of vehicles</li>
          </ul>
        </va-additional-info>
        <p>
          {automobiles.length > 0
            ? renderAddCancelButtons()
            : renderContinueBackButtons()}
        </p>
      </fieldset>
    </form>
  );
};

EnhancedVehicleRecord.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      automobiles: PropTypes.arrayOf(
        PropTypes.shape({
          make: PropTypes.string,
          model: PropTypes.string,
          resaleValue: PropTypes.string,
          year: PropTypes.string,
        }),
      ),
    }),
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default EnhancedVehicleRecord;
