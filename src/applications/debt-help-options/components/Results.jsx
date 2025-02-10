import React from 'react';
import PropTypes from 'prop-types';

export default function Results(props) {
  const outcome =
    props.location && props.location.state && props.location.state.outcome;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Results</h2>
      {outcome ? (
        <div>
          <h3>{outcome.title}</h3>
          <div>{outcome.message}</div>
        </div>
      ) : (
        <p>No outcome found.</p>
      )}
    </div>
  );
}

Results.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      outcome: PropTypes.shape({
        title: PropTypes.string,
        message: PropTypes.string,
      }),
    }),
  }),
};
