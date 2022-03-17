import React from 'react';
import PropTypes from 'prop-types';

export default function EditLinkText(props) {
  const { value } = props;
  return <>{value ? 'Edit' : 'Add'}</>;
}

EditLinkText.propTypes = {
  value: PropTypes.string,
};
