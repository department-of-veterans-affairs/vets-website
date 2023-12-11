import React from 'react';
import merge from 'lodash/merge';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import ProfileLink from '../../../components/ProfileLink';
import { CHAPTER_4, contactOptions } from '../../../constants';

const question = <h4>{CHAPTER_4.PAGE_4.TITLE}</h4>;

const yourPhoneAndEmailPage = {
  uiSchema: {
    'ui:title': question,
    'ui:description': ProfileLink,
    mobilePhone: merge(phoneUI(), { 'ui:options': { widgetClassNames: null } }),
    emailAddress: emailUI(),
    howToContact: radioUI({
      title: CHAPTER_4.PAGE_4.QUESTION_3,
      labels: contactOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['mobilePhone', 'emailAddress', 'howToContact'],
    properties: {
      mobilePhone: {
        type: 'string',
        pattern: '^[0-9]{10}$',
      },
      emailAddress: {
        type: 'string',
        maxLength: 256,
        format: 'email',
      },
      howToContact: radioSchema(Object.keys(contactOptions)),
    },
  },
};

export default yourPhoneAndEmailPage;
