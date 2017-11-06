import { connect } from 'react-redux';
import React from 'react';

import { updateField } from '../actions';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
// import ErrorableNumberInput from '../../common/components/form-elements/ErrorableNumberInput';
// import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
// import { months } from '../../common/utils/options-for-select.js';

class DischargeWizardApp extends React.Component {
  renderQuestion(name, label, options) {
    const radioButtonProps = {
      name,
      label,
      options,
      onValueChange: (v) => {
        if (v.dirty) {
          this.props.updateField(name, v.value);
          this.forceUpdate();
        }
      },
      value: {
        value: this.props.formValues[name],
      }
    };

    return <ErrorableRadioButtons {...radioButtonProps}/>;
  }

  renderQuestionOne() {
    const options = [
      { label: 'I suffered from an undiagnosed, misdiagnosed, or untreated mental health condition including posttraumatic stress disorder (PTSD) in the service, and was discharged for reasons related to this condition.', value: '1' },
      { label: 'I suffered from an undiagnosed, misdiagnosed, or untreated Traumatic Brain Injury (TBI) in the service, and was discharged for reasons related to this condition.', value: '2' },
      { label: 'I was discharged due to homosexual conduct under Don’t Ask Don’t Tell (DADT) or preceding policies.', value: '3' },
      { label: 'I was the victim of sexual assault or harassment in the service, and was discharged for reasons related to this incident.', value: '4' },
      { label: 'I am transgender, and my discharge shows my birth name instead of my current name.', value: '5' },
      { label: 'There is an error on my discharge paperwork for other reasons.', value: '6' },
      { label: 'My discharge is unjust or unfair punishment for other reasons.', value: '7' },
    ];

    const label = <h4>Which of the following best describes why you want to change your discharge paperwork?</h4>;

    return this.renderQuestion('1_reason', label, options);
  }

  renderQuestionOneA() {
    if (this.props.formValues['1_reason'] !== '3') { return null; }

    const label = <h4>Which of the following categories best describes you?</h4>;
    const options = [
      { label: 'My discharge is Honorable or General Under Honorable Conditions, and I only want my narrative reason for discharge or enlistment code changed.', value: '1' },
      { label: 'My discharge status is not under honorable conditions.', value: '2' },
    ];

    return this.renderQuestion('1_dischargeType', label, options);
  }

  renderQuestionOneB() {
    // TODO: hide if previous questions have not been answered
    if (this.props.formValues['1_reason'] === '5') { return null; }

    const label = <h4>Do you want to change any portion of your record other than discharge status, re-enlistment code, and narrative reason for discharge? (For example, your name or remarks.)</h4>;
    const options = [
      { label: 'Yes, I want to change other information on my record, like my name or remarks.', value: '1' },
      { label: 'No, I only want to change my discharge status, re-enlistment code, and/or narrative reason for discharge.', value: '2' },
    ];

    return this.renderQuestion('1_intention', label, options);
  }

  renderQuestionTwo() {

  }

  render() {
    return (
      <div className="discharge-wizard">
        <div className="row">
          <div className="columns small-12">
            <h1>Upgrading Your Discharge Status: What to know</h1>
            <div className="medium-8">
              {this.renderQuestionOne()}
              {this.renderQuestionOneA()}
              {this.renderQuestionOneB()}
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DischargeWizardApp);
