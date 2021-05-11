// Dependencies
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

// Relative Imports
import { updateField } from '../actions';
import FormQuestions from '../components/FormQuestions';

const FormPage = ({ router, formValues, updateFormField }) => {
  useEffect(() => {
    if (!sessionStorage.getItem('dw-session-started')) {
      router.push('/');
    }
  });

  return (
    <div>
      <h1>How to Apply for a Discharge Upgrade</h1>
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
