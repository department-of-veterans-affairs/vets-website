import React from 'react';
import { range } from 'lodash';
import PropTypes from 'prop-types';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import { months } from '../../common/utils/options-for-select.js';
import { questionLabels } from '../config';
import { shouldShowQuestion } from '../utils';

class FormQuestions extends React.Component {
  updateField(name, value) {
    this.props.updateField(name, value);
    this.forceUpdate();
  }

  handleScrollTo = (e) => {
    e.preventDefault();
    window.scrollTo(this[e.target.name].offsetTop, 0);
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

    return <ErrorableRadioButtons {...radioButtonProps} ref={(el) => { this[name] = el; }}/>;
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
    // if (this.props.formValues['1_reason'] !== '3') { return null; }
    const key = '2_dischargeType';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const label = <h4>Which of the following categories best describes you?</h4>;
    const options = [
      { label: 'My discharge is Honorable or General Under Honorable Conditions, and I only want my narrative reason for discharge or enlistment code changed.', value: '1' },
      { label: 'My discharge status is not under honorable conditions.', value: '2' },
    ];
    return this.renderQuestion(key, label, options);
  }

  renderQuestionOneB() {
    // if (!this.props.formValues['1_reason'] || this.props.formValues['1_reason'] === '5') { return null; }
    const key = '3_intention';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) { return null; }

