import React from 'react';
import PropTypes from 'prop-types';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import recordEvent from 'platform/monitoring/record-event';
import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

import { LEGACY_APPEALS_URL } from '../../constants';
import pageNames from './pageNames';

const options = [
  { value: pageNames.legacyNo, label: 'No' },
  { value: pageNames.legacyYes, label: 'Yes' },
];

const name = 'higher-level-review-legacy';

const LegacyChoice = ({ setPageState, state = {} }) => {
  const handlers = {
    legacyLinkClick: () => {
      recordEvent({
        event: 'howToWizard-alert-link-click',
        'howToWizard-alert-link-click-label': 'legacy appeals',
      });
    },
    legacyRadioClick: ({ value }) => {
      recordEvent({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label':
          'Is this claim going through the legacy appeals process?',
        'form-field-value': value,
      });
      setPageState({ selected: value }, value);
    },
  };

  const label = (
    <p>
      Is this claim going through the{' '}
      <span className="sr-only">legacy appeals process?</span>
      <a href={LEGACY_APPEALS_URL} onClick={handlers.legacyLinkClick}>
        {srSubstitute(
          'legacy appeals process',
          'Learn more about the legacy appeals process',
        )}
      </a>
      <span aria-hidden="true">?</span>
    </p>
  );
  return (
    <div id={pageNames.legacyChoice} className="vads-u-margin-top--2">
      <RadioButtons
        name={name}
        id={name}
        label={label}
        options={options}
        onValueChange={handlers.legacyRadioClick}
        value={{ value: state.selected }}
        additionalFieldsetClass={`${name}-legacy vads-u-margin-top--0`}
        ariaDescribedby={[pageNames.legacyNo, pageNames.legacyYes]}
      />
    </div>
  );
};

LegacyChoice.propTypes = {
  setPageState: PropTypes.func,
  state: PropTypes.shape({}),
};

export default {
  name: pageNames.legacyChoice,
  component: LegacyChoice,
};
