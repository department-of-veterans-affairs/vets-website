// libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// formation
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

// platform - forms - selectors
import { preSubmitSelector } from 'platform/forms/selectors/review';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

/*
*  RenderPreSubmitSection - renders PreSubmitSection by default or presubmit.CustomComponent 
*  PreSubmitSection - ~Default component that renders if no CustomComponent is provided~ (this describes a decision in RenderPreSubmitSection- describe what PreSubmitSection is, remove this since it's not a prop, or add it as a prop with a default value)
*  preSubmitInfo.CustomComponent - property that can be added to `preSubmitInfo` object that overwrites `PreSubmitSection`
*/

export function PreSubmitSection(props) {
  const { form, preSubmit = {}, setPreSubmit, showPreSubmitError } = props;

  const { CustomComponent } = preSubmit;
  const checked = form?.data[preSubmit?.field] || false;

  return (
    <>
      {CustomComponent ? (
        <CustomComponent
          formData={form?.data}
          preSubmitInfo={preSubmit}
          showError={showPreSubmitError}
          onSectionComplete={value => setPreSubmit(preSubmit?.field, value)}
        />
      ) : (
        <div>
          {preSubmit.notice}
          {preSubmit.required && (
            <Checkbox
              required
              checked={checked}
              onValueChange={value => setPreSubmit(preSubmit?.field, value)}
              name={preSubmit.field}
              errorMessage={
                showPreSubmitError && !checked
                  ? preSubmit.error || 'Please accept'
                  : undefined
              }
              label={preSubmit.label}
            />
          )}
        </div>
      )}
    </>
  );
}

PreSubmitSection.propTypes = {
  form: PropTypes.shape({
    submission: PropTypes.shape({
      hasAttemptedSubmit: PropTypes.bool,
    }),
  }).isRequired,
  formConfig: PropTypes.shape({
    preSubmitInfo: PropTypes.object,
  }).isRequired,
  showPreSubmitError: PropTypes.bool,
  setPreSubmit: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  (state, ownProps) => {
    const { form } = state;

    const preSubmit = preSubmitSelector(ownProps?.formConfig);
    const showPreSubmitError = form?.submission?.hasAttemptedSubmit;

    return {
      form,
      preSubmit,
      showPreSubmitError,
    };
  },
  mapDispatchToProps,
)(PreSubmitSection);
