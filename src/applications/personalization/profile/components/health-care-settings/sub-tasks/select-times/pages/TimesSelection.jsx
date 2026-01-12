import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui/focus';
import { FIELD_NAMES } from 'platform/user/exportsFile';

const TimesSelection = ({ fieldName }) => {
  // const data = pageData.data || {};
  useEffect(() => {
    focusElement('h1');
  }, []);

  const text =
    fieldName === FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES
      ? 'go to your appointments'
      : 'us to contact you';

  return (
    <>
      <p>Select the days and times of day you want {text}.</p>
    </>
  );
};

TimesSelection.propTypes = {
  fieldName: PropTypes.string.isRequired,
  // pageData: PropTypes.object.isRequired,
  error: PropTypes.bool,
};

export default TimesSelection;
