import React from 'react';
import {
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  checkboxRequiredSchema,
  checkboxUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { employedByVAFields } from '../definitions/constants';

/** @returns {PageSchema} */
export default {
  uiSchema: {
    [employedByVAFields.parentObject]: {
      ...titleUI({
        title: 'Signature confirmation',
      }),
      'ui:order': [
        employedByVAFields.hasCertifiedSection3,
        employedByVAFields.hasUnderstoodSection3,
        'view:sectionThreePenaltyAlert',
        'view:sectionThreePrivacyAlert',
        'view:sectionThreeBurdenAlert',
      ],
      [employedByVAFields.hasCertifiedSection3]: checkboxUI({
        title:
          'I certify that I have not been employed by VA, others, or self-employed during the past twelve months.',
        description: (
          <div>
            <h3 className="vads-u-font-weight--bold vads-u-font-size--h4 vads-u-margin-bottom--1 vads-u-margin-top--0">
              I CERTIFY THAT I
            </h3>
            <p className="vads-u-margin-top--0">
              I have not been employed by VA, others or self-employed during the past twelve months.
            </p>
          </div>
        ),
        classNames:
          'vads-u-background-color--gray-lightest vads-u-padding--4 vads-u-margin-bottom--4',
        marginTop: null,
        required: () => true,
        errorMessages: {
          enum: 'You must certify that the statements above are true to continue.',
          required:
            'You must certify that the statements above are true to continue.',
        },
      }),

      [employedByVAFields.hasUnderstoodSection3]: checkboxUI({
        title:
          'I further certify that my disability has not improved and continues to prevent me from securing or following gainful employment.',
        description: (
          <div>
            <h3 className="vads-u-font-weight--bold vads-u-font-size--h4 vads-u-margin-bottom--1 vads-u-margin-top--0">
              I FURTHER CERTIFY THAT
            </h3>
            <p className="vads-u-margin-top--0">
              The items completed on this form are true and correct to the best of my knowledge and belief. I believe that my service-connected disability(ies) has not improved and continues to prevent me from securing or following gainful employment.
            </p>
          </div>
        ),
        classNames:
          'vads-u-background-color--gray-lightest vads-u-padding--4 vads-u-margin-bottom--4',
        marginTop: null,
        required: () => true,
        errorMessages: {
          enum: 'You must acknowledge that you understand this statement to continue.',
          required:
            'You must acknowledge that you understand this statement to continue.',
        },
      }),

      'view:sectionThreePenaltyAlert': {
        'ui:field': 'ViewField',
        'ui:description': (
          <VaAlert
            status="warning"
            class="vads-u-margin-top--3"
            uswds
            visible
          >
            <h3 slot="headline"><b>Penalty</b></h3>
            <p className="vads-u-margin--0">
              The law provides severe penalties which include fine or imprisonment or both for the willful submission of any statement or evidence of a material fact, knowing it to be false or for the fraudulent acceptance of any payment to which you are not entitled.
            </p>
          </VaAlert>
        ),
      },

      'view:sectionThreePrivacyAlert': {
        'ui:field': 'ViewField',
        'ui:description': (
          <VaAlert
            status="info"
            class="vads-u-margin-top--3"
            uswds
            visible
          >
            <h3 slot="headline"><b>Privacy Act Notice</b></h3>
            <p className="vads-u-margin--0">
              VA will not disclose information collected on this form to any source other than what has been authorized under the Privacy Act of 1974 or Title 38, Code of Federal Regulations 1.576 for routine uses (i.e., civil or criminal law enforcement, congressional communications, epidemiological or research studies, the collection of money owed to the United States, litigation in which the United States is a party or has an interest, the administration of VA programs and delivery of VA benefits, verification of identity and status, and personnel administration) as identified in the VA system of records, 58VA21/22/28, Compensation, Pension, Education, and Veteran Readiness and Employment Records - VA, published in the Federal Register. Your obligation to respond is required to obtain or retain benefits. The requested information is considered relevant and necessary to determine maximum benefits under the law. The responses you submit are considered confidential (38 U.S.C. 5701). Information submitted is subject to verification through computer matching programs with other agencies
            </p>
          </VaAlert>
        ),
      },

      'view:sectionThreeBurdenAlert': {
        'ui:field': 'ViewField',
        'ui:description': (
          <VaAlert
            status="info"
            class="vads-u-margin-top--3"
            uswds
            visible
          >
            <h3 slot="headline"><b>Respondent Burden:</b></h3>
            <p className="vads-u-margin--0">
               An agency may not conduct or sponsor, and a person is not required to respond to a collection of information unless it displays a currently valid OMB control Number. The OMB control number for this project is 2900-0079, and it expires 08/31/2027. Public reporting burden for this collection of information is estimated to average 5 minutes per respondent, per year, including the time for reviewing instructions, searching existing data sources, gathering and maintaining the data needed, and completing and reviewing the collection of information. Send comments regarding this burden estimate and any other aspect of this collection of information, including suggestions for reducing the burden to VA Reports Clearance Officer at VACOPaperworkReduAct@VA.gov. Please refer to OMB Control No. 2900-0079 in any correspondence. Do not send your completed VA Form 21-4140 to this email address.
            </p>
          </VaAlert>
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [employedByVAFields.parentObject]: {
        type: 'object',
        required: [
          employedByVAFields.hasCertifiedSection3,
          employedByVAFields.hasUnderstoodSection3,
        ],
        properties: {
          [employedByVAFields.hasCertifiedSection3]: checkboxRequiredSchema,
          [employedByVAFields.hasUnderstoodSection3]: checkboxRequiredSchema,
          'view:sectionThreePenaltyAlert': {
            type: 'object',
            properties: {},
          },
          'view:sectionThreePrivacyAlert': {
            type: 'object',
            properties: {},
          },
          'view:sectionThreeBurdenAlert': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};
