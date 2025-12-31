import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';

import { getSchedulingPreferencesOptionInCopy } from 'platform/user/profile/vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import {
  FIELD_NAMES,
  FIELD_TITLE_DESCRIPTIONS,
} from 'platform/user/exportsFile';

// eslint-disable-next-line no-unused-vars
const ContactMethodConfirm = ({ pageData = {}, error, setPageData }) => {
  const data = pageData.data || {};
  const fieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;
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
  pageData: PropTypes.object.isRequired,
  setPageData: PropTypes.func.isRequired,
  error: PropTypes.bool,
};

export { ContactMethodConfirm };
