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
    const formWasSubmitted =
      this.props.calculatedRating &&
      previousProps.calculatedRating !== this.props.calculatedRating;

    if (formWasSubmitted) {
      focusElement(this.resultsRef.current);
    }
  }

  render() {
    const { calculatedRating } = this.props;
    const placeholder = '--';

    return (
      <div className="vads-u-margin-top--1">
        <div
          id="calculated-disability-rating"
          ref={this.resultsRef}
          className="vads-u-font-weight--bold"
        >
          <div>Your VA disability rating</div>
          <div
            className="vads-u-font-size--2xl vads-u-line-height--1"
            data-e2e="combined-rating"
          >
            {calculatedRating ? calculatedRating.rounded : placeholder}%
          </div>
        </div>
        <p>
          <strong>Note:</strong> The actual combined value of your disability
          ratings is {calculatedRating ? calculatedRating.exact : placeholder}
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
          href="/disability/compensation-rates/"
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
