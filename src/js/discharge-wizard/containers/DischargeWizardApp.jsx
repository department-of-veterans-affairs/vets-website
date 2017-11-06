import { connect } from 'react-redux';
import React from 'react';

import { updateField } from '../actions';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';

class DischargeWizardApp extends React.Component {
  handleChange() {

  }


  renderQuestionOne() {
    const radioButtonProps = {
      name: 'dateRange',
      label: '',
      options: [
        { label: '1. I suffered from an undiagnosed, misdiagnosed, or untreated mental health condition including posttraumatic stress disorder (PTSD) in the service, and was discharged for reasons related to this condition.', value: 1 },
        { label: '2. I suffered from an undiagnosed, misdiagnosed, or untreated Traumatic Brain Injury (TBI) in the service, and was discharged for reasons related to this condition.', value: 2 },
        { label: '3. I was discharged due to homosexual conduct under Don’t Ask Don’t Tell (DADT) or preceding policies.', value: 3 },
        { label: '4. I was the victim of sexual assault or harassment in the service, and was discharged for reasons related to this incident.', value: 4 },
        { label: '5. I am transgender, and my discharge shows my birth name instead of my current name.', value: 5 },
        { label: '6. There is an error on my discharge paperwork for other reasons.', value: 6 },
        { label: '7. My discharge is unjust or unfair punishment for other reasons.', value: 7 },
      ],
      onValueChange: (v) => {
        if (v.dirty) {
          this.props.changeDateOption(v.value);
          this.setState({
            startDateError: null,
            endDateError: null,
          });
        }
      },
      value: {
        value: this.props.dischargeWizard['1_reason'],
      }
    };

    return <ErrorableRadioButtons {...radioButtonProps}/>;
  }

  render() {
    return (
      <div className="discharge-wizard">
        <div className="row">
          <div className="columns small-12">
            <h1>Upgrading Your Discharge Status: What to know</h1>
            <div className="medium-8">
              <h4>Which of the following best describes why you want to change your discharge paperwork?</h4>
              {this.renderQuestionOne()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dischargeWizard: state.dischargeWizard,
  };
};
const mapDispatchToProps = {
  updateField,
};

export default connect(mapStateToProps, mapDispatchToProps)(DischargeWizardApp);
