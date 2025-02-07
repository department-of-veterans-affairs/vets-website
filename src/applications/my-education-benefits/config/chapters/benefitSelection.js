import React from 'react';

const benefitSelection = {
  uiSchema: {
    'view:subHeading': {
      'ui:description': (
        <>
          <div>
            <h3>Choose the benefit you’d like to apply for</h3>
          </div>
        </>
      ),
    },
    'view:chapter33': {
      'ui:description': (
        <>
          <div className="usa-alert background-color-only">
            <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
              CHAPTER 33
            </h5>
            <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
              Post-9/11 GI Bill
            </h4>

            <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
              You can receive up to 36 months of benefits, including:
            </h4>
            <ul className="my-education-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
              <li>
                <va-icon
                  size={3}
                  icon="school"
                  className="my-education-benefit-selection-icon"
                  aria-hidden="true"
                />{' '}
                Tuition &amp; fees
              </li>
              <li>
                <va-icon
                  size={3}
                  icon="home"
                  className="my-education-benefit-selection-icon"
                  aria-hidden="true"
                />{' '}
                Money for housing
              </li>
              <li>
                <va-icon
                  size={3}
                  icon="local_library"
                  className="my-education-benefit-selection-icon"
                  aria-hidden="true"
                />{' '}
                Money for books &amp; supplies
              </li>
            </ul>

            <a
              href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about the Post-9/11 GI Bill
            </a>
          </div>
        </>
      ),
    },
    'view:chapter30': {
      'ui:description': (
        <>
          <div className="usa-alert background-color-only">
            <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
              CHAPTER 30
            </h5>
            <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
              MONTGOMERY GI BILL ACTIVE DUTY (MGIB-AD)
            </h4>

            <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
              You can receive up to 36 months of benefits, including:
            </h4>
            <ul className="my-education-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
              <li>
                <va-icon
                  size={3}
                  icon="attach_money"
                  className="my-education-benefit-selection-icon"
                  aria-hidden="true"
                />{' '}
                Monthly stipend
              </li>
            </ul>

            <a
              href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about MGIB-AD
            </a>
          </div>
        </>
      ),
    },
    'view:chapter1606': {
      'ui:description': (
        <>
          <div className="usa-alert background-color-only">
            <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
              CHAPTER 1606
            </h5>
            <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
              MONTGOMERY GI BILL SELECTED RESERVE (MGIB-SR)
            </h4>

            <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
              You can receive up to 36 months of benefits, including:
            </h4>
            <ul className="my-education-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
              <li>
                <va-icon
                  size={3}
                  icon="attach_money"
                  className="my-education-benefit-selection-icon"
                  aria-hidden="true"
                />{' '}
                Monthly stipend
              </li>
            </ul>

            <a
              href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about MGIB-SR
            </a>
          </div>
        </>
      ),
    },
    chosenBenefit: {
      'ui:title': (
        <>
          <span className="fry-dea-labels_label--main vads-u-padding-left--1">
            Which education benefit would you like to apply for?
          </span>
        </>
      ),
      'ui:errorMessages': {
        required: 'Please select an education benefit',
      },
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          chapter33: 'Post-9/11 GI Bill (Chapter 33)',
          chapter30: 'Montgomery GI Bill Active Duty (MGIB-AD, Chapter 30)',
          chapter1606:
            'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
        },
        widgetProps: {
          chapter33: { 'data-info': 'Post-9/11 GI Bill (Chapter 33)' },
          chapter30: {
            'data-info': 'Montgomery GI Bill Active Duty (MGIB-AD, Chapter 30)',
          },
          chapter1606: {
            'data-info':
              'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
          },
        },
        selectedProps: {
          chapter33: { 'aria-describedby': 'Post-9/11 GI Bill (Chapter 33)' },
          chapter30: {
            'aria-describedby':
              'Montgomery GI Bill Active Duty (MGIB-AD, Chapter 30)',
          },
          chapter1606: {
            'aria-describedby':
              'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['chosenBenefit'],
    properties: {
      'view:subHeading': {
        type: 'object',
        properties: {},
      },
      'view:chapter33': {
        type: 'object',
        properties: {},
      },
      'view:chapter30': {
        type: 'object',
        properties: {},
      },
      'view:chapter1606': {
        type: 'object',
        properties: {},
      },
      chosenBenefit: {
        type: 'string',
        enum: ['chapter33', 'chapter30', 'chapter1606'],
      },
    },
  },
};

export default benefitSelection;
