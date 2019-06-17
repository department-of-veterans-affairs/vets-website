import React from 'react';

export const RatingRow = ({
  ratingObj,
  indx,
  handleChange,
  handleRemoveRating,
  ratingRef,
  canDelete,
}) => {
  const onRatingChange = e => {
    const val = e.target.value;
    const re = /^[0-9\b]+$/;

    if (re.test(val) || val === '') {
      handleChange(indx, {
        ...ratingObj,
        rating: val.length ? Number(val) : val,
      });
    }
  };

  const onDescriptionChange = e => {
    handleChange(indx, { ...ratingObj, description: e.target.value });
  };

  return (
    <div className="rating vads-l-row">
      <div className="vads-l-col--2 vads-u-padding-right--2">
        <input
          type="text"
          min="0"
          onChange={onRatingChange}
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
          onChange={onDescriptionChange}
          value={ratingObj.description}
        />
      </div>
      <div className="vads-l-col--2">
        {canDelete && (
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
