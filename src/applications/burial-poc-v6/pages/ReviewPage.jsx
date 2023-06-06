import React, { useLayoutEffect } from 'react';
import { useFormikContext } from 'formik';
import { Link, useLocation } from 'react-router-dom';
import { VaOnThisPage } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  Page,
  parseDate,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { getRadioLabel } from '../utils';

/**
 * Transforms fields value into value that is more readable
 * @param {boolean | object | string} field object value
 * @param {string} key object key name
 *
 * @beta
 */
const transformFieldValue = (key, field) => {
  if (field.value === 'true' || field.value === true) {
    return 'Yes';
  }
  if (field.value === 'false' || field.value === false) {
    return 'No';
  }
  if (
    ['from', 'to', 'veteranDateOfBirth', 'deathDate', 'burialDate'].indexOf(
      key,
    ) > -1
  ) {
    const date = parseDate(field.value);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  if (['amountIncurred', 'amountGovtContribution'].indexOf(key) > -1) {
    return `$${field.value}`;
  }
  if (['claimantPhone'].indexOf(key) > -1) {
    return `${field.value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}`;
  }
  return field.value;
};

/**
 * Loops through field objects and adds JSX to a buffer
 * to be rendered later
 * @param {objects} fields object value
 * @param {number} rank level number of recursion
 *
 * @beta
 */
const bufferFields = (fields, rank = 0) => {
  const buffer = [];
  for (const [key, field] of Object.entries(fields)) {
    // eslint-disable-next-line no-use-before-define
    buffer.push(recurseField(key, field, rank));
  }
  return buffer;
};

/**
 * Recurses through field and either returns value or
 * uses bufferField to loop through object value
 * @param {string} key object key name
 * @param {boolean | object | string} field object value
 * @param {number} rank level number of recursion
 *
 * @beta
 */
const recurseField = (key, field, rank = 0) => {
  if (
    field.value === '' ||
    field.value === 0 ||
    field.value === null ||
    field.value === undefined
  )
    return <></>;
  const fieldLabel = field.label && (
    <label className="vads-u-margin-top--1 review-page--page-info--label-text">
      {field.label}
    </label>
  );

  if (typeof field.value === 'object') {
    return (
      <div
        className={`level-${rank}-field-${key}`}
        key={`level-${rank}-field-${key}`}
      >
        {' '}
        {bufferFields(field.value, rank + 1)}
      </div>
    );
  }

  return (
    <div
      className={`level-${rank}-field-${key}`}
      key={`level-${rank}-field-${key} vads-u-margin-bottom--1p5`}
    >
      {fieldLabel}
      <span
        className={`review-page--page-info--value-text field-value ${rank > 0 &&
          ` field-value-level-${rank}`}`}
      >
        {' '}
        {transformFieldValue(key, field)}
      </span>
    </div>
  );
};

/**
 * Anchor scroller
 * @param {string} location hash location
 *
 * @beta
 */
const scrollToSection = location => {
  // Get the '#' id from the location
  const id = location && location.hash ? location.hash : null;
  if (id) {
    const element = document.querySelector(id);
    // If element present, scroll me to that part
    if (element) {
      element.scrollIntoView();
    } else {
      // If element not present, scroll me to the top
      window.scrollTo(0, 0);
    }
  }
};

export default function ReviewPage(props) {
  const state = useFormikContext();
  const location = useLocation();

  useLayoutEffect(() => scrollToSection(location), [location]);

  // mockup some data to review formik context
  const pageData = {
    pages: [
      {
        title: 'Claimant information',
        id: 'claimant-information',
        pageUrl: '/claimant-information',
        isShown: true,
        fields: {
          fullName: {
            value: {
              first: {
                label: 'First name',
                value: state.values?.claimantFullName?.first,
              },
              middle: {
                label: 'Middle name',
                value: state.values?.claimantFullName?.middle,
              },
              last: {
                label: 'Last name',
                value: state.values?.claimantFullName?.last,
              },
              suffix: {
                label: 'Suffix',
                value: state.values?.claimantFullName?.suffix,
              },
            },
          },
          relationship: {
            label: 'Relationship to the Veteran',
            value: getRadioLabel(state.values?.relationship?.type),
          },
          'relationship.other': {
            label: 'If other, please specify',
            value: state.values?.relationship.other,
          },
          claimingAsFirm: {
            label: 'Claiming as a firm, corporation or state agency',
            value: state.values?.claimingAsFirm,
          },
        },
      },
      {
        title: 'Deceased Veteran Information',
        id: 'veteran-information',
        pageUrl: '/veteran-information',
        isShown: true,
        fields: {
          veteranFullName: {
            label: 'Veteran Name',
            value: {
              first: {
                label: 'First name',
                value: state.values?.veteranFullName?.first,
              },
              middle: {
                label: 'Middle name',
                value: state.values?.veteranFullName?.middle,
              },
              last: {
                label: 'Last name',
                value: state.values?.veteranFullName?.last,
              },
              suffix: {
                label: 'Suffix',
                value: state.values?.veteranFullName?.suffix,
              },
            },
          },
          veteranSocialSecurityNumber: {
            label: 'Social Security number',
            value: state.values?.veteranSocialSecurityNumber,
          },
          vaFileNumber: {
            label: 'File Number',
            value: state.values?.vaFileNumber,
          },
          veteranDateOfBirth: {
            label: 'Date of birth',
            value: state.values?.veteranDateOfBirth,
          },
          placeOfBirth: {
            label: 'Place of birth',
            value: state.values?.placeOfBirth,
          },
        },
      },
      {
        title: 'Deceased Veteran Information: Death and Burial',
        id: 'veteran-information-burial',
        pageUrl: '/veteran-information/burial',
        isShown: true,
        fields: {
          deathDate: {
            label: 'Date of death',
            value: state.values?.deathDate,
          },
          burialDate: {
            label: 'Date of burial(includes cremation or interment)',
            value: state.values?.burialDate,
          },
          'locationOfDeath.location': {
            label: "Where did the Veteran's death occur?",
            value: getRadioLabel(state.values?.locationOfDeath?.location),
          },
          'locationOfDeath.other': {
            label: 'If other, please specify',
            value: state.values?.locationOfDeath.other,
          },
        },
      },
      {
        title: 'Military Service History',
        id: 'military-history-service-periods',
        pageUrl: '/military-history/service-periods',
        isShown: true,
        fields: {
          toursOfDuty: {
            value: {
              dateRange: {
                value: {
                  from: {
                    label: 'Service start date',
                    value: state.values?.toursOfDuty[0]?.dateRange.from,
                  },
                  to: {
                    label: 'Service end date',
                    value: state.values?.toursOfDuty[0]?.dateRange.to,
                  },
                },
              },
              serviceBranch: {
                label: 'Branch of service',
                value: state.values?.toursOfDuty[0]?.serviceBranch,
              },
              rank: {
                label: 'Rank',
                value: state.values?.toursOfDuty[0]?.rank,
              },
              serviceNumber: {
                label: 'Service number',
                value: state.values?.toursOfDuty[0]?.serviceNumber,
              },
              placeOfEntry: {
                label: 'Place of entry',
                value: state.values?.toursOfDuty[0]?.placeOfEntry,
              },
              placeOfSeparation: {
                label: 'Place of separation',
                value: state.values?.toursOfDuty[0]?.placeOfSeparation,
              },
            },
          },
        },
      },
      {
        title: 'Military Service History: Previous Names',
        id: 'military-history-previous-names',
        pageUrl: '/military-history/previous-names',
        isShown: true,
        fields: {
          veteranServedUnderAnotherName: {
            label: 'Did the Veteran serve under another name?',
            value: state.values?.veteranServedUnderAnotherName,
          },
          previousNames: {
            label: 'Did the Veteran serve under another name?',
            value: {
              first: {
                label: 'First name',
                value: state.values?.previousNames[0]?.first,
              },
              middle: {
                label: 'Middle name',
                value: state.values?.previousNames[0]?.middle,
              },
              last: {
                label: 'Last name',
                value: state.values?.previousNames[0]?.last,
              },
              suffix: {
                label: 'Suffix',
                value: state.values?.previousNames[0]?.suffix,
              },
            },
          },
        },
      },
      {
        title: 'Benefits Selection',
        id: 'benefits-selection',
        pageUrl: '/benefits/selection',
        isShown: true,
        fields: {
          burialAllowance: {
            label: 'Burial allowance',
            value: state?.values?.benefitsSelection?.burialAllowance,
          },
          plotAllowance: {
            label: 'Plot or interment allowance',
            value: state?.values?.benefitsSelection?.plotAllowance,
          },
          transportation: {
            label: 'Transportation expenses',
            value: state?.values?.benefitsSelection?.transportation,
          },
          amountIncurred: {
            label: 'Transportation amount incurred',
            value: state?.values?.amountIncurred,
          },
        },
      },
      {
        title: 'Benefits Selection: Type of Burial Allowance',
        id: 'benefits-burial-allowance',
        pageUrl: '/benefits/burial-allowance',
        isShown: state?.values?.benefitsSelection?.burialAllowance === true,
        fields: {
          burialAllowanceRequested: {
            label: 'Type of burial allowance requested',
            value: getRadioLabel(state?.values?.burialAllowanceRequested),
            // // Label of option is set in BurialAllowance component instead of value
            // value: state?.values?.burialAllowanceRequestedLabel
          },
          previouslyReceivedAllowance: {
            label: 'Did you previously receive a VA burial allowance?',
            value: state.values?.previouslyReceivedAllowance,
          },
          benefitsUnclaimedRemains: {
            label:
              'Are you seeking burial benefits for the unclaimed remains of a Veteran?',
            value: state.values?.benefitsUnclaimedRemains,
          },
        },
      },
      {
        title: 'Benefits Selection: Plot or Interment Allowance',
        id: 'benefits-plot-allowance',
        pageUrl: '/benefits/plot-allowance',
        isShown: state?.values?.benefitsSelection?.plotAllowance === true,
        fields: {
          placeOfRemains: {
            label: 'Place of burial or deceased Veteran’s remains',
            value: state?.values?.placeOfRemains,
          },
          federalCemetery: {
            label:
              'Was the Veteran buried in a national cemetery, or one owned by the federal government?',
            value: state?.values?.federalCemetery,
          },
          stateCemetery: {
            label: 'Was the Veteran buried in a state Veteran’s cemetery?',
            value: state?.values?.stateCemetery,
          },
          govtContributions: {
            label:
              'Did a federal/state government or the Veteran’s employer contribute to the burial?  (Not including employer life insurance)',
            value: state?.values?.govtContributions,
          },
          amountGovtContribution: {
            label: 'Amount of government or employer contribution',
            value: state?.values?.amountGovtContribution,
          },
        },
      },
      {
        title: 'Claimant Contact Information',
        id: 'claimant-contact-information',
        pageUrl: '/claimant-contact-information',
        isShown: true,
        fields: {
          claimantAddress: {
            label: 'Claimant Address',
            value: {
              country: {
                label: 'Country',
                value: state?.values?.claimantAddress?.country,
              },
              street: {
                label: 'Street',
                value: state?.values?.claimantAddress?.street,
              },
              street2: {
                label: 'Street 2',
                value: state?.values?.claimantAddress?.street2,
              },
              city: {
                label: 'City',
                value: state?.values?.claimantAddress?.city,
              },
              state: {
                label: 'State',
                value: state?.values?.claimantAddress?.state,
              },
              postalCode: {
                label: 'Postal code',
                value: state?.values?.claimantAddress?.postalCode,
              },
            },
          },
          claimantEmail: {
            label: 'Claimant Email',
            value: state?.values?.claimantEmail,
          },
          claimantPhone: {
            label: 'Claimant Phone Number',
            value: state?.values?.claimantPhone,
          },
        },
      },
    ],
  };

  return (
    <Page {...props} nextButtonCustomText="Submit">
      <article>
        <h1>{props.title}</h1>
        <VaOnThisPage />

        {pageData.pages.map(page => {
          if (page.isShown) {
            return (
              <section
                id={page.id}
                key={page.id}
                className="review-page--page-info"
              >
                <div className="review-page--page-heading vads-u-justify-content--space-between vads-l-row vads-u-border-bottom--1px vads-u-border-color--link-default">
                  <h2
                    id={page.id}
                    className="vads-u-font-size--h3 vads-u-flex--1 review-page--page-heading--text"
                  >
                    {page.title}
                  </h2>
                  <Link
                    to={`${page.pageUrl}?edit=true&source=${page.id}`}
                    className="vads-u-margin-bottom--1p5 review-page--page-heading--link"
                    aria-label="Edit"
                  >
                    Edit
                  </Link>
                </div>

                {bufferFields(page.fields)}
              </section>
            );
          }
          return <></>;
        })}
      </article>
    </Page>
  );
}
