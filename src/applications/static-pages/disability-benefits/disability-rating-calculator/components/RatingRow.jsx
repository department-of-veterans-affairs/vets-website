import React from 'react';
import classNames from 'classnames';

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
    const containerClasses = classNames(
      'vads-u-padding-x--4 vads-u-margin-y--1',
      this.props.disability.errorMessage
        ? 'vads-u-border-left--4px vads-u-border-color--secondary-dark'
        : null,
    );

    const ratingInputClasses = classNames(
      'ratingInput',
      this.props.disability.errorMessage
        ? 'vads-u-border--3px vads-u-border-color--secondary-dark'
        : null,
    );

    return (
      <div className={containerClasses}>
        {this.props.disability.errorMessage && (
          <>
            <span className="usa-input-error-label">
              {this.props.disability.errorMessage.title}
            </span>
            <span className="usa-input-error-message" role="alert">
              {this.props.disability.errorMessage.body}
            </span>
          </>
        )}
        <div className="vads-l-grid-container--full">
          <div className={`rating row-${this.props.indx + 1} vads-l-row`}>
            <span id={rowId} className="sr-only">
              row {this.props.indx + 1}
            </span>
            <div className="vads-l-col--4 small-screen:vads-l-col--3 vads-u-padding-right--2">
              <input
                type="number"
                className={ratingInputClasses}
                name="rating"
                min="10"
                max="99"
                step="10"
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
                  aria-label={`Delete disability rating row ${this.props.indx +
                    1}`}
                  className="va-button-link usa-button vads-u-margin--1p5"
                  onClick={this.props.removeDisability(this.props.indx)}
                  disabled={!this.props.isDeletable}
                  data-e2e="delete"
                >
                  <va-icon icon="delete" size={3} />
                  <span className="vads-u-display--none medium-screen:vads-u-display--inline">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <RatingRow inputRef={ref} {...props} />
));
