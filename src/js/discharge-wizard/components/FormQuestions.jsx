import React from 'react';
import { range } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import { months } from '../../common/utils/options-for-select.js';
import { questionLabels, prevApplicationYearCutoff, answerReview } from '../config';
import { shouldShowQuestion, elementTopOffset } from '../utils';

class FormQuestions extends React.Component {
  updateField(name, value) {
    this.props.updateField(name, value);
    this.forceUpdate();
  }

  handleScrollTo = (e) => {
    e.preventDefault();
    window.scrollTo(0, elementTopOffset(this[e.target.name]));
  }

  renderQuestion(name, label, options) {
    const radioButtonProps = {
      name,
      label,
      options,
      key: name,
      onValueChange: (v) => {
        if (v.dirty) {
          this.updateField(name, v.value);
        }
      },
      value: {
        value: this.props.formValues[name],
      }
    };

    return (
      <div ref={(el) => { this[name] = el; }}>
        <ErrorableRadioButtons {...radioButtonProps}/>
      </div>
    );
  }

  renderQuestionOne() {
    const options = [
      { label: questionLabels['1_reason']['1'], value: '1' },
      { label: questionLabels['1_reason']['2'], value: '2' },
      { label: questionLabels['1_reason']['3'], value: '3' },
      { label: questionLabels['1_reason']['4'], value: '4' },
      { label: questionLabels['1_reason']['5'], value: '5' },
      { label: questionLabels['1_reason']['6'], value: '6' },
      { label: questionLabels['1_reason']['7'], value: '7' },
    ];

    const label = <h4>Which of the following best describes why you want to change your discharge paperwork?</h4>;

    return this.renderQuestion('1_reason', label, options);
  }

  renderQuestionOneA() {
    const key = '2_dischargeType';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const label = <h4>Which of the following categories best describes you?</h4>;
    const options = [
      { label: questionLabels[key][1], value: '1' },
      { label: questionLabels[key][2], value: '2' },
    ];
    return this.renderQuestion(key, label, options);
  }

  renderQuestionOneB() {
    const key = '3_intention';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const label = <h4>Do you want to change any portion of your record other than discharge status, re-enlistment code, and narrative reason for discharge? (For example, your name or remarks.)</h4>;
    const options = [
      { label: `Yes, ${questionLabels[key][1]}`, value: '1' },
      { label: `No, ${questionLabels[key][2]}`, value: '2' },
    ];
    return this.renderQuestion('3_intention', label, options);
  }

  renderQuestionTwo() {
    const key = '4_dischargeYear';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const dischargeYear = this.props.formValues[key];
    const currentYear = (new Date()).getFullYear();
    const yearOptions = range(currentYear - 1992).map(i => {
      const year = currentYear - i;
      return { label: year.toString(), value: year.toString() };
    });

    yearOptions.push({ label: 'Before 1992', value: '1991' });

    const label = (
      <legend className="legend-label">
        <h4>What year were you discharged from the military?</h4>
      </legend>
    );

    return (
      <fieldset className="fieldset-input dischargeYear" key="dischargeYear" ref={(el) => { this[key] = el; }}>
        <ErrorableSelect
          autocomplete="false"
          label={label}
          name={key}
          options={yearOptions}
          value={{ value: dischargeYear }}
          onValueChange={(update) => { this.updateField(key, update.value); }}/>
      </fieldset>
    );
  }

  renderQuestionTwoB() {
    const key = '5_dischargeMonth';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const monthLabel = (
      <legend className="legend-label">
        <h4>What month were you discharged?</h4>
      </legend>
    );

    return (
      <fieldset className="fieldset-input dischargeMonth" key="dischargeMonth" ef={(el) => { this[key] = el; }}>
        <ErrorableSelect
          autocomplete="false"
          label={monthLabel}
          name={key}
          options={months}
          value={{ value: this.props.formValues[key] }}
          onValueChange={(update) => { this.updateField(key, update.value); }}/>
      </fieldset>
    );
  }

