import React from 'react';
import PropTypes from 'prop-types';

const Errors = ({ userInput, searchInput }) => {
  let errorMessage;

  if (!userInput.trim().length) {
    errorMessage = `Enter a search term that contains letters or numbers to find what you're looking for.`;
  } else if (userInput.length > 255) {
    errorMessage =
      'The search is over the character limit. Shorten the search and try again.';
  } else {
    errorMessage = `We’re sorry. Something went wrong on our end, and your search
    didn't go through. Please try again.`;
  }

  return (
    <div className="columns vads-u-margin-bottom--4">
      {/* this is the alert box for when searches fail due to server issues */}
      <va-alert status="error" data-e2e-id="alert-box">
        <h2 slot="headline">Your search didn’t go through</h2>
        <p>{errorMessage}</p>
      </va-alert>
      {searchInput}
    </div>
  );
};

Errors.propTypes = {
  searchInput: PropTypes.node.isRequired,
  userInput: PropTypes.string.isRequired,
};

export default Errors;
