import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

import SignatureInput from './SignatureInput';
import PrivacyPolicy from './components/PrivacyPolicy';

// these are the required creds minus the information is correct
// TODO derive these arrays from schema once schema is changes to return only valid arrays using anyOf
const veteranCert = [
  'consent-to-caregivers-to-perform-care',
  'information-is-correct-and-true',
];

const primaryCertOne = [
  'information-is-correct-and-true',
  'at-least-18-years-of-age',
  'member-of-veterans-family',
  'agree-to-perform-services--as-primary',
  'understand-revocable-status--as-primary',
  'have-understanding-of-non-employment-relationship',
];

const primaryCertTwo = [
  'information-is-correct-and-true',
  'at-least-18-years-of-age',
  'not-member-of-veterans-family',
  'currently-or-will-reside-with-veteran--as-primary ',
  'agree-to-perform-services--as-primary',
  'understand-revocable-status--as-primary',
  'have-understanding-of-non-employment-relationship',
];

const secondaryCertOne = [
  'information-is-correct-and-true',
  'at-least-18-years-of-age',
  'member-of-veterans-family',
  'agree-to-perform-services--as-secondary',
  'understand-revocable-status--as-secondary',
  'have-understanding-of-non-employment-relationship',
];

const secondaryCertTwo = [
  'information-is-correct-and-true',
  'at-least-18-years-of-age',
  'not-member-of-veterans-family',
  'currently-or-will-reside-with-veteran--as-secondary',
  'agree-to-perform-services--as-secondary',
  'understand-revocable-status--as-secondary',
  'have-understanding-of-non-employment-relationship',
];

const getSchemaEnum = party =>
  fullSchema.properties[party].properties.certifications.items.enum;

const SignatureCheckbox = props => {
  getSchemaEnum('secondaryCaregiverOne');
  const {
    children,
    fullName,
    isRequired,
    label,
    setSignature,
    showError,
    setCertifications,
  } = props;

  // console.log('signature props: ', props);
  const [isSigned, setIsSigned] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasError, setError] = useState(null);
  const [radioValue, setRadioValue] = useState({
    value: '',
    dirty: false,
  });
  const hasRadioValue =
    label === 'Veteran\u2019s' ? true : radioValue.dirty === true;
  const isSignatureComplete = isSigned && isChecked && hasRadioValue;
  const createInputContent = inputLabel => `Enter ${inputLabel} full name`;

  // add/remove signatures from boolean values
  useEffect(
    () => {
      setSignature(prevState => {
        return { ...prevState, [label]: isSignatureComplete };
      });
    },

    [isSignatureComplete, label, setSignature],
  );

  // add/remove error state
  useEffect(
    () => {
      setError(showError);

      if (isChecked === true) setError(false);
    },
    [showError, setIsChecked, isChecked],
  );

  // function that returns array of cert ids
  const getEnumsFromLabel = option => {
    const optionValue = option.value;
    const hashMap = {
      [`Veteran\u2019s`]: veteranCert,
      [`Primary Family Caregiver applicant\u2019s`]: {
        optionOne: primaryCertOne,
        optionTwo: primaryCertTwo,
      },
      [`Secondary Family Caregiver applicant\u2019s`]: {
        optionOne: secondaryCertOne,
        optionTwo: secondaryCertTwo,
      },
      [`Secondary Family Caregiver (2) applicant\u2019s`]: {
        optionOne: secondaryCertOne,
        optionTwo: secondaryCertTwo,
      },
    };

    if (label === `Veteran\u2019s`) {
      return hashMap[label];
    } else {
      return hashMap[label][optionValue];
    }
  };

  useEffect(
    () => {
      if (isSignatureComplete) {
        const newValue = { [label]: getEnumsFromLabel(radioValue) };
        setCertifications(prevState => {
          return { ...prevState, ...newValue };
        });
      }

      if (!isSignatureComplete) {
        setCertifications(prevState => {
          const oldState = prevState;
          delete oldState[label];
          return { ...oldState };
        });
      }
    },
    [radioValue, isSignatureComplete],
  );

  return (
    <article
      data-testid={label}
      className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7"
    >
      {children && <header>{children}</header>}

      {label !== 'Veteran\u2019s' && (
        <>
          <ErrorableRadioButtons
            additionalFieldsetClass="vads-u-margin-top--0p5"
            onValueChange={value => setRadioValue({ ...value })}
            errorMessage={
              showError && 'You must certify this party before continuing'
            }
            label="Select one:"
            options={[
              {
                label:
                  "I certify that I am a member of the Veteran's family (including a parent, spouse, a son or daughter, a step-family member, or an extended family member).",
                value: 'optionOne',
              },
              {
                label:
                  "I certify that I am not a member of the Veteran's family, and I reside with the Veteran full-time or will do so upon designation as the Veteran's Primary Family Caregiver.",
                value: 'optionTwo',
              },
            ]}
            value={radioValue}
            required
          />

          <PrivacyPolicy />
        </>
      )}

      <SignatureInput
        setIsSigned={setIsSigned}
        label={createInputContent(label)}
        fullName={fullName}
        required={isRequired}
        showError={showError}
      />

      <ErrorableCheckbox
        onValueChange={value => setIsChecked(value)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        errorMessage={hasError && 'Must certify by checking box'}
        required={isRequired}
      />
    </article>
  );
};

SignatureCheckbox.propTypes = {
  children: PropTypes.any,
  fullName: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  setSignature: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  signatures: PropTypes.object.isRequired,
  setCertifications: PropTypes.func.isRequired,
};

export default SignatureCheckbox;
