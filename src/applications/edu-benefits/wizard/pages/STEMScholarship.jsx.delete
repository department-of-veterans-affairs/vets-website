import React, { useState } from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { pageNames } from './pageList';
import recordEvent from 'platform/monitoring/record-event';
import { formIdSuffixes } from 'applications/static-pages/wizard/';

const STEMScholarship = ({ setPageState, state = {}, setReferredBenefit }) => {
  const STEMScholarshipOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];
  const [STEMScholarshipAnswer, setSTEMScholarshipAnswer] = useState(undefined);

  return (
    <div className="wizard-edith-nourse-content">
      <br />
      <strong>
        To be eligible for the{' '}
        <a
          href="/education/other-va-education-benefits/stem-scholarship/"
          onClick={() =>
            recordEvent({
              event: 'edu-navigation',
              'edu-action': 'stem-scholarship',
            })
          }
        >
          Edith Nourse Rogers STEM Scholarship
        </a>
        , you must meet all the requirements below. You:
      </strong>
      <ul className="wizard-edith-nourse-content">
        <li>
          Are using or recently used Post-9/11 GI Bill or Fry Scholarship
          benefits
        </li>
        <li>
          Have used all your education benefits or are within 6 months of doing
          so.{' '}
          <a
            className="checkBenefitsLink"
            href="../gi-bill/post-9-11/ch-33-benefit/"
            onClick={() =>
              recordEvent({
                event: 'edu-navigation',
                'edu-action': 'check-remaining-benefits',
              })
            }
          >
            Check remaining benefits
          </a>
        </li>
        <li>
          Are enrolled in an undergraduate degree program for science,
          technology, engineering or math (STEM), <strong>or</strong> have
          already earned a STEM degree and are pursuing a teaching
          certification.{' '}
          <a
            href="https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf"
            onClick={() =>
              recordEvent({
                event: 'edu-navigation',
                'edu-action': 'see-approved-stem-programs',
              })
            }
          >
            See approved STEM programs
          </a>
        </li>
      </ul>

      <RadioButtons
        additionalFieldsetClass="wizard-fieldset"
        name={`${pageNames.STEMScholarship}`}
        id={`${pageNames.STEMScholarship}`}
        options={STEMScholarshipOptions}
        onValueChange={({ value }) => {
          setSTEMScholarshipAnswer(value);
          if (value === 'yes') {
            const { FORM_ID_1995 } = formIdSuffixes;
            setReferredBenefit(FORM_ID_1995);
            return setPageState({ selected: value }, pageNames.applyNow);
          } else {
            return setPageState({ selected: value });
          }
        }}
        value={{ value: state?.selected }}
        label="Based on the eligibility requirements above, do you want to apply for this scholarship?"
      />
      {STEMScholarshipAnswer === 'no' && (
        <div className="vads-u-padding-top--2">
          <p>
            Learn what other education benefits you may be eligible for on the{' '}
            <a href="../eligibility/">GI Bill eligibility page</a>.
          </p>
        </div>
      )}
    </div>
  );
};

export default {
  name: pageNames?.STEMScholarship,
  component: STEMScholarship,
};
