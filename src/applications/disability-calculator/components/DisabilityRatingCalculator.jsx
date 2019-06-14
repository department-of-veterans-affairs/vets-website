import React from 'react';
import { calculateRating } from '../utils/helpers';
import { CalculatedDisabilityRating } from './CalculatedDisabilityRating';
import { RatingRow } from './RatingRow';
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

    this.ratingRef = React.createRef();
    this.focus = this.focus.bind(this);
  }

  componentDidMount() {
    if (this.state.ratings === 2) {
      setTimeout(() => {
        this.focus();
      }, 100);
    }
    this.ratingRef.current.focus();
  }

  focus = () => {
    this.ratingRef.current.focus();
  };

  handleClick = () => {
    this.ratingRef.current.focus();
  };

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
        canDelete: this.state.ratings.length > 1,
      },
    ];
    this.setState({ ratings });
    setTimeout(() => {
      this.focus();
    }, 100);
  };

  handleRemoveRating = idx => () => {
    this.setState({
      ratings: this.state.ratings.filter((s, sidx) => idx !== sidx),
    });
    setTimeout(() => {
      this.focus();
    }, 100);
  };

  showRating = () => {
    this.setState({
      showCombinedRating: true,
    });
  };

  clearAll = () => {
    this.setState({
      ratings: [...defaultRatings],
      calculatedRating: 0,
      showCombinedRating: false,
    });
    this.focus();
  };

  render() {
    const ratings = this.state.ratings;
    const calculatedRating = this.state.calculatedRating;

    return (
      <div className="disability-calculator vads-u-margin-bottom--5">
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
            <div className="vads-l-col--3 vads-u-padding-right--2">
              Disability rating
            </div>
            <div className="vads-l-col--8">Optional description</div>
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
            />
          ))}
          <div className="vads-l-row">
            <div className="vads-l-col--3">
              <button
                className="va-button-link add-btn vads-u-text-align--left vads-u-padding-y--1p5"
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
                id="calculate-btn"
                onClick={evt => {
                  this.handleSubmit(evt);
                }}
              >
                Calculate
              </button>
            </div>
            <div className="vads-u-margin-left--1">
              <button
                className="va-button-link clear-btn vads-u-padding-y--1p5"
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
