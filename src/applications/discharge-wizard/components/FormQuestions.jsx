// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

// Relative Imports
import recordEvent from 'platform/monitoring/record-event';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import AnswerReview from './AnswerReview';
import Questions from './questions';
import { focusElement } from 'platform/utilities/ui';
import { questionLabels, prevApplicationYearCutoff } from '../constants';
import { shouldShowQuestion } from '../helpers';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

class FormQuestions extends Component {
  componentDidMount() {
    Scroll.animateScroll.scrollToTop();
    const el = document.getElementById('dw-home-link');
    focusElement(el);
  }

  updateField = (name, value) => {
    this.props.updateField(name, value);
    this.forceUpdate();
  };

  scrollToLast = action => {
    setTimeout(() => {
      const el = this.props.formValues.questions.slice(-1)[0];
      scroller.scrollTo(
        el,
        window.VetsGov?.scroll || {
          duration: 1000,
          smooth: true,
        },
      );

      if (typeof action === 'function') {
        action();
      }
    }, 100);
  };

  handleKeyDown = e => {
    // only scroll to next question if user tabs out of the current one
    if (
      !e.shiftKey &&
      e.keyCode === 9 &&
      ['INPUT', 'SELECT'].includes(document.activeElement.tagName)
    ) {
      const next = this.props.formValues.questions.slice(-1)[0];
      const curr = e.target.name;

      if (
        next &&
        curr &&
        parseInt(next.charAt(0), 10) > parseInt(curr.charAt(0), 10)
      ) {
        const el = this.props.formValues.questions.slice(-1)[0];
        this.scrollToLast(() => {
          (
            this[el].querySelector('input') || this[el].querySelector('select')
          ).focus();
        });
      }
    }
  };

  handleScrollTo = e => {
    e.preventDefault();

    recordEvent({ event: 'discharge-upgrade-review-edit' });

    scroller.scrollTo(
      e.target.name,
      window.VetsGov?.scroll || {
        duration: 1000,
        smooth: true,
        offset: -150,
      },
    );

    (
      document.querySelector(`input[name="${e.target.name}"]`) ||
      document.querySelector(`select[name="${e.target.name}"]`)
    ).focus();
  };

  renderQuestion = (name, label, options) => {
    const radioButtonProps = {
      name,
      label,
      options,
      key: name,
      onValueChange: v => {
        if (v.dirty) {
          this.updateField(name, v.value);
        }
      },
      onMouseDown: this.scrollToLast,
      onKeyDown: this.handleKeyDown,
      value: {
        value: this.props.formValues[name],
      },
    };

    return (
      <div
        ref={el => {
          this[name] = el;
        }}
      >
        <Element name={name} />
        <RadioButtons {...radioButtonProps} />
      </div>
    );
  };

  renderQuestionThreeA = () => {
    const key = '5_dischargeType';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) {
      return null;
    }

