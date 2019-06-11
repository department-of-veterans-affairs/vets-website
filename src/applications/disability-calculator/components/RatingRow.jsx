import React from 'react';

export const RatingRow = props => {
  // componentDidMount() {
  //     this.ratingInput.focus()
  // }

  // componentDidUpdate() {
  //     this.ratingInput.focus()
  // }
  const ratingObj = props.ratingObj;
  const indx = props.indx;
  const handleChange = props.handleChange;
  const handleRemoveRating = props.handleRemoveRating;
  const ratingRef = props.ratingRef;

  // eslint-disable-next-line no-console
  // console.log(ratingObj);
  return (
    <div className="rating vads-l-row">
      <div className="vads-l-col--2 vads-u-padding-right--2">
        <input
          type="text"
          min="0"
          onChange={e => !isNaN(e.target.value) && handleChange(e, indx)}
          className="ratingInput"
          maxLength="2"
          value={ratingObj.rating}
          //   ref={input => (this.ratingInput = input)}
          pattern="\d+"
          // pattern="/^[0-9\b]+$/;"
          name="rating"
          ref={ratingRef}
          // autoFocus
        />
      </div>
      <div className="vads-l-col--8">
        <input
          className="descriptionInput"
          name="description"
          onChange={e => handleChange(e, indx)}
          value={ratingObj.description}
        />
      </div>
      <div className="vads-l-col--2">
        {ratingObj.canDelete === true && (
          <div>
            <button
              type="button"
              onClick={handleRemoveRating(indx)}
              className="va-button-link delete-btn vads-u-padding--1p5"
            >
              <i className="fas fa-trash-alt vads-u-padding-right--0p5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
