// libs
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

// platform - forms - selectors
import { preSubmitSelector } from 'platform/forms/selectors/review';

// platform - forms-system components
import { PreSubmitSection } from 'platform/forms-system/src/js/components/PreSubmitSection';

// platform - form-system actions
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

/*
*  RenderPreSubmitSection - renders PreSubmitSection by default or presubmit.CustomComponent 
*  PreSubmitSection - ~Default component that renders if no CustomComponent is provided~ (this describes a decision in RenderPreSubmitSection- describe what PreSubmitSection is, remove this since it's not a prop, or add it as a prop with a default value)
*  preSubmitInfo.CustomComponent - property that can be added to `preSubmitInfo` object that overwrites `PreSubmitSection`
*/

function PreSubmitSectionController(props) {
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
        <PreSubmitSection
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

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export default connect(
  (state, ownProps) => {
    const { form } = state;

    const preSubmit = preSubmitSelector(ownProps?.formConfig);

    return {
      form,
      preSubmit,
    };
  },
  mapDispatchToProps,
)(PreSubmitSectionController);
