// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

// Relative Imports
import recordEvent from 'platform/monitoring/record-event';
import AnswerReview from './AnswerReview';
import Questions from './questions';
import { focusElement } from 'platform/utilities/ui';

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

  render() {
    return (
      <section className="dw-questions">
        {Questions.map((Question, index) => (
          <Question
            key={index + 1}
            formValues={this.props.formValues}
            handleKeyDown={this.handleKeyDown}
            scrollToLast={this.scrollToLast}
            updateField={this.updateField}
          />
        ))}
        <AnswerReview
          formValues={this.props.formValues}
          handleScrollTo={(this, this.handleScrollTo)}
        />
      </section>
    );
  }
}

FormQuestions.propTypes = {
  updateField: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default FormQuestions;
