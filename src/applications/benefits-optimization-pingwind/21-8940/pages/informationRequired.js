import React from 'react';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  checkboxRequiredSchema,
  checkboxUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const fieldNames = {
  fairInformationPractices: 'acknowledgeFairInformationPractices',
  privacyAct: 'acknowledgePrivacyActRights',
};

/** @type {PageSchema} */
export default {
  path: 'information-we-are-required-to-share',
  title: 'Information we are required to share',
  uiSchema: {
    'ui:title': 'Information we are required to share',
    'ui:order': [fieldNames.fairInformationPractices, fieldNames.privacyAct],
    [fieldNames.fairInformationPractices]: checkboxUI({
      title:
        'I understand that VA Form 21-8940 is a claim for compensation benefits based on unemployability.',
      required: () => true,
      marginTop: 0,
      description: (
        <VaSummaryBox
          id="information-use-summary"
          uswds
          class="vads-u-margin-bottom--2"
        >
          <h2 slot="headline">About VA Form 21-8940</h2>
          <p>
            Important: This is a claim for compensation benefits based on
            unemployability. When you complete this form you are claiming total
            disability because of a service-connected disability(ies) which
            has/have prevented you from securing or following any substantially
            gainful occupation. Answer all questions fully and accurately.
          </p>
        </VaSummaryBox>
      ),
      errorMessages: {
        enum: 'You must acknowledge how VA uses your information to continue.',
        required:
          'You must acknowledge that you understand the purpose of VA Form 21-8940',
      },
    }),
    [fieldNames.privacyAct]: checkboxUI({
      title:
        'I acknowledge that I have read the information about Social Security benefits. ',
      required: () => true,
      marginTop: 0,
      description: (
        <VaSummaryBox
          id="privacy-rights-summary"
          uswds
          class="vads-u-margin-bottom--2 vads-u-margin-top--4"
        >
          <h2 slot="headline">Social Security Benefits</h2>
          <p>
            Individuals who have a disability and meet medical criteria may
            qualify for Social Security or Supplemental Security Income
            disability benefits. If you would like more information about Social
            Security benefits, contact your nearest Social Security
            Administration (SSA) office. You can locate the address of the
            nearest SSA office at{' '}
            <a
              href="https://www.ssa.gov/locator"
              target="_blank"
              rel="noreferrer"
            >
              SSA.gov | Social Security Office locator
            </a>{' '}
            or call 1-800-772-1213 (Hearing Impaired TDD line 1-800-325-0778).
            You may also contact SSA by Internet at{' '}
            <a href="https://www.ssa.gov/" target="_blank" rel="noreferrer">
              SSA.gov
            </a>
            .
          </p>
        </VaSummaryBox>
      ),
      errorMessages: {
        enum: 'You must acknowledge your privacy rights to continue.',
        required:
          'You must acknowledge that you have read about Social Security benefits.',
      },
    }),
  },
  schema: {
    type: 'object',
    required: [fieldNames.fairInformationPractices, fieldNames.privacyAct],
    properties: {
      [fieldNames.fairInformationPractices]: checkboxRequiredSchema,
      [fieldNames.privacyAct]: checkboxRequiredSchema,
    },
  },
};
