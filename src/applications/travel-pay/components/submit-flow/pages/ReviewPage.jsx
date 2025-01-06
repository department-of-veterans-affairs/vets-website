import React from 'react';
import PropTypes from 'prop-types';

const ReviewPage = ({ handlers }) => {
  return (
    <div>
      <h1 className="vad-u-margin-top--0">Review your travel claim</h1>
      <p>Confirm the information is correct before you submit your claim.</p>

      <div className="vads-u-margin-y--2">
        <va-button text="Back" onClick={e => handlers.onBack(e)} />
        <va-button text="Submit" onClick={e => handlers.onSubmit(e)} />
      </div>
    </div>
  );
};

ReviewPage.propTypes = {
  handlers: PropTypes.shape({
    onBack: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
};

export default ReviewPage;