    const label = <h4>Do you want to change any portion of your record other than discharge status, re-enlistment code, and narrative reason for discharge? (For example, your name or remarks.)</h4>;
    const options = [
      { label: 'Yes, I want to change other information on my record, like my name or remarks.', value: '1' },
      { label: 'No, I only want to change my discharge status, re-enlistment code, and/or narrative reason for discharge.', value: '2' },
    ];
    return this.renderQuestion('3_intention', label, options);
  }

  renderQuestionTwo() {
    const dischargeYear = this.props.formValues['4_dischargeYear'];
    const yearOptions = range(16).map(i => {
      const year = (new Date()).getFullYear() - i;
      return { label: year.toString(), value: year.toString() };
    });

    yearOptions.push({ label: 'Before 2002', value: 'before_2002' });

    const label = (
      <legend className="legend-label">
        <h4>What year were you discharged from the military?</h4>
      </legend>
    );

    const yearSelect = (
      <fieldset className="fieldset-input dischargeYear" key="dischargeYear">
        <ErrorableSelect errorMessage={dischargeYear ? undefined : ''}
          autocomplete="false"
          label={label}
          name="4_dischargeYear"
          options={yearOptions}
          ref={(el) => { this['4_dischargeYear'] = el; }}
          value={{ value: dischargeYear }}
          onValueChange={(update) => { this.updateField('4_dischargeYear', update.value); }}/>
      </fieldset>
    );

    const monthLabel = (
      <legend className="legend-label">
        <h4>What month were you discharged?</h4>
      </legend>
    );

    const monthSelect = (
      <fieldset className="fieldset-input dischargeMonth" key="dischargeMonth">
        <ErrorableSelect errorMessage={dischargeYear ? undefined : ''}
          autocomplete="false"
          label={monthLabel}
          name="5_dischargeMonth"
          options={months}
          ref={(el) => { this['5_dischargeMonth'] = el; }}
          value={{ value: this.props.formValues['5_dischargeMonth'] }}
          onValueChange={(update) => { this.updateField('5_dischargeMonth', update.value); }}/>
      </fieldset>
    );

    const content = [yearSelect];

    if (dischargeYear === `${(new Date()).getFullYear() - 15}`) {
      content.push(monthSelect);
    }

    return (
      <div>
        {content}
      </div>
    );
  }

  renderQuestionThree() {
    const label = <h4>Was your discharge the outcome of a General Court Martial? (Answer “no” if your discharge was administrative, or was the outcome of a Special or a Summary Court Martial.)</h4>;
    const options = [
      { label: 'Yes', value: '1' },
      { label: 'No', value: '2' },
    ];

    return this.renderQuestion('6_courtMartial', label, options);
  }

  renderQuestionFour() {
    const label = <h4>In which branch of service did you serve?</h4>;
    const options = [
      { label: 'Army', value: 'army' },
      { label: 'Navy', value: 'navy' },
      { label: 'Air Force', value: 'airForce' },
      { label: 'Coast Guard', value: 'coastGuard' },
      { label: 'Marines', value: 'marines' },
    ];

    return this.renderQuestion('7_branchOfService', label, options);
  }

  renderQuestionFive() {
    const label = <h4>Have you previously applied for a discharge upgrade for this period of service?</h4>;
    const options = [
      { label: 'Yes', value: '1' },
      { label: 'No', value: '2' },
    ];

    const questions = [
      this.renderQuestion('8_prevApplication', label, options),
    ];

    if (this.props.formValues['8_prevApplication'] === '1' && parseInt(this.props.formValues['1_reason'], 10) < 5) {
      const prevApplicationYearLabel = <h4>What year did you make this application?</h4>;
      let labelYear;

      switch (this.props.formValues['8_prevApplication']) {
        case '1':
        case '2':
          labelYear = 2014;
          break;
        case '3':
          labelYear = 2011;
          break;
        case '4':
          labelYear = 2017;
          break;
        default:
          break;
      }

      const prevApplicationYearOptions = [
        { label: `${labelYear} or earlier`, value: `before_${labelYear}` },
        { label: `After ${labelYear}`, value: `after_${labelYear}` },
      ];

      questions.push(
        this.renderQuestion('9_prevApplicationYear', prevApplicationYearLabel, prevApplicationYearOptions),
      );
    }

    if (this.props.formValues['8_prevApplication'] === '1' && this.props.formValues['9_prevApplicationYear'] && this.props.formValues['9_prevApplicationYear'].indexOf('after') > -1) {
      const prevApplicationTypeLabel = <h4>What type of application did you make?</h4>;

      const prevApplicationTypeOptions = [
        { label: 'I applied to a Discharge Review Board (DRB) for a Documentary Review', value: 'drb' },
        { label: 'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review', value: 'drbPAR' },
        { label: 'I applied to a Board for Correction of Military/Naval Records (BCMR/BCNR)', value: 'bc' },
        { label: 'Not sure', value: 'notSure' },
      ];

      questions.push(
        this.renderQuestion('10_prevApplicationType', prevApplicationTypeLabel, prevApplicationTypeOptions),
      );
    }

    return (
      <div>
        {questions}
      </div>
    );
  }

  renderAnswerReview() {
    if (!this.props.formValues['8_prevApplication']) {
      return null;
    }

    return (
      <div className="review-answers">
        <h4>Review your answers</h4>
        <div className="va-introtext">
          <p>If any information below is incorrect, update your answers to get the best guidance for your discharge situation.</p>
        </div>
        <table className="usa-table-borderless">
          <tbody>
            {Object.keys(this.props.formValues).map(k => {
              const value = this.props.formValues[k];
              if (this.props.formValues['4_dischargeYear'] && k.indexOf('2') > -1) {
                const dischargeMonth = months.find(e => { return e.value.toString() === this.props.formValues['5_dischargeMonth']; });
                if (k === '4_dischargeYear' && dischargeMonth) { return null; }

                return (
                  <tr key={k}>
                    <td><p>I was discharged in {dischargeMonth && dischargeMonth.label} {this.props.formValues['4_dischargeYear']}</p></td>
                    <td><a href="#" onClick={this.handleScrollTo} name={k}>Edit</a></td>
                  </tr>
                );
              } else if (this.props.formValues['7_branchOfService'] && k.indexOf('4') > -1) {
                return (
                  <tr key={k}>
                    <td><p>I served in the {questionLabels[k][this.props.formValues['7_branchOfService']]}</p></td>
                    <td><a href="#" onClick={this.handleScrollTo} name={k}>Edit</a></td>
                  </tr>
                );
              } else if (value && questionLabels[k][value]) {
                return (
                  <tr key={k}>
                    <td><p>{questionLabels[k][value]}</p></td>
                    <td><a href="#" onClick={this.handleScrollTo} name={k}>Edit</a></td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
        <a className="usa-button-primary va-button">Get my guidance »</a>
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
        {this.renderQuestionThree()}
        {this.renderQuestionFour()}
        {this.renderQuestionFive()}
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
