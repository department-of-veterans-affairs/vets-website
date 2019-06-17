import React from 'react';
import { calculateRating } from '../utils/helpers';
import { CalculatedDisabilityRating } from './CalculatedDisabilityRating';
import RatingRow from './RatingRow';
import '../sass/disability-calculator.scss';

const defaultRatings = [
  {
    rating: '',
    description: '',
  },
  {
    rating: '',
    description: '',
  },
];

export default class DisabilityRatingCalculator extends React.Component {
  constructor() {
    super();

    this.state = {
      ratings: [...defaultRatings],
      showCombinedRating: false,
      calculatedRating: 0,
    };

    this.ratingInputRefs = [];
  }

  componentDidMount() {
    this.focusFirstRatingInput();
  }

  setRef = ref => {
    if (ref) this.ratingInputRefs.push(ref);
  };

  focusFirstRatingInput = () => this.ratingInputRefs[0].focus();

  focusLastRatingInput = () =>
    this.ratingInputRefs[this.ratingInputRefs.length - 1].focus();

  handleRowChange = (index, updatedRow) => {
    const ratings = this.state.ratings;
    ratings[index] = updatedRow;
    this.setState({ ratings });
  };

  handleSubmit = () => {
    const ratings = this.state.ratings;
    const calcRating = calculateRating(ratings);

    this.setState({
      showCombinedRating: true,
      calculatedRating: calcRating,
    });
  };

  handleAddRating = () => {
    const ratings = [
      ...this.state.ratings,
      {
        rating: '',
        description: '',
      },
    ];

    this.setState({ ratings }, this.focusLastRatingInput);
  };

  handleRemoveRating = idx => () => {
    const ratings = this.state.ratings;
    this.ratingInputRefs.pop();
    ratings.splice(idx, 1);
    this.setState({ ratings }, this.focusLastRatingInput);
  };

  showRating = () => {
    this.setState({
      showCombinedRating: true,
    });
  };

  clearAll = () => {
    this.setState(
      {
        ratings: [...defaultRatings],
        calculatedRating: 0,
        showCombinedRating: false,
      },
      this.focusFirstRatingInput,
    );
  };

  render() {
    const ratings = this.state.ratings;
    const calculatedRating = this.state.calculatedRating;

    return (
      <div className="disability-calculator vads-u-margin-bottom--5 vads-u-background-color--gray-lightest vads-l-grid-container">
        <div className="calc-header vads-u-padding-x--4">
          <h2 className="vads-u-padding-top--4">
            VA combined disability rating calculator
          </h2>
          <p>
            If you have 2 or more disability ratings, use our calculator to
            determine your combined disability rating. Enter each of your
            disability ratings separately below. You can also add a description
            of each for your notes, if you'd like. Then click Calculate to get
            your combined rating.
          </p>
          <br />
        </div>
        <div className="vads-l-grid-container">
          <div className="vads-l-row">
            <div
              className="vads-l-col--2 vads-u-padding-right--2"
              id="ratingLabel"
            >
              Disability rating
              <span className="sr-only">Enter Disability Rating</span>
            </div>
            <div className="vads-l-col--8" id="descriptionLabel">
              Optional description
              <span className="sr-only">
                Enter Optional Disability Description
              </span>
            </div>
          </div>
          {this.state.ratings.map((ratingObj, idx) => (
            <RatingRow
              handleChange={this.handleRowChange}
              ratingObj={ratingObj}
              key={idx}
              indx={idx}
              ratingRef={this.ratingRef}
              handleRemoveRating={this.handleRemoveRating}
              canDelete={idx > 1}
              ref={this.setRef}
            />
          ))}
          <div className="vads-l-row">
            <div className="vads-l-col--3">
              <button
                className="va-button-link add-btn vads-u-text-align--left vads-u-margin-y--1p5"
                type="button"
                onClick={this.handleAddRating}
              >
                <i className="fas fa-plus-circle vads-u-padding-right--0p5" />
                Add rating
              </button>
            </div>
            <div className="vads-l-col--8" />
          </div>
          <br />
          <div className="vads-l-row">
            <div>
              <button
                className="calculate-btn"
                onClick={evt => {
                  this.handleSubmit(evt);
                }}
              >
                Calculate
              </button>
            </div>
            <div className="vads-u-margin-left--1">
              <button
                className="va-button-link clear-btn vads-u-margin-y--1p5"
                onClick={this.clearAll}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        {this.state.showCombinedRating === true && (
          <CalculatedDisabilityRating
            ratings={ratings}
            calculatedRating={calculatedRating}
          />
        )}
      </div>
    );
  }
}
