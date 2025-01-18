import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import {
  getRatings,
  getRatingErrorMessage,
  calculateCombinedRating,
} from '../utils/helpers';
import CalculatedDisabilityRating from './CalculatedDisabilityRating';
import RatingRow from './RatingRow';

const defaultDisabilities = [
  {
    rating: '',
    description: '',
    errorMessage: false,
  },
  {
    rating: '',
    description: '',
    errorMessage: false,
  },
];

export default class DisabilityRatingCalculator extends React.Component {
  constructor() {
    super();

    this.state = {
      disabilities: [...defaultDisabilities],
      showCombinedRating: false,
      calculatedRating: 0,
    };

    this.ratingInputRefs = [];
  }

  setRef = ref => {
    if (ref) this.ratingInputRefs.push(ref);
  };

  focusFirstRatingInput = () => this.ratingInputRefs[0].focus();

  focusLastRatingInput = () =>
    this.ratingInputRefs[this.ratingInputRefs.length - 1].focus();

  focusFirstInvalidInput = () => {
    const firstInvalidDisability = this.state.disabilities.findIndex(
      d => d.errorMessage,
    );
    this.ratingInputRefs[firstInvalidDisability].focus();
  };

  handleDisabilityChange = (index, updatedRow) => {
    const { disabilities, calculatedRating } = this.state;

    const previousRowValue = disabilities[index];

    disabilities[index] = updatedRow;

    const ratingChanged = previousRowValue.rating !== updatedRow.rating;

    this.setState({
      disabilities,
      calculatedRating: ratingChanged ? null : calculatedRating,
    });
  };

  handleSubmit = () => {
    const ratings = getRatings(this.state.disabilities);
    const disabilitiesValidated = this.state.disabilities.map(disability => ({
      ...disability,
      errorMessage: getRatingErrorMessage(disability.rating),
    }));

    const formIsInvalid = disabilitiesValidated.some(d => d.errorMessage);

    if (formIsInvalid) {
      this.setState(
        { disabilities: disabilitiesValidated },
        this.focusFirstInvalidInput,
      );
      return;
    }

    this.setState({
      showCombinedRating: true,
      disabilities: disabilitiesValidated,
      calculatedRating: calculateCombinedRating(ratings),
    });

    recordEvent({ event: 'widget-disability-ratings-calculator-calculate' });
  };

  handleAddRating = () => {
    const disabilities = [
      ...this.state.disabilities,
      {
        rating: '',
        description: '',
      },
    ];

    this.setState({ disabilities }, this.focusLastRatingInput);
  };

  handleRemoveDisability = idx => () => {
    const { disabilities } = this.state;
    this.ratingInputRefs.pop();
    disabilities.splice(idx, 1);
    this.setState({ disabilities }, this.focusLastRatingInput);
  };

  showRating = () => {
    this.setState({
      showCombinedRating: true,
    });
  };

  clearAll = () => {
    this.setState(
      {
        disabilities: [...defaultDisabilities],
        calculatedRating: 0,
        showCombinedRating: false,
      },
      this.focusFirstRatingInput,
    );
  };

  render() {
    const { disabilities } = this.state;
    const { calculatedRating } = this.state;
    const ratings = getRatings(disabilities);

    return (
      <div className="disability-calculator vads-u-padding-y--4 vads-u-margin-top--4 vads-u-background-color--gray-lightest">
        <div className="vads-u-padding-x--4">
          <h2 className="vads-u-margin-top--0">
            VA combined disability rating calculator
          </h2>
          <p>
            Enter each of your disability ratings separately below. You can also
            add a description of each for your notes, if you'd like. Then click{' '}
            <strong>Calculate</strong> to get your combined rating.{' '}
            <strong className="vads-u-display--inline mobile-lg:vads-u-display--none">
              Disability ratings are given in 10% increments, between 0 and 100.
            </strong>
            <span className="vads-u-display--none mobile-lg:vads-u-display--inline">
              Disability ratings are given in 10% increments, between 0 and 100.
            </span>
          </p>
          <div className="vads-l-grid-container--full">
            <div className="vads-l-row">
              <div
                className="vads-l-col--4 small-screen:vads-l-col--3 vads-u-padding-right--2"
                id="ratingLabel"
              >
                Disability rating
                <span className="vads-u-display--none mobile-lg:vads-u-display--block">
                  In 10% increments
                </span>
              </div>
              <div
                className="vads-l-col--6 small-screen:vads-l-col--6"
                id="descriptionLabel"
              >
                Optional description
              </div>
            </div>
          </div>
        </div>
        {disabilities.map((disability, idx) => (
          <RatingRow
            disability={disability}
            ref={this.setRef}
            key={idx}
            indx={idx}
            ratingRef={this.ratingRef}
            isDeletable={disabilities.length > 2}
            showErrors={this.state.showCombinedRating}
            updateDisability={this.handleDisabilityChange}
            removeDisability={this.handleRemoveDisability}
          />
        ))}
        <div className="vads-u-padding-x--4">
          <div>
            <button
              className="va-button-link vads-u-text-align--left vads-u-margin-y--1p5"
              type="button"
              onClick={this.handleAddRating}
              data-e2e="add"
            >
              <va-icon icon="add_circle" size={3} /> Add rating
            </button>
          </div>
          <div>
            <button
              type="button"
              className="usa-button vads-u-width--auto"
              onClick={this.handleSubmit}
              data-e2e="calculate"
            >
              Calculate
            </button>
            <button
              className="usa-button va-button-link vads-u-margin-y--1p5 vads-u-margin-left--2"
              onClick={this.clearAll}
              data-e2e="clearall"
            >
              Clear all
            </button>
          </div>
          {this.state.showCombinedRating === true && (
            <CalculatedDisabilityRating
              ratings={ratings}
              calculatedRating={calculatedRating}
            />
          )}
        </div>
      </div>
    );
  }
}
