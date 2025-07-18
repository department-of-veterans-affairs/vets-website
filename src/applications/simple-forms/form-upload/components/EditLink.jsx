import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EditLink = ({ href, label }) => {
  const history = useHistory();

  function onClick(e) {
    e.preventDefault();
    history.push(href);
  }

  return <VaLink href={href} onClick={onClick} text="Edit" label={label} />;
};

export default EditLink;

EditLink.propTypes = {
  href: PropTypes.string,
  label: PropTypes.string,
};
