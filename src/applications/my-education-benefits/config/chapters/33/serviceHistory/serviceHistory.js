import React from 'react';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import toursOfDutyUI from '../../../../definitions/toursOfDuty';
import AccordionField from '../../../../components/AccordionField';
import ServicePeriodAccordionView from '../../../../components/ServicePeriodAccordionView';
import YesNoReviewField from '../../../../components/YesNoReviewField';

import { formFields } from '../../../../constants';

const { toursOfDuty } = commonDefinitions;

const checkBoxValidation = {
  pattern: (errors, values, formData) => {
    if (
      !Object.keys(values).some(key => values[key]) &&
      formData['view:serviceHistory']?.serviceHistoryIncorrect
    ) {
      errors.addError('Please check at least one of the options below');
    }
  },
};

const serviceHistory33 = {
  uiSchema: {
    'view:subHeading': {
      'ui:description': (
        <>
          <h3>Review your service history</h3>
          <p>
            The displayed service history is reported to VA by DOD and may
            include service which is not creditable for the Post-9/11 GI Bill.
          </p>
          <p>
            VA will only consider active duty service (
            <a
              target="_blank"
              href="https://uscode.house.gov/view.xhtml?req=(title:38%20section:3301%20edition:prelim)%20OR%20(granuleid:USC-prelim-title38-section3301)&f=treesort&edition=prelim&num=0&jumpTo=true"
              rel="noreferrer"
            >
              Authority 38 U.S.C. 3301(1)
            </a>
            ) when determining your eligibility. Please review your service
            history and indicate if anything is incorrect.
          </p>
        </>
      ),
      'ui:options': {
        hideIf: formData => formData?.meb160630Automation,
      },
    },
    'view:newSubHeading': {
      'ui:description': (
        <>
          <h3>Review your service history</h3>
          <p>
            The displayed service history is reported to the VA by DOD and may
            include service which is not creditable for the benefit you are
            applying for.
          </p>
          <p>
            VA will only consider active duty service (
            <a
              target="_blank"
              href="https://uscode.house.gov/view.xhtml?req=(title:38%20section:3301%20edition:prelim)%20OR%20(granuleid:USC-prelim-title38-section3301)&f=treesort&edition=prelim&num=0&jumpTo=true"
              rel="noreferrer"
            >
              Authority 38 U.S.C. 3301(1)
            </a>
            ) and a 6-year service obligation (you agreed to serve 6 years) in
            the Selective Reserve when determining your eligibility. Please
            review your service history and indicate if anything is incorrect.
          </p>
        </>
      ),
      'ui:options': {
        hideIf: formData => !formData?.meb160630Automation,
      },
    },
    [formFields.toursOfDuty]: {
      ...toursOfDutyUI,
      'ui:field': AccordionField,
      'ui:title': 'Service history',
      'ui:options': {
        ...toursOfDutyUI['ui:options'],
        keepInPageOnReview: true,
        reviewTitle: <></>,
        setEditState: () => {
          return true;
        },
        showSave: false,
        viewField: ServicePeriodAccordionView,
        viewComponent: ServicePeriodAccordionView,
        viewOnlyMode: true,
      },
      items: {
        ...toursOfDutyUI.items,
        'ui:objectViewField': ServicePeriodAccordionView,
      },
    },
    'view:serviceHistory': {
      'ui:description': (
        <>
          <div className="meb-review-page-only">
            <p>
              If you’d like to update information related to your service
              history, edit the form fields below.
            </p>
          </div>
        </>
      ),
      [formFields.serviceHistoryIncorrect]: {
        'ui:title': 'This information is incorrect and/or incomplete',
        'ui:reviewField': YesNoReviewField,
      },
    },
    [formFields.incorrectServiceHistoryExplanation]: {
      'ui:options': {
        expandUnder: 'view:serviceHistory',
        hideIf: formData =>
          !formData?.['view:serviceHistory']?.[
            formFields.serviceHistoryIncorrect
          ],
      },
      incorrectServiceHistoryInputs: {
        'ui:required': formData =>
          formData['view:serviceHistory']?.serviceHistoryIncorrect === true,
        'ui:errorMessages': {
          required: 'Please check at least one of the options below',
        },
        'ui:title': (
          <>
            <p className="check-box-label">
              Choose all that apply{' '}
              <span className="text-restriction">
                (*You must choose at least one)
              </span>
            </p>
          </>
        ),
        'ui:validations': [checkBoxValidation.pattern],
        'ui:options': {
          showFieldLabel: true,
          forceDivWrapper: true,
        },
        servicePeriodMissingForActiveDuty: {
          'ui:title':
            'I am currently on Active Duty orders and that service period is missing.',
        },
        servicePeriodMissing: {
          'ui:title':
            'I am not currently on Active Duty orders and one or more of my service periods is missing.',
        },
        servicePeriodNotMine: {
          'ui:title': 'One or more service periods displayed are not mine.',
        },
        servicePeriodIncorrect: {
          'ui:title':
            'The service dates of one or more of my service periods are incorrect.',
        },
      },
      incorrectServiceHistoryText: {
        'ui:title':
          'Please explain what is missing and/or incorrect about your service history.',
        'ui:required': formData =>
          formData['view:serviceHistory']?.serviceHistoryIncorrect === true,
        'ui:widget': 'textarea',
        'ui:errorMessages': {
          required: 'Please include your description of the issue below',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:subHeading': {
        type: 'object',
        properties: {},
      },
      'view:newSubHeading': {
        type: 'object',
        properties: {},
      },
      [formFields.toursOfDuty]: {
        ...toursOfDuty,
        title: '', // Hack to prevent console warning
        items: {
          type: 'object',
          properties: {},
        },
        required: [],
      },
      'view:serviceHistory': {
        type: 'object',
        properties: {
          [formFields.serviceHistoryIncorrect]: {
            type: 'boolean',
          },
        },
      },
      [formFields.incorrectServiceHistoryExplanation]: {
        type: 'object',
        properties: {
          incorrectServiceHistoryInputs: {
            type: 'object',
            properties: {
              servicePeriodMissingForActiveDuty: { type: 'boolean' },
              servicePeriodMissing: { type: 'boolean' },
              servicePeriodNotMine: { type: 'boolean' },
              servicePeriodIncorrect: { type: 'boolean' },
            },
          },
          incorrectServiceHistoryText: {
            type: 'string',
            maxLength: 250,
          },
        },
      },
    },
  },
};

export default serviceHistory33;
