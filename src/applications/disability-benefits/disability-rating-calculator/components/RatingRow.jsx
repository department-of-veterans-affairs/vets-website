import React from 'react';

class RatingRow extends React.Component {
  onRatingChange = e => {
    const val = e.target.value;
    const re = /^[0-9\b]+$/;

    if (re.test(val) || val === '') {
      this.props.updateDisability(this.props.indx, {
        ...this.props.disability,
        rating: val.length ? Number(val) : val,
      });
    }
  };

  onDescriptionChange = e => {
    this.props.updateDisability(this.props.indx, {
      ...this.props.disability,
      description: e.target.value,
    });
  };

  render() {
    const rowId = `disability-row-${this.props.indx + 1}`;

    return (
      <div className="rating vads-l-row">
        <span id={rowId} className="sr-only">
          row {this.props.indx + 1}
        </span>
        <div className="vads-l-col--4 small-screen:vads-l-col--3 vads-u-padding-right--2">
          <input
            type="number"
            className="ratingInput"
            name="rating"
            min="10"
            max="99"
            ref={this.props.inputRef}
            onChange={this.onRatingChange}
            value={this.props.disability.rating}
            aria-labelledby={`ratingLabel ${rowId}`}
          />
        </div>
        <div className="vads-l-col--6 small-screen:vads-l-col--6">
          <input
            className="descriptionInput"
            name="description"
            onChange={this.onDescriptionChange}
            value={this.props.disability.description}
            aria-labelledby={`descriptionLabel ${rowId}`}
          />
        </div>
        <div className="vads-l-col--2 small-screen:vads-l-col--3">
          <div>
            <button
              type="button"
              aria-label={`Delete disability rating row ${this.props.indx + 1}`}
              onClick={this.props.removeDisability(this.props.indx)}
              className="va-button-link usa-button vads-u-margin--1p5"
              disabled={this.props.disabled}
            >
              <i className="fas fa-trash-alt vads-u-padding-right--0p5" />
              <span className="vads-u-display--none medium-screen:vads-u-display--inline">
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <RatingRow inputRef={ref} {...props} />
));
