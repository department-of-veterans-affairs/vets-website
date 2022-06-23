import React from 'react';
import { connect } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import {
  formFields,
  VETERAN_NOT_LISTED_LABEL,
  VETERAN_NOT_LISTED_VALUE,
} from '../constants';

function VeteransRadioGroup({
  selectedVeteran,
  formData,
  setFormData,
  veterans,
}) {
  const VETERAN_VALUE_PREFIX = 'veteran-';

  const onValueChange = ({ value }) => {
    setFormData({
      ...formData,
      [formFields.selectedVeteran]: value.replace(VETERAN_VALUE_PREFIX, ''),
    });
  };

  const options = veterans?.length
    ? veterans?.map((veteran, index) => ({
        label: `Veteran or service member ${index + 1}: ${veteran.name}`,
        value: `${VETERAN_VALUE_PREFIX + veteran.id}`,
      }))
    : [];
  options.push({
    label: VETERAN_NOT_LISTED_LABEL,
    value: VETERAN_VALUE_PREFIX + VETERAN_NOT_LISTED_VALUE,
  });

  return (
    <RadioButtons
      additionalFieldsetClass="vads-u-margin-top--0"
      additionalLegendClass="fry-dea-veterans-checkboxes_legend vads-u-margin-top--0"
      onValueChange={onValueChange}
      options={options}
      value={{ value: VETERAN_VALUE_PREFIX + selectedVeteran }}
    />
  );
}

const mapStateToProps = state => ({
  selectedVeteran: state.form?.data[formFields.selectedVeteran],
  formData: state.form?.data || {},
  veterans: state.form?.data?.veterans,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteransRadioGroup);
