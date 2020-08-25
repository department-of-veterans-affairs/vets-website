// libs
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// platform - forms - selectors
import { preSubmitSelector } from 'platform/forms/selectors/review';

// platform - forms-system components
import { PreSubmitSection as DefaultPreSubmitSection } from 'platform/forms-system/src/js/components/PreSubmitSection';

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
        <DefaultPreSubmitSection
          checked={form?.data[preSubmit?.field] || false}
          formData={form?.data}
          preSubmitInfo={preSubmit}
          showError={showPreSubmitError}
          onSectionComplete={value => setPreSubmit(preSubmit?.field, value)}
        />
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