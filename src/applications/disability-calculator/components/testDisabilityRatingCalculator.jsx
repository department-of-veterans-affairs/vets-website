import React from 'react';
import { calculateRating, roundRating } from '../utils/helpers';
import '../sass/disability-calculator.scss';
import { CalculatedDisabilityRating } from './CalculatedDisabilityRating';
import { RatingRow } from './RatingRow';

export default class DisabilityRatingCalculator extends React.Component {
  constructor() {
    super();
    this.state = {
      ratings: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRatingCalculateChange = this.handleRatingCalculateChange.bind(
      this,
    );
    this.handleAddRating = this.handleAddRating.bind(this);
    this.handleRemoveRating = this.handleRemoveRating.bind(this);
    this.ratingRef = React.createRef();
  }

  handleClick = () => {
    this.child.ratingInput.focus();
  }

  handleRatingCalculateChange = idx => evt => {
    const newRatings = this.state.ratings.map((rating, sidx) => {
      if (idx !== sidx) return rating;
      return parseInt(evt.target.value);
    });

    this.setState({ ratings: newRatings });
    console.log("handleRatingCalculateChange ", this.state);

  };

  handleSubmit = evt => {
    const { ratings } = this.state;
    console.log('Your VA disability rating is ', calculateRating(ratings), '%');
    alert(`Your VA disability rating is ${calculateRating(ratings)} %`);
    // return calculateRating(ratings);
  };


  handleAddRating = (evt) => {
    let rating = evt.target.value
    console.log(this.state.ratings);
    this.setState({ ratings: this.state.ratings.concat(['']) })
    // this.setState({ ratings: [...this.state.ratings, rating] });
    console.log("handleAddRating ", this.state);

  };

  handleRemoveRating = idx => () => {
    this.setState({
      ratings: this.state.ratings.filter((s, sidx) => idx !== sidx),
    });
  };

  clearAll = () => {
    this.setState({
      ratings: []
    })
  };

  render() {

    return (
      <div className="disability-calculator">
        <div className="calc-header vads-u-padding-x--4">
          <h2 className="vads-u-padding-top--4">
            VA disability rating calculator
          </h2>
          <p>
            Use our calculator if you have more than one disability rating to
            determine your VA comined disability rating
          </p>
        </div>
        <div className="vads-l-grid-container">
          <div className="vads-l-row">
            <div className="vads-l-col--3 vads-u-padding-right--2">
              Disability rating
            </div>
            <div className="vads-l-col--8">Optional description</div>
          </div>
          {this.state.ratings.map((rating, idx) => (
            <RatingRow
              handleRatingCalculateChange={this.handleRatingCalculateChange(idx)}
              // handleRemoveRating={this.handleRemoveRating(idx)}
              value={rating}
            />

          ))}
          <div className="vads-l-grid-container">
            <div className="vads-l-row">
              <div className="vads-l-col--3">
                <button type="button" onClick={this.handleAddRating}>
                  <i className="fas fa-plus-circle" />
                </button>
                <a onClick={this.handleAddRating}>Add rating</a>
              </div>
              <div className="vads-l-col--8" />
            </div>
            <div className="vads-l-row">
              <div className="vads-l-col--3 vads-u-padding-right--2">
                <button
                  onClick={evt => {
                    this.handleSubmit(evt);
                  }}
                >
                  Calculate
                </button>
              </div>
              <div className="vads-l-col--8">
                <a onClick={this.clearAll}>Clear all</a>
              </div>
            </div>
          </div>
          {/* </form> */}
        </div>
      </div>
    );
  }
}
