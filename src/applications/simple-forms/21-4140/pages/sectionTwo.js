import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollTo } from 'platform/utilities/scroll';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder/arrayBuilder';
import {
  textUI,
  numberUI,
  textSchema,
  numberSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';
import {
  addressUI,
  addressSchema,
} from '~/platform/forms-system/src/js/web-component-patterns/addressPattern';
import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from '~/platform/forms-system/src/js/web-component-patterns/datePatterns';


export const SectionTwoIntro = ({ goBack, goForward, NavButtons }) => {
  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  return (
    <div className="schemaform-intro">
      <h1 className="vads-u-margin-bottom--2">
        Section II: Employment Certification
      </h1>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '20px' }}>
        Next we&apos;ll gather details about your current or recent employment.
      </p>
      <VaSummaryBox
        id="employment-section-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h2 slot="headline">What to expect</h2>
        <ul className="usa-list vads-u-margin--0">
          <li>Answer if you&apos;re currently employed by VA</li>
          <li>Add employers and employment details for the past 12 months</li>
          <li>Have pay and employment dates handy</li>
        </ul>
      </VaSummaryBox>
      <NavButtons goBack={goBack} goForward={goForward} submitToContinue />
    </div>
  );
};

SectionTwoIntro.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  NavButtons: PropTypes.elementType,
};


const hasValue = value => value !== undefined && value !== null && value !== '';


/** @type {ArrayBuilderOptions} */
const employersOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: true,
  isItemIncomplete: item =>
    !item?.employerName ||
    !item?.typeOfWork ||
    !hasValue(item?.hoursPerWeek) ||
    !item?.datesOfEmployment?.from ||
    !item?.datesOfEmployment?.to ||
    !item?.employerAddress?.street ||
    !item?.employerAddress?.city ||
    !item?.employerAddress?.state ||
    !item?.employerAddress?.postalCode ||
    !hasValue(item?.lostTime) ||
    !hasValue(item?.highestIncome),
  maxItems: 4,
  text: {
    getItemName: item => item?.employerName,
    cardDescription: item => {
      const dates = item?.datesOfEmployment;
      if (dates?.from && dates?.to) {
        return `${dates.from} - ${dates.to}`;
      }
      return 'Employment dates not provided';
    },
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI('Section 2 - Employment Certification'),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:hasEmployers': arrayBuilderYesNoUI(
      employersOptions,
      {
        title: 'Do you have any employers to add for the past 12 months?',
        hint: 'Include self-employment and work at VA or other employers.',
        labels: {
          Y: 'Yes, I need to add an employer',
          N: 'No, I added all of my employers',
        },
      },
      {
        title: 'Do you have another employer to add?',
        labels: {
          Y: 'Yes, I have another employer to add',
          N: 'No, I added all of my employers',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployers': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployers'],
  },
};

/** @returns {PageSchema} */
const employerDetailsPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employment certification information',
      nounSingular: employersOptions.nounSingular,
      hasMultipleItemPages: false,
      description:
        'Provide details about this employer for your Section 2 certification.',
    }),
    'ui:order': [
      'employerName',
      'employerAddress',
      'datesOfEmployment',
      'typeOfWork',
      'highestIncome',
      'hoursPerWeek',
      'lostTime',
    ],
    employerName: textUI({
      title: 'Name of employer',
      errorMessages: {
        required: 'Enter the employer name. This field is required.',
      },
    }),
    employerAddress: addressUI({
      omit: ['street2', 'street3', 'isMilitary'],
      errorMessages: {
        street: 'Enter the employer\'s mailing address number and street or rural route. This field is required.',
        city: 'Enter the City. Use this field for APO, FPO, or DPO. This field is required.',
        state: 'Enter the State, Province, or Region, or use AA, AE, or AP. This field is required.',
        postalCode: 'Enter the ZIP code or Postal code. For APO, FPO, or DPO addresses, use the postal code for the military base. This field is required for U.S. and APO, FPO, and DPO addresses.',
      },
    }),
    datesOfEmployment: currentOrPastDateRangeUI(
      'Start date of employment',
      'End date of employment',
      'End date must be after start date',
    ),
    typeOfWork: textUI({
      hint: 'If self-employed enter "Self"',
      title: 'Type of work',
      errorMessages: {
        required: 'Enter type of work for this employer, self-employment, or military duties. This field is required.',
      },
    }),
    highestIncome: numberUI({
      title: 'What was the most you earned in a month at this job before taxes (gross income)?',
      min: 0,
      errorMessages: {
        required: 'Enter your monthly gross income. Round to the nearest whole number. This field is required.',
      },
    }),
    hoursPerWeek: numberUI({
      title: 'How many hours per week did you work?',
      min: 0,
      errorMessages: {
        required: 'Enter the number of hours worked per week. This field is required.',
      },
    }),
    lostTime: numberUI({
      title: 'How many days per month did you miss work due to illness?',
      min: 0,
      errorMessages: {
        required: 'Enter the number of days missed per month because of illness. This field is required.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employerName: textSchema,
      employerAddress: addressSchema({
        omit: ['street2', 'street3', 'isMilitary'],
      }),
      datesOfEmployment: currentOrPastDateRangeSchema,
      typeOfWork: textSchema,
      highestIncome: numberSchema,
      hoursPerWeek: numberSchema,
      lostTime: numberSchema,
    },
    required: [
      'employerName',
      'employerAddress',
      'datesOfEmployment',
      'typeOfWork',
      'highestIncome',
      'hoursPerWeek',
      'lostTime',
    ],
  },
};

const employersPages = arrayBuilderPages(
  employersOptions,
  (pageBuilder, _helpers) => ({
    employersIntro: pageBuilder.introPage({
      title: 'Employment information intro',
      path: 'section-two',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      CustomPage: SectionTwoIntro,
      CustomPageReview: null,
    }),
    employersSummary: pageBuilder.summaryPage({
      title: 'Review your employers',
      path: 'section-2-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    employerDetails: pageBuilder.itemPage({
      title: 'Employment certification information',
      path: 'section-2/:index/basic-info',
      uiSchema: employerDetailsPage.uiSchema,
      schema: employerDetailsPage.schema,
    }),
  }),
);

export default employersPages;