    const label = (
      <h4>Which of the following categories best describes you?</h4>
    );
    const options = [
      { label: questionLabels[key][1], value: '1' },
      { label: questionLabels[key][2], value: '2' },
    ];
    return this.renderQuestion(key, label, options);
  };

  renderQuestionThreeB = () => {
    const key = '6_intention';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) {
      return null;
    }
    // explicit override for dd214 condition
    if (this.props.formValues['4_reason'] === '8') {
      return null;
    }

    const label = (
      <h4>
        Do you want to change your name, discharge date, or anything written in
        the “other remarks” section of your DD214?
      </h4>
    );
    const options = [
      { label: `Yes, ${questionLabels[key][1]}`, value: '1' },
      { label: `No, ${questionLabels[key][2]}`, value: '2' },
    ];
    return this.renderQuestion(key, label, options);
  };

  renderQuestionFour = () => {
    const key = '7_courtMartial';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) {
      return null;
    }
    // explicit override for dd214 condition
    if (this.props.formValues['4_reason'] === '8') {
      return null;
    }

    const label = (
      <h4>
        Was your discharge the outcome of a <strong>general</strong>{' '}
        court-martial?
      </h4>
    );
    const options = [
      {
        label: 'Yes, my discharge was the outcome of a general court-martial.',
        value: '1',
      },
      {
        label:
          'No, my discharge was administrative or the outcome of a special or summary court-martial.',
        value: '2',
      },
      { label: "I'm not sure.", value: '3' },
    ];

    return this.renderQuestion(key, label, options);
  };

  renderQuestionFive = () => {
    const key = '8_prevApplication';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) {
      return null;
    }
    // explicit override for dd214 condition
    if (this.props.formValues['4_reason'] === '8') {
      return null;
    }

    const label = (
      <h4>
        Have you previously applied for and been denied a discharge upgrade for
        this period of service? Note: You can still apply. Your answer to this
        question simply changes where you send your application.
      </h4>
    );
    const options = [{ label: 'Yes', value: '1' }, { label: 'No', value: '2' }];

    return this.renderQuestion(key, label, options);
  };

  renderQuestionFiveA = () => {
    const key = '9_prevApplicationYear';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) {
      return null;
    }
    // explicit override for dd214 condition
    if (this.props.formValues['4_reason'] === '8') {
      return null;
    }

    const prevApplicationYearLabel = (
      <h4>What year did you apply for a discharge upgrade?</h4>
    );

    const labelYear =
      prevApplicationYearCutoff[this.props.formValues['4_reason']];

    const prevApplicationYearOptions = [
      { label: `${labelYear} or earlier`, value: '1' },
      { label: `After ${labelYear}`, value: '2' },
    ];

    return this.renderQuestion(
      key,
      prevApplicationYearLabel,
      prevApplicationYearOptions,
    );
  };

  renderQuestionFiveB = () => {
    const key = '10_prevApplicationType';
    if (!shouldShowQuestion(key, this.props.formValues.questions)) {
      return null;
    }

    const prevApplicationTypeLabel = (
      <h4>
        What type of application did you make to upgrade your discharge
        previously?
      </h4>
    );

    let boardLabel =
      'I applied to a Board for Correction of Military Records (BCMR)';
    if (
      ['navy', 'marines'].includes(this.props.formValues['1_branchOfService'])
    ) {
      boardLabel =
        'I applied to the Board for Correction of Naval Records (BCNR)';
    }

    const prevApplicationTypeOptions = [
      {
        label:
          'I applied to a Discharge Review Board (DRB) for a Documentary Review',
        value: '1',
      },
      {
        label:
          'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review in Washington, DC',
        value: '2',
      },
      { label: boardLabel, value: '3' },
      { label: "I'm not sure", value: '4' },
    ];

    return this.renderQuestion(
      key,
      prevApplicationTypeLabel,
      prevApplicationTypeOptions,
    );
  };

  renderQuestionFiveC = () => {
    const key = '11_failureToExhaust';
    const { formValues } = this.props;

    if (!shouldShowQuestion(key, formValues.questions)) {
      return null;
    }

    const prevApplicationTypeLabel = (
      <h4>
        Was your application denied due to “failure to exhaust other remedies”?
        Note: “Failure to exhaust other remedies” generally means you applied to
        the wrong board.
      </h4>
    );

    let boardLabel = 'BCMR';
    if (['navy', 'marines'].includes(formValues['1_branchOfService'])) {
      boardLabel = 'BCNR';
    }

    const prevApplicationTypeOptions = [
      {
        label: `Yes, the ${boardLabel} denied my application due to “failure to exhaust other remedies.”`,
        value: '1',
      },
      {
        label: `No, the ${boardLabel} denied my application for other reasons, such as not agreeing with the evidence in my application.`,
        value: '2',
      },
    ];

    return this.renderQuestion(
      key,
      prevApplicationTypeLabel,
      prevApplicationTypeOptions,
    );
  };

  renderQuestionSix = () => {
    const key = '12_priorService';

    if (!shouldShowQuestion(key, this.props.formValues.questions)) {
      return null;
    }
    // explicit override for dd214 condition
    if (this.props.formValues['4_reason'] === '8') {
      return null;
    }

    const questionLabel = (
      <h4>
        Did you complete a period of service in which your character of service
        was Honorable or General Under Honorable Conditions?
      </h4>
    );

    const questionOptions = [
      {
        label:
          'Yes, I have discharge paperwork documenting a discharge that is honorable or under honorable conditions.',
        value: '1',
      },
      {
        label:
          'Yes, I completed a prior period of service, but I did not receive discharge paperwork from that period.',
        value: '2',
      },
      {
        label: 'No, I did not complete an earlier period of service.',
        value: '3',
      },
    ];

    return this.renderQuestion(key, questionLabel, questionOptions);
  };

  render() {
    return (
      <div className="dw-questions">
        {Questions.map((Question, index) => (
          <Question
            key={index}
            formValues={this.props.formValues}
            handleKeyDown={this.handleKeyDown}
            scrollToLast={this.scrollToLast}
            updateField={this.updateField}
          />
        ))}
        {this.renderQuestionThreeA()}
        {this.renderQuestionThreeB()}
        {this.renderQuestionFour()}
        {this.renderQuestionFive()}
        {this.renderQuestionFiveA()}
        {this.renderQuestionFiveB()}
        {this.renderQuestionFiveC()}
        {this.renderQuestionSix()}
        <AnswerReview
          formValues={this.props.formValues}
          handleScrollTo={(this, this.handleScrollTo)}
        />
      </div>
    );
  }
}

FormQuestions.propTypes = {
  updateField: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default FormQuestions;
