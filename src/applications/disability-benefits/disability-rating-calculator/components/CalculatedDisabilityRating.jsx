import React from 'react';
import { focusElement } from 'platform/utilities/ui';

class CalculatedDisabilityRating extends React.Component {
  constructor(props) {
    super(props);
    this.resultsRef = React.createRef();
  }

  componentDidMount() {
    focusElement(this.resultsRef.current);
  }

  componentDidUpdate(previousProps) {
    if (previousProps.calculatedRating !== this.props.calculatedRating) {
      focusElement(this.resultsRef.current);
    }
  }

  render() {
    return (
      <div className="vads-u-margin-top--1">
        <div
          id="calculated-disability-rating"
          ref={this.resultsRef}
          className="vads-u-font-weight--bold"
        >
          <div>Your VA disability rating</div>
          <div className="vads-u-font-size--2xl vads-u-line-height--1">
            {this.props.calculatedRating.rounded}%
          </div>
        </div>
        <p>
          <strong>Note:</strong> The actual combined value of your disability
          ratings is {this.props.calculatedRating.exact}
          %.
        </p>
        <p>
          We round this value to the nearest 10% to get your VA disability
          rating. We then use this VA disability rating to determine your
          monthly disability compensation payment.
        </p>
        <p>
          If you have 2 or more disabilities that affect both sides of your
          body, this may increase your VA disability rating and compensation
          payment. Please refer to your VA disability compensation award letter
          for your official rating.
        </p>
        <a
          href="https://www.benefits.va.gov/compensation/rates-index.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Find your monthly payment amount
        </a>
      </div>
    );
  }
}

export default CalculatedDisabilityRating;
