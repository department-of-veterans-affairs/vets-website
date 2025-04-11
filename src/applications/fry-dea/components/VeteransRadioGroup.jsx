import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Importing from @department... is causing Cypress tests to fail.
// import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '~/platform/forms-system/src/js/actions';

import {
  formFields,
  VETERANS_TYPE,
  VETERAN_NOT_LISTED_LABEL,
  VETERAN_NOT_LISTED_VALUE,
  VETERAN_VALUE_PREFIX,
} from '../constants';

function VeteransRadioGroup({
  formData,
  selectedVeteran,
  setFormData,
  veterans,
}) {
  const setSelectedVeteran = useCallback(
    event => {
      setFormData({
        ...formData,
        [formFields.benefitSelection]: undefined,
        [formFields.selectedVeteran]: event?.detail?.value?.replace(
          VETERAN_VALUE_PREFIX,
          '',
        ),
      });
    },
    [formData, setFormData],
  );

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

  const VaRadioOptions = options.map((option, index) => {
    return (
      <va-radio-option
        checked={option.value === VETERAN_VALUE_PREFIX + selectedVeteran}
        class="vads-u-margin-y--2"
        key={index}
        label={option.label}
        name={option.label}
        value={option.value}
      />
    );
  });

  return (
    <VaRadio onVaValueChange={setSelectedVeteran}>{VaRadioOptions}</VaRadio>
  );
}

VeteransRadioGroup.propTypes = {
  formData: PropTypes.object,
  selectedVeteran: PropTypes.string,
  setFormData: PropTypes.func,
  veterans: VETERANS_TYPE,
};

const mapStateToProps = state => ({
  selectedVeteran: state.form?.data[formFields.selectedVeteran],
  formData: state.form?.data || {},
  veterans: state.form?.data?.veterans,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(VeteransRadioGroup);
