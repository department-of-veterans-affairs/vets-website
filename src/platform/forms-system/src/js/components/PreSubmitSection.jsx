import PropTypes from 'prop-types';
import React from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

/*
*  PrivacyAgreementTemplate - default component provided when preSubmitInfo hook is populated in the form config
*  preSubmitInfo - props provided from object being passed into `preSubmitInfo` hook in the form config
*  preSubmitInfo.customComponent - property that can be added to `preSubmitInfo` object that overwrites `PrivacyAgreementTemplate`
*/

export function PreSubmitSection(props) {
  const { onChange, showError, preSubmitInfo, checked } = props;
  const PrivacyAgreementTemplate = () => (
    <>
      {preSubmitInfo.notice}
      {preSubmitInfo.required && (
        <ErrorableCheckbox
          required
          checked={checked}
          onValueChange={onChange}
          name={preSubmitInfo.field}
          errorMessage={
            showError && !checked
              ? preSubmitInfo.error || 'Please accept'
              : undefined
          }
          label={preSubmitInfo.label}
        />
      )}
    </>
  );

  return (
    <div>
      {preSubmitInfo.customComponent ? (
        preSubmitInfo.customComponent(props)
      ) : (
        <PrivacyAgreementTemplate />
      )}
    </div>
  );
}

PreSubmitSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.object.isRequired,
  showError: PropTypes.bool,
  customComponent: PropTypes.func,
};
