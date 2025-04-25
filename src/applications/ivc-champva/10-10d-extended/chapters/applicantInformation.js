import React from 'react';
import { cloneDeep } from 'lodash';
import {
  fullNameUI,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
import { applicantListSchema } from '../helpers/utilities';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export const applicantInfoIntroSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        ...titleUI(
          ({ formData }) => (
            <>
              <span className="dd-privacy-hidden">
                {applicantWording(formData)}
              </span>{' '}
              information - (Config Override Example)
            </>
          ),
          ({ formData }) => (
            <>
              Next we’ll ask more questions about{' '}
              <span className="dd-privacy-hidden">
                {applicantWording(formData, false, false)}
              </span>
              . This includes social security number, mailing address, contact
              information, relationship to the sponsor, and health insurance
              information.
            </>
          ),
        ),
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    'view:description': blankSchema,
  }),
};
