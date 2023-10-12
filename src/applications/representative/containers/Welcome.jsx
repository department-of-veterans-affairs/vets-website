import React from 'react';
import PropTypes from 'prop-types';

export default function Welcome({ router }) {
  const handleSearchRedirect = e => {
    e.preventDefault();
    router.replace('/search');
  };
  return (
    <>
      <button type="button" onClick={handleSearchRedirect}>
        To search page{' '}
      </button>
    </>
  );
}

Welcome.propTypes = {
  router: PropTypes.object,
};
