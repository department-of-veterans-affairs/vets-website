import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import {
  VaCheckbox,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui/focus';
import {
  FIELD_ADDITIONAL_CONTENT,
  FIELD_OPTION_IDS_INVERTED,
  errorMessages,
} from '@@vap-svc/constants/schedulingPreferencesConstants';

const TimesSelection = ({ error, fieldName, pageData, setPageData }) => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  const content = {
    errorMessage: errorMessages.noPreferenceSelected,
  };

  const options = FIELD_OPTION_IDS_INVERTED[fieldName];
  const structuredOptions = {};

  const onGroupChange = event => {
    const isChecked = event.target.checked;

    if (isChecked) {
      pageData.data[fieldName].push(event.target.value);
    } else {
      const index = pageData.data[fieldName].indexOf(event.target.value);
      if (index > -1) {
        pageData.data[fieldName].splice(index, 1);
      }
    }
    setPageData({ ...pageData });
  };

  Object.entries(options).forEach(([optionId, label]) => {
    // skip entries that represent no preference
    if (/no preference/i.test(label)) return;

    const parts = label.split(/_|\s+/);
    const day = capitalize(parts[0]);
    const timeOfDay = capitalize(parts[1]);
    structuredOptions[day] = structuredOptions[day] || {};
    structuredOptions[day][timeOfDay] = optionId;
  });

  return (
    <VaCheckboxGroup
      label={FIELD_ADDITIONAL_CONTENT[fieldName]}
      onVaChange={onGroupChange}
      error={error ? content.errorMessage : null}
      required
    >
      {Object.entries(structuredOptions).map(([day, times]) => (
        <React.Fragment key={day}>
          <p>{day}</p>
          {Object.entries(times).map(([time, id]) => (
            <VaCheckbox
              key={`${time}-${id}`}
              name={fieldName}
              value={id}
              label={time}
              ariaLabel={`${day} ${time}`}
              checked={pageData.data[fieldName].includes(id)}
            />
          ))}
        </React.Fragment>
      ))}
    </VaCheckboxGroup>
  );
};

TimesSelection.propTypes = {
  error: PropTypes.bool.isRequired,
  fieldName: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  setPageData: PropTypes.func.isRequired,
};

export default TimesSelection;
