import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const defaultRecord = {
  make: '',
  model: '',
  year: '',
  resaleValue: '',
};

const MAX_VEHICLE_MAKE_LENGTH = 32;

const EnhancedVehicleRecord = props => {
  const { data, goToPath, setFormData } = props;

  const { assets } = data;
  const { automobiles = [] } = assets;

  const searchIndex = new URLSearchParams(window.location.search);
  let editIndex = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(editIndex)) {
    editIndex = automobiles?.length ?? 0;
  }
  const isEditing = editIndex >= 0 && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

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
  const resaleValueError = !vehicleRecord.resaleValue
    ? 'Please enter the estimated value'
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
    if (automobiles.length > 0) {
      goToPath('/vehicles-summary');
    } else {
      goToPath('/vehicles');
    }
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

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          Your car or other vehicle
        </legend>
        <p>Enter your vehicle’s information below.</p>
        <div className="input-size-5">
          <VaTextInput
            className="no-wrap input-size-5"
            error={(vehicleRecordIsDirty && makeIsDirty && makeError) || null}
            id="add-make-name"
            label="Vehicle make"
            maxlength={MAX_VEHICLE_MAKE_LENGTH}
            name="make"
            onInput={handleVehicleMakeChange}
            required
            type="text"
            value={vehicleRecord.make || ''}
          />
        </div>

        <div className="input-size-5">
          <VaTextInput
            className="no-wrap input-size-5"
            error={(vehicleRecordIsDirty && modelIsDirty && modelError) || null}
            id="add-model-name"
            label="Vehicle Model"
            maxlength={MAX_VEHICLE_MAKE_LENGTH}
            name="model"
            onInput={handleVehicleModelChange}
            required
            type="text"
            value={vehicleRecord.model || ''}
          />
        </div>

        <div className="input-size-2">
          <va-number-input
            error={(vehicleRecordIsDirty && yearIsDirty && yearError) || null}
            hint={null}
            inputmode="numeric"
            label="Vehicle year"
            name="year"
            id="year"
            onInput={handleVehicleYearChange}
            value={vehicleRecord.year || ''}
          />
        </div>

        <div className="input-size-2 no-wrap">
          <va-number-input
            error={
              (vehicleRecordIsDirty &&
                resaleValueIsDirty &&
                resaleValueError) ||
              null
            }
            hint={null}
            inputmode="numeric"
            label="Estimated value"
            name="estValue"
            currency
            id="estValue"
            required
            onInput={handleVehicleEstValueChange}
            value={vehicleRecord.resaleValue}
          />
        </div>

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
        <va-additional-info trigger="What if I don’t know the estimated value of car or other vehicle?">
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
          <button
            type="button"
            id="cancel"
            className="usa-button-secondary vads-u-width--auto"
            onClick={handleBack}
          >
            Cancel
          </button>
          <button
            type="button"
            id="submit"
            className="vads-u-width--auto"
            onClick={updateFormData}
          >
            {`${automobiles.length === editIndex ? 'Add' : 'Update'} vehicle`}
          </button>
        </p>
      </fieldset>
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnhancedVehicleRecord);