  renderQuestionThree() {
    const key = '6_courtMartial';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const label = <h4>Was your discharge the outcome of a General Court Martial? (Answer “no” if your discharge was administrative, or was the outcome of a Special or a Summary Court Martial.)</h4>;
    const options = [
      { label: 'Yes', value: '1' },
      { label: 'No', value: '2' },
    ];

    return this.renderQuestion(key, label, options);
  }

  renderQuestionFour() {
    const key = '7_branchOfService';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const label = <h4>In which branch of service did you serve?</h4>;
    const options = [
      { label: 'Army', value: 'army' },
      { label: 'Navy', value: 'navy' },
      { label: 'Air Force', value: 'airForce' },
      { label: 'Coast Guard', value: 'coastGuard' },
      { label: 'Marines', value: 'marines' },
    ];

    return this.renderQuestion(key, label, options);
  }

  renderQuestionFive() {
    const key = '8_prevApplication';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const label = <h4>Have you previously applied for a discharge upgrade for this period of service?</h4>;
    const options = [
      { label: 'Yes', value: '1' },
      { label: 'No', value: '2' },
    ];

    return this.renderQuestion('8_prevApplication', label, options);
  }

  renderQuestionFiveA() {
    const key = '9_prevApplicationYear';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const prevApplicationYearLabel = <h4>What year did you make this application?</h4>;

    const labelYear = prevApplicationYearCutoff[this.props.formValues['1_reason']];

    const prevApplicationYearOptions = [
      { label: `${labelYear} or earlier`, value: '1' },
      { label: `After ${labelYear}`, value: '2' },
    ];

    return this.renderQuestion('9_prevApplicationYear', prevApplicationYearLabel, prevApplicationYearOptions);
  }

  renderQuestionFiveB() {
    const key = '10_prevApplicationType';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const prevApplicationTypeLabel = <h4>What type of application did you make?</h4>;

    const prevApplicationTypeOptions = [
      { label: 'I applied to a Discharge Review Board (DRB) for a Documentary Review', value: '1' },
      { label: 'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review', value: '2' },
      { label: 'I applied to a Board for Correction of Military/Naval Records (BCMR/BCNR)', value: '3' },
      { label: 'Not sure', value: '4' },
    ];

    return this.renderQuestion('10_prevApplicationType', prevApplicationTypeLabel, prevApplicationTypeOptions);
  }

  // TODO: Refactor this display logic for clarity, use a reusable pattern for display
  // and move labels into config file
  renderAnswerReview() {
    if (this.props.formValues.questions.slice(-1)[0] !== 'END') { return null; }

    return (
      <div className="review-answers">
        <h4>Review your answers</h4>
        <div className="va-introtext">
          <p>If any information below is incorrect, update your answers to get the best guidance for your discharge situation.</p>
        </div>
        <table>
          <tbody>
            {Object.keys(this.props.formValues).map(k => {
              if (k === 'questions') { return null; }

              const reviewLabel = answerReview(k, this.props.formValues);

              return (reviewLabel && shouldShowQuestion(k, this.props.formValues.questions) &&
                <tr key={k}>
                  <td><p>{reviewLabel}</p></td>
                  <td><a href="#" onClick={this.handleScrollTo} name={k}>Edit</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Link to="/guidance" className="usa-button-primary va-button">
          Get my guidance »
        </Link>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderQuestionOne()}
        {this.renderQuestionOneA()}
        {this.renderQuestionOneB()}
        {this.renderQuestionTwo()}
        {this.renderQuestionTwoB()}
        {this.renderQuestionThree()}
        {this.renderQuestionFour()}
        {this.renderQuestionFive()}
        {this.renderQuestionFiveA()}
        {this.renderQuestionFiveB()}
        {this.renderAnswerReview()}
      </div>
    );
  }
}

FormQuestions.propTypes = {
  updateField: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default FormQuestions;
