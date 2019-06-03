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
  // eslint-disable-next-line no-console
  // console.log(ratingObj);
  return (
    <div className="rating vads-l-row">
      <div className="vads-l-col--2 vads-u-padding-right--2">
        <input
          type="text"
          min="0"
          onChange={e => handleChange(e, indx)}
          className="ratingInput"
          maxLength="3"
          value={ratingObj.rating.toString()}
          //   ref={input => (this.ratingInput = input)}
          pattern="[\d]{5}(-[\d]{4})?"
          name="rating"
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
          <>
            <button type="button">
              <i className="fas fa-trash-alt" />
            </button>
            <a href="#">Delete</a>
          </>
        )}
      </div>
    </div>
  );
};
