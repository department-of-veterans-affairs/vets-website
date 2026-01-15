import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui/focus';
import {
  FIELD_ADDITIONAL_CONTENT,
  FIELD_OPTION_IDS_INVERTED,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import { capitalize } from 'lodash';

const TimesSelection = ({ fieldName }) => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  const options = FIELD_OPTION_IDS_INVERTED[fieldName];
  const structuredOptions = {};
  Object.entries(options).forEach(([optionId, label]) => {
    // skip entries that represent no preference
    if (/no preference/i.test(label)) return;

    // expected label format: 'MONDAY_MORNING' (constants) or similar
    const parts = label.split(/_|\s+/);
    const day = capitalize(parts[0]);
    const timeOfDay = capitalize(parts[1]);
    structuredOptions[day] = structuredOptions[day] || {};
    structuredOptions[day][timeOfDay] = optionId;
  });

  return (
    <>
      <p>{FIELD_ADDITIONAL_CONTENT[fieldName]}</p>
      <div>
        {Object.keys(structuredOptions).length > 0 && (
          <ul>
            {Object.entries(structuredOptions).map(([day, times]) => (
              <li key={day}>
                <strong>{day}:</strong>
                <ul>
                  {Object.entries(times).map(([time, id]) => (
                    <li key={time}>{`${time}: ${id}`}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

TimesSelection.propTypes = {
  fieldName: PropTypes.string.isRequired,
  // pageData: PropTypes.object.isRequired,
  error: PropTypes.bool,
};

export default TimesSelection;
