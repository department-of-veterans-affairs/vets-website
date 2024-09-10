// Dependencies
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

// Relative Imports
import { updateField } from '../actions';
import FormQuestions from '../components/FormQuestions';

export const FormPage = ({ formValues, updateFormField }) => {
  return (
    <div>
      <h1>How to apply for a discharge upgrade</h1>
      <div className="medium-8">
        <FormQuestions
          formValues={formValues}
          updateFormField={updateFormField}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  formValues: state.dischargeWizard.form,
});
const mapDispatchToProps = {
  updateFormField: updateField,
};

FormPage.propTypes = {
  updateFormField: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormPage);
