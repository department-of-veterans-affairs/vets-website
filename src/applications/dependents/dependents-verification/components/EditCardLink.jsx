import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { contactInfoXref } from '../util/contact-info';

/**
 * Edit card link component
 * @typedef {object} EditCardLinkProps
 * @property {string} value - current value
 * @property {string} name - contact information field name
 * @property {string} type - contact information type
 * @property {function} onClick - click handler
 *
 * @param {EditCardLinkProps} props - Component props
 * @returns {React.Component} - Edit card link component
 */
const EditCardLink = ({ value, name, type, onClick }) => {
  const { label, path } = contactInfoXref[name] || {};
  return (
    <VaLink
      active
      href={`/veteran-contact-information/${path}`}
      label={`${value ? 'Edit' : 'Add'} ${type || ''}${label}`}
      text={value ? 'Edit' : 'Add'}
      onClick={e => onClick(e, `/veteran-contact-information/${path}`)}
    />
  );
};

EditCardLink.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
};

export default EditCardLink;
