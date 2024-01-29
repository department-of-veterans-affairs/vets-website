import React from 'react';
import merge from 'lodash/merge';
import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';
import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_3 } from '../../../constants';

const question = <h3>{CHAPTER_3.PHONE_EMAIL.TITLE}</h3>;

const yourPhoneAndEmailPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
    phone: merge(phoneUI(), { 'ui:options': { widgetClassNames: null } }),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['phone', 'emailAddress'],
    properties: {
      phone: {
        type: 'string',
        pattern: '^[0-9]{10}$',
      },
      emailAddress: {
        type: 'string',
        maxLength: 256,
        format: 'email',
      },
    },
  },
};

export default yourPhoneAndEmailPage;
