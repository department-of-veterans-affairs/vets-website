import React from 'react';
import PropTypes from 'prop-types';
// import FormRenderer from 'platform/form-renderer/FormRenderer'; // eslint-disable-next-line require-jsdoc

export default function App({ params }) {
  const { id } = params;
  return <div>{id}</div>;
}

App.propTypes = {
  children: PropTypes.node,
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
