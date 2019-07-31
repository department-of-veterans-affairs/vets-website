import React from 'react';
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
    const disabilities = this.state.disabilities;
    disabilities[index] = updatedRow;
    this.setState({ disabilities });
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
    const disabilities = this.state.disabilities;
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
    const disabilities = this.state.disabilities;
    const calculatedRating = this.state.calculatedRating;
    const ratings = getRatings(disabilities);

    return (
      <div className="disability-calculator vads-u-padding-y--4 vads-u-background-color--gray-lightest">
        <div className="vads-u-padding-x--4">
          <h4 className="vads-u-font-size--h2 vads-u-margin--0">
            VA combined disability rating calculator
          </h4>
          <p>
            If you have 2 or more disability ratings, use our calculator to
            determine your combined disability rating. Enter each of your
            disability ratings separately below. You can also add a description
            of each for your notes, if you'd like. Then click Calculate to get
            your combined rating.
          </p>
          <div className="vads-l-grid-container--full">
            <div className="vads-l-row">
              <div
                className="vads-l-col--4 small-screen:vads-l-col--3 vads-u-padding-right--2"
                id="ratingLabel"
              >
                Disability rating
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
              <i className="fas fa-plus-circle vads-u-padding-right--0p5" />
              Add rating
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
