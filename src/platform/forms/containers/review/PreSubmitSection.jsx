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
*  RenderPreSubmitSection - Component that conditionally renders PreSubmitSection, which is default, or a custom override
*  PreSubmitSection - Default component that renders if no CustomComponent is provided
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
