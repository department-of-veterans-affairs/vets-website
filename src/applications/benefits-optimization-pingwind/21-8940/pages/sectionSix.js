import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  checkboxRequiredSchema,
  checkboxUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Section VI: Authorization, Certification, and Signature'),
    'ui:description': (
      <div>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline" className="vads-u-font-weight--bold">
            What to expect:
          </h2>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>Authorize the release of your application</li>
              <li>Certify the information you have included is true</li>
              <li>Review important legal disclaimers</li>
              <li>Review all your information</li>
              <li>Electronically sign and submit</li>
              <li>Takes about 2-5 minutes</li>
            </ul>
          </div>
        </VaAlert>
        <div className="vads-u-margin-top--5">
          <p className="vads-u-font-weight--bold vads-u-margin-top--0">
            Acknowledgements
          </p>
          <p>
            Read and agree to the following authorization and certification
            statements, and review the legal information presented.
          </p>
        </div>
      </div>
    ),
    'ui:order': [
      'authorizationRelease',
      'certificationStatements',
      'serviceConnectedStatements',
      'view:sectionSixPenaltyAlert',
      'view:sectionSixPrivacyAlert',
      'view:sectionSixBurdenAlert',
    ],
    'view:sectionSixPenaltyAlert': {
      'ui:field': 'ViewField',
      'ui:description': (
        <VaAlert status="warning" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline" className="vads-u-font-weight--bold">
            Penalty
          </h2>
          <p className="vads-u-margin--0">
            The law provides severe penalties which include fine or imprisonment
            or both for the willful submission of any statement or evidence of a
            material fact, knowing it to be false or for the fraudulent
            acceptance of any payment to which you are not entitled.
          </p>
        </VaAlert>
      ),
    },
    'view:sectionSixPrivacyAlert': {
      'ui:field': 'ViewField',
      'ui:description': (
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h3 slot="headline" className="vads-u-font-weight--bold">
            Privacy Act Notice
          </h3>
          <p className="vads-u-margin--0">
            VA will not disclose information collected on this form to any
            source other than what has been authorized under the Privacy Act of
            1974 or Title 38, Code of Federal Regulations 1.576 for routine uses
            (i.e., civil or criminal law enforcement, congressional
            communications, epidemiological or research studies, the collection
            of money owed to the United States, litigation in which the United
            States is a party or has an interest, the administration of VA
            programs and delivery of VA benefits, verification of identity and
            status, and personnel administration) as identified in the VA system
            of records, 58VA21/22/28, Compensation, Pension, Education, and
            Veteran Readiness and Employment Records - VA, published in the
            Federal Register. Your obligation to respond is required to obtain
            or retain benefits. The requested information is considered relevant
            and necessary to determine maximum benefits under the law. The
            responses you submit are considered confidential (38 U.S.C. 5701).
            Information submitted is subject to verification through computer
            matching programs with other agencies
          </p>
        </VaAlert>
      ),
    },
    'view:sectionSixBurdenAlert': {
      'ui:field': 'ViewField',
      'ui:description': (
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h3 slot="headline" className="vads-u-font-weight--bold">
            Respondent Burden
          </h3>
          <p className="vads-u-margin--0">
            An agency may not conduct or sponsor, and a person is not required
            to respond to a collection of information unless it displays a
            currently valid OMB control Number. The OMB control number for this
            project is 2900-0079, and it expires 08/31/2027. Public reporting
            burden for this collection of information is estimated to average 5
            minutes per respondent, per year, including the time for reviewing
            instructions, searching existing data sources, gathering and
            maintaining the data needed, and completing and reviewing the
            collection of information. Send comments regarding this burden
            estimate and any other aspect of this collection of information,
            including suggestions for reducing the burden to VA Reports
            Clearance Officer at VACOPaperworkReduAct@VA.gov. Please refer to
            OMB Control No. 2900-0079 in any correspondence. Do not send your
            completed VA Form 21-8940 to this email address.
          </p>
        </VaAlert>
      ),
    },
    authorizationRelease: checkboxUI({
      title:
        'I have read and understand the Authorization for Release of Information.',
      description: (
        <div>
          <p className="vads-u-font-weight--bold vads-u-margin-bottom--1 vads-u-margin-top--0">
            Authorization for Release of Information
          </p>
          <p className="vads-u-margin-top--0">
            I authorize the person or entity, including but not limited to any
            organization, service provider, employer, or Government agency, to
            give the Department of Veterans Affairs any information about me
            except protected health information, and I waive any privilege which
            makes the information confidential.
          </p>
        </div>
      ),
      classNames:
        'vads-u-background-color--gray-lightest vads-u-padding--4 vads-u-margin-bottom--4',
      marginTop: null,
      required: () => true,
      errorMessages: {
        enum: 'You must acknowledge the authorization to continue.',
        required: 'You must acknowledge the authorization to continue.',
      },
      label:
        'I have read and understand the Authorization for Release of Information',
    }),
    certificationStatements: checkboxUI({
      title: 'I have read and understand the Certification of Statements.',
      description: (
        <div>
          <p className="vads-u-font-weight--bold vads-u-margin-bottom--1 vads-u-margin-top--0">
            Certification of Statements
          </p>
          <p className="vads-u-margin-top--0">
            I CERTIFY THAT as a result of my service-connected disabilities, I
            am unable to secure or follow any substantially gainful occupation
            and that the statements in this application are true and complete to
            the best of my knowledge and belief, I understand that these
            statements will be considered in determining my eligibility for VA
            benefits based on unemployability because of service-connected
            disability
          </p>
        </div>
      ),
      classNames:
        'vads-u-background-color--gray-lightest vads-u-padding--4 vads-u-margin-bottom--4',
      marginTop: null,
      required: () => true,
      errorMessages: {
        enum: 'You must acknowledge the certification to continue.',
        required: 'You must acknowledge the certification to continue.',
      },
      label: 'I have read and understand the Certification of Statements',
    }),
    serviceConnectedStatements: checkboxUI({
      title:
        'I have read and understand the information about total disability benefits.',
      description: (
        <div>
          <p className="vads-u-font-weight--bold vads-u-margin-bottom--1 vads-u-margin-top--0">
            Important Information About Total Disability Benefits
          </p>
          <p className="vads-u-margin-top--0">
            I understand that if I am granted service-connected total disability
            benefits based on my unemployability, I must immediately inform VA
            if I return to work. I also understand that total disability
            benefits paid to me after I begin work may be considered an
            overpayment requiring repayment to VA.
          </p>
        </div>
      ),
      classNames:
        'vads-u-background-color--gray-lightest vads-u-padding--4 vads-u-margin-bottom--4',
      marginTop: null,
      required: () => true,
      errorMessages: {
        enum: 'You must acknowledge the information to continue.',
        required: 'You must acknowledge the information to continue.',
      },
      label:
        'I have read and understand the information about total disability benefits',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      authorizationRelease: checkboxRequiredSchema,
      certificationStatements: checkboxRequiredSchema,
      serviceConnectedStatements: checkboxRequiredSchema,
      'view:sectionSixPenaltyAlert': { type: 'object', properties: {} },
      'view:sectionSixPrivacyAlert': { type: 'object', properties: {} },
      'view:sectionSixBurdenAlert': { type: 'object', properties: {} },
    },
    required: [
      'authorizationRelease',
      'certificationStatements',
      'serviceConnectedStatements',
    ],
  },
};
