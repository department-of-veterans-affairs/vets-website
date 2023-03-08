import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
// import { parseISODate } from 'platform/forms-system/src/js/helpers';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../utils/session';

const defaultRecord = [
  {
    type: '',
    from: '',
    to: '',
    isCurrent: false,
    employerName: '',
  },
];

const EnhancedVehicleRecord = props => {
  const { data, goToPath, goBack, onReviewPage, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  // if we have vehicles and plan to edit, we need to get it from the employmentRecords
  const specificRecord = data.assets.automobiles
    ? data.assets.automobiles[index]
    : defaultRecord[0];

  const [vehicleRecord, setVehicleRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [vehicleRecordIsDirty, setVehicleRecordIsDirty] = useState(false);
  const [makeIsDirty, setVehicleMakeIsDirty] = useState(false);
  const [modelIsDirty, setVehicleModelIsDirty] = useState(false);

  const handleChange = (key, value) => {
    setVehicleRecord({
      ...vehicleRecord,
      [key]: value,
    });
    setVehicleRecordIsDirty(true);
  };

  const handleVehicleMakeChange = value => {
    handleChange('make', value);
    setVehicleMakeIsDirty(true);
  };

  const handleVehicleModelChange = value => {
    handleChange('model', value);
    setVehicleModelIsDirty(true);
  };

  const handleVehicleYearChange = value => {
    handleChange('year', value);
    setVehicleModelIsDirty(true);
  };

  const handleVehicleEstValueChange = value => {
    handleChange('resaleValue', value);
    setVehicleModelIsDirty(true);
  };

  const updateFormData = e => {
    e.preventDefault();
    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = data.assets.automobiles.map((item, arrayIndex) => {
        return arrayIndex === index ? vehicleRecord : item;
      });
      // update form data
      setFormData({
        ...data,
        assets: {
          ...data.assets,
          automobiles: updatedRecords,
        },
      });
    } else {
      const records = [
        vehicleRecord,
        ...(data.assets.automobiles ? data.assets.automobiles : []),
      ];

      setFormData({
        ...data,
        assets: {
          ...data.assets,
          automobiles: records,
        },
      });
    }
    goToPath('/vehicles-summary');
  };

  // const validateYear = (monthYear, errorSetter, requiredMessage) => {
  //   const [year] = monthYear.split('-');
  //   const todayYear = new Date().getFullYear();
  //   const isComplete = /\d{4}-\d{1,2}/.test(monthYear);
  //   if (!isComplete) {
  //     // This allows a custom required error message to be used
  //     errorSetter(requiredMessage);
  //   } else if (
  //     !!year &&
  //     (parseInt(year, 10) > todayYear || parseInt(year, 10) < 1900)
  //   ) {
  //     errorSetter(`Please enter a year between 1900 and ${todayYear}`);
  //   } else {
  //     errorSetter(null);
  //   }
  // };

  const makeError = 'Please enter a vehicle make';
  const modelError = 'Please enter a vehicle model';

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <div className="input-size-5">
        <TextInput
          field={{
            value: vehicleRecord.make || '',
          }}
          label="Vehicle make"
          name="make"
          onValueChange={({ value }) => handleVehicleMakeChange(value)}
          required
          errorMessage={
            vehicleRecordIsDirty &&
            makeIsDirty &&
            !vehicleRecord.make &&
            makeError
          }
        />
      </div>

      <div className="input-size-5">
        <TextInput
          field={{
            value: vehicleRecord.model || '',
          }}
          label="Vehicle model"
          name="model"
          onValueChange={({ value }) => handleVehicleModelChange(value)}
          required
          errorMessage={
            vehicleRecordIsDirty &&
            modelIsDirty &&
            !vehicleRecord.model &&
            modelError
          }
        />
      </div>

      <div className="input-size-1">
        <va-number-input
          hint={null}
          inputmode="numeric"
          label="Vehicle year"
          name="year"
          onInput={({ value }) => handleVehicleYearChange(value)}
          value={vehicleRecord.year}
        />
      </div>

      <div className="input-size-5">
        <va-number-input
          hint={null}
          inputmode="numeric"
          label="Estimated value"
          name="estValue"
          onInput={({ value }) => handleVehicleEstValueChange(value)}
          value={vehicleRecord.year}
        />
      </div>

      {onReviewPage ? updateButton : navButtons}
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
