import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { contactInfoXref } from '../util/contact-info';

const EditCardLink = ({ value, name, onClick }) => {
  const { label, path } = contactInfoXref[name] || {};
  return (
    <VaLink
      active
      href={`/veteran-contact-information/${path}`}
      label={`${value ? 'Edit' : 'Add'} ${label}`}
      text={value ? 'Edit' : 'Add'}
      onClick={e => onClick(e, `/veteran-contact-information/${path}`)}
    />
  );
};

EditCardLink.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
};

export default EditCardLink;
