import React from 'react';
import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { dicOptions } from '../../../utils/labels';
import { radioQuestions } from '../../../utils/constants';

const { CHAPTER_5 } = radioQuestions;

const Description = () => (
  <div>
    <p>
      You can claim 1 of 3 types of Dependency and Indemnity Compensation (DIC)
      benefits. The type of benefit you choose depends on the reason for your
      claim.
    </p>
  </div>
);

const DicAccordion = () => (
  <div>
    <va-accordion>
      <va-accordion-item level={4} header="When to claim DIC">
        <p className="vads-u-font-weight--bold">Claim DIC if you’re:</p>
        <ul>
          <li>
            The survivor of a service member who died in the line of duty,{' '}
            <strong>or</strong>
          </li>
          <li>
            The survivor of a Veteran who died from a service-related injury or
            illness
          </li>
        </ul>
      </va-accordion-item>

      <va-accordion-item header="When to claim DIC under Title 38 U.S.C. 1151">
        <p className="vads-u-font-weight--bold">
          The Veteran died in one of these situations:
        </p>
        <ul>
          <li>
            While receiving care at a VA hospital, <strong>or</strong>
          </li>
          <li>
            While receiving medical or surgical treatment through VA,{' '}
            <strong>or</strong>
          </li>
          <li>
            During a VA exam, <strong>or</strong>
          </li>
          <li>During VA training</li>
        </ul>

        <p className="vads-u-font-weight--bold">
          And one of these must have led to the Veteran’s death:
        </p>
        <ul>
          <li>
            Something we’re at fault for, <strong>or</strong>
          </li>
          <li>
            An event that wasn’t a reasonably expected result or complication of
            our care or treatment, <strong>or</strong>
          </li>
          <li>
            Participation in a VA vocational rehabilitation or compensated work
            therapy program
          </li>
        </ul>

        <p>
          <va-link
            href="https://www.va.gov/disability/eligibility/special-claims/1151-claims-title-38/"
            external
            text="Learn more about Title 38 U.S.C. 1151 claims"
          />
        </p>
      </va-accordion-item>

      <va-accordion-item header="When to claim DIC re-evaluation based on the PACT Act">
        <ul>
          <li>
            A claim was submitted and denied prior to August 10, 2022, the date
            the PACT Act went into effect, <strong>and</strong>
          </li>
          <li>
            You’re requesting a re-evaluation of the previous claim based on the
            expanded eligibility within the PACT Act
          </li>
        </ul>

        <p>
          <va-link
            href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/"
            external
            text="Learn more about the PACT Act and your VA benefits"
          />
        </p>
      </va-accordion-item>
    </va-accordion>
  </div>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('DIC benefits', Description),
    'ui:description': DicAccordion,
    dicType: radioUI({
      title: CHAPTER_5.dicBenefits,
      labels: dicOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['dicType'],
    properties: {
      dicType: radioSchema(Object.keys(dicOptions)),
    },
  },
};
