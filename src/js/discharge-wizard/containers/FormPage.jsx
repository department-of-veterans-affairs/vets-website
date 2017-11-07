import { connect } from 'react-redux';
import React from 'react';

import { updateField } from '../actions';
import FormQuestions from '../components/FormQuestions';

class FormPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Upgrading Your Discharge Status: What to know</h1>
        <div className="medium-8">
          <FormQuestions formValues={this.props.formValues} updateField={this.props.updateField}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: state.dischargeWizard.form,
  };
};
const mapDispatchToProps = {
  updateField,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
