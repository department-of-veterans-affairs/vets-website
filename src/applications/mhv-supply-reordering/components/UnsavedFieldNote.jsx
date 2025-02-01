import React from 'react';
import PropTypes from 'prop-types';
import DlcTelephoneLink from './DlcTelephoneLink';

const UnsavedFieldNote = ({ fieldName }) => (
  <p className="vads-u-margin-y--3">
    Note: Any updates you make to your {fieldName} will only apply to this
    order. If you’d like to update for all future orders, you can either call us
    at <DlcTelephoneLink /> or change in your{' '}
    <a href="/profile/" target="_new">
      VA.gov profile
    </a>
    .
  </p>
);

UnsavedFieldNote.propTypes = {
  fieldName: PropTypes.string.isRequired,
};

export default UnsavedFieldNote;
