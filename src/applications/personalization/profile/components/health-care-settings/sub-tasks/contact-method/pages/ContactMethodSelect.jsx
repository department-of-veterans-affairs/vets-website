import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui/focus';

import {
  FIELD_TITLES,
  FIELD_OPTION_IDS,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import {
  getSchedulingPreferencesOptionInCopy,
  schedulingPreferenceOptions,
} from 'platform/user/profile/vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import {
  FIELD_NAMES,
  FIELD_TITLE_DESCRIPTIONS,
} from 'platform/user/exportsFile';

const fieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;

const content = {
  title: 'How should we contact you to schedule your health care appointments?',
  description:
    'This helps us know the best way to contact you when we need to schedule, reschedule, or cancel your health care appointments.',
  errorMessage: 'Please select a contact method',
};

const optionsMap = schedulingPreferenceOptions(fieldName);
const options = Object.entries(optionsMap).map(([value, label]) => ({
  value: String(value),
  label,
}));
const optionValues = options.map(option => option.value);

const validate = data => optionValues.includes(data?.[fieldName]);

/**
 * Contact method selection page
 * @param {Object} data - subtask data
 * @param {Boolean} error - page submitted & error state
 * @param {Function} setPageData - updates subtask data
 * @returns {JSX}
 */
const ContactMethodSelect = ({ data = {}, error, setPageData }) => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  const handlers = {
    setContactMethod: event => {
      const { value } = event.detail;
      if (
        value ===
          FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .NO_PREFERENCE ||
        value ===
          FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
            .SECURE_MESSAGE
      ) {
        setPageData({ quickExit: true, [fieldName]: value });
      } else {
        setPageData({ quickExit: false, [fieldName]: value || null });
      }
    },
  };

  return (
    <>
      <VaSelect
        label={FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]}
        name={FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD}
        value={data[fieldName] || ''}
        error={error ? content.errorMessage : null}
        onVaSelect={handlers.setContactMethod}
        required
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </VaSelect>
    </>
  );
};

ContactMethodSelect.propTypes = {
  setPageData: PropTypes.func.isRequired,
  data: PropTypes.object,
  error: PropTypes.bool,
};

// eslint-disable-next-line no-unused-vars
const ContactMethodConfirm = ({ data = {}, error, setPageData }) => {
  useEffect(() => {
    focusElement('h1');
  }, []);

  const cardContent = {
    title: '',
    description: '',
    body: '',
  };
  switch (data[fieldName]) {
    case 'option-6':
      // 'no preference',
      break;
    case 'option-5':
      // 'contact email',
      cardContent.title = 'Contact email';
      cardContent.description = FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.EMAIL];
      cardContent.body = 'test@email.com';
      break;
    case 'option-38':
      // 'home phone',
      break;
    case 'option-1':
      // 'mobile phone'
      break;
    case 'option-39':
      // 'work phone',
      break;
    case 'option-2':
      // 'mobile phone
      break;
    case 'option-3':
      // 'secure message
      break;
    case 'option-4':
      // 'mailing address',
      break;
    default:
      return null;
  }

  return (
    <>
      <p>
        This is the{' '}
        {getSchedulingPreferencesOptionInCopy(fieldName, data[fieldName])} we
        have on file for you. If it’s correct, select{' '}
        <strong>Confirm information</strong>. If you need to update it here and
        in your profile, select <strong>Update information</strong>.
      </p>
      <va-card>
        <div>
          <h2 className="vads-u-font-size--h4 vads-u-margin-top--0">
            {cardContent.title}
          </h2>
          <p className="vads-u-color--gray">{cardContent.description}</p>
          <p className="vads-u-margin-bottom--0">{cardContent.body}</p>
        </div>
      </va-card>
    </>
  );
};

ContactMethodConfirm.propTypes = {
  setPageData: PropTypes.func.isRequired,
  data: PropTypes.object,
  error: PropTypes.bool,
};

export { ContactMethodConfirm, ContactMethodSelect, validate };
