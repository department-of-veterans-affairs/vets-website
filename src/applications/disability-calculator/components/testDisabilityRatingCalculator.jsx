import React from 'react';
import { calculateRating, roundRating } from '../utils/helpers';

export default class DisabilityRatingCalculator extends React.Component {
  constructor() {
    super();
    this.state = {
      ratings: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRatingNameChange = this.handleRatingNameChange.bind(this);
    // this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleAddRating = this.handleAddRating.bind(this);
    this.handleRemoveRating = this.handleRemoveRating.bind(this);
  }


  // handleRatingChange = evt => {
  //   this.setState({ rating: evt.target.value });
  // };

  handleRatingNameChange = idx => evt => {
    const newRatings = this.state.ratings.map((rating, sidx) => {
      if (idx !== sidx) return parseInt(rating);
      return parseInt(evt.target.value);
    });

    this.setState({ ratings: newRatings });
  };

  handleSubmit = evt => {
    const { ratings } = this.state;
    console.log("Your VA disability rating is ", calculateRating(ratings), "%")
    alert(`Your VA disability rating is ${calculateRating(ratings)} %`);
  };

  handleAddRating = () => {
    console.log(this.state.ratings)
    this.setState({ ratings: [...this.state.ratings, ''] })
  };

  handleRemoveRating = idx => () => {
    this.setState({
      ratings: this.state.ratings.filter((s, sidx) => idx !== sidx)
    });
  };



  render() {
    return (
      <div>

        <h4>VA disability rating calculator</h4>

        {this.state.ratings.map((rating, idx) => (
          <div className="rating" key={idx}>
            <input
              type="text"
              placeholder={`rating #${idx + 1}`}
              value={rating.value}
              onChange={this.handleRatingNameChange(idx)}
            />
            <button
              type="button"
              onClick={this.handleRemoveRating(idx)}
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={this.handleAddRating}
        ><i className="fas fa-plus-circle"></i>
        </button><a onClick={(e) => this.handleAddRating}>Add rating</a>
        <button onClick={(evt) => { this.handleSubmit(evt) }}>Calculate</button>
      </div>
    );
  }
}