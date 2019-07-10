import React from 'react';

const RatingRow = ({
  disability,
  indx,
  updateDisability,
  removeDisability,
  inputRef,
  disabled,
}) => {
  const onRatingChange = e => {
    const val = e.target.value;
    const re = /^[0-9\b]+$/;

    if (re.test(val) || val === '') {
      updateDisability(indx, {
        ...disability,
        rating: val.length ? Number(val) : val,
      });
    }
  };

  const onDescriptionChange = e => {
    updateDisability(indx, { ...disability, description: e.target.value });
  };

  const rowId = `disability-row-${indx + 1}`;

  return (
    <div className="rating vads-l-row">
      <span id={rowId} className="sr-only">
        row {indx + 1}
      </span>
      <div className="vads-l-col--2 vads-u-padding-right--2">
        <input
          type="text"
          min="0"
          onChange={onRatingChange}
          className="ratingInput"
          maxLength="2"
          value={disability.rating}
          pattern="\d+"
          name="rating"
          ref={inputRef}
          aria-labelledby={`ratingLabel ${rowId}`}
        />
      </div>
      <div className="vads-l-col--6">
        <input
          className="descriptionInput"
          name="description"
          onChange={onDescriptionChange}
          value={disability.description}
          aria-labelledby={`descriptionLabel ${rowId}`}
        />
      </div>
      <div className="vads-l-col--3">
        <div>
          <button
            type="button"
            aria-label={`Delete disability rating row ${indx + 1}`}
            onClick={removeDisability(indx)}
            className="va-button-link delete-btn vads-u-margin--1p5"
            disabled={disabled}
          >
            <i className="fas fa-trash-alt vads-u-padding-right--0p5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef((props, ref) => (
  <RatingRow inputRef={ref} {...props} />
));
