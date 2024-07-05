import React, { useState } from 'react';
// import React, { useRef, useState } from 'react';
// import { formatSSN } from 'platform/utilities/ui';
import {
  VaButtonPair,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
// import SsnField from 'platform/forms-system/src/js/web-component-fields/SsnField';
import { getFormNumber } from '../helpers';
import FormPage from '../containers/FormPage';

export const IdentificationInfoPage = () => {
  const history = useHistory();
  const location = useLocation();
  const formNumber = getFormNumber(location);
  const [ssn, setSsn] = useState('');
  const [vaFileNumber, setVaFileNumber] = useState('');

  const onClickContinue = () => {
    const { state } = location;
    const options = { ssn, vaFileNumber };
    const newState = { ...state, options };
    history.push(`/${formNumber}/review-zip`, newState);
  };

  const onVaFileNumberChange = e => {
    setVaFileNumber(e.target.value);
  };

  const onSsnChange = e => {
    setSsn(e.target.value);
  };

  // const SocialSecurityField = ({ props }) => SsnField(props);

  // const maskSSN = (ssnString = '') => {
  //   const strippedSSN = ssnString.replace(/[- ]/g, '');
  //   const maskedSSN = strippedSSN.replace(/^\d{1,5}/, digit =>
  //     digit.replace(/\d/g, '●'),
  //   );

  //   return formatSSN(maskedSSN);
  // };

  // const SsnField = ({ props }) => {
  //   const [val, setVal] = useState('');
  //   const [displayVal, setDisplayVal] = useState('');
  //   const vaTextInput = useRef();
  //   const handleChange = event => {
  //     const { value } = event.target;
  //     let strippedSSN;
  //     if (value) {
  //       strippedSSN = value.replace(/[- ]/g, '');
  //     }

  //     setVal(value);
  //     setDisplayVal(value);
  //     props.onInput(event, strippedSSN);
  //   };

  //   const handleBlur = () => {
  //     setDisplayVal(maskSSN(val));
  //     props.onBlur(props.id);
  //   };

  //   const handleFocus = () => {
  //     setDisplayVal(val);
  //   };

  //   return (
  //     <VaTextInput
  //       {...props}
  //       hint={null}
  //       value={displayVal}
  //       onInput={handleChange}
  //       onBlur={handleBlur}
  //       onFocus={handleFocus}
  //       ref={vaTextInput}
  //     />
  //   );
  // };

  return (
    <FormPage currentLocation={2} pageTitle="Identification information">
      <p className="vads-u-margin-top--0">
        You must enter either a Social Security number or VA File number.
      </p>
      <div className="vads-u-margin-bottom--5">
        {/* <SsnField
          {...ssnUI}
          hint={null}
          label="Social Security number"
          // message-aria-describedby="Optional description text for screen readers"
          name="social-security-number"
          required
        /> */}
        {/* {SsnField({
          uiSchema: {
            ...ssnUI,
            'ui:autocomplete': null,
            onInput: onSsnChange,
            hint: null,
            label: 'Social Security number',
            // message-aria-describedby="Optional description text for screen readers"
            name: 'social-security-number',
            description: 'Description',
            required: true,
          },
          childrenProps: {
            idSchema: PropTypes.object,
            schema: { type: 'object' },
          },
        })} */}
        {/* {{
          uiSchema: {
            ...titleUI('Your identification information'),
            userId: ssnOrVaFileNumberUI(),
          },
          schema: {
            type: 'object',
            properties: {
              userId: ssnOrVaFileNumberSchema,
            },
          },
        }} */}
        <VaTextInput
          hint={null}
          label="Social Security number"
          message-aria-describedby="Optional description text for screen readers"
          name="social-security-number"
          onInput={onSsnChange}
          required
        />
        <VaTextInput
          hint={null}
          label="VA file number"
          message-aria-describedby="Optional description text for screen readers"
          name="va-file-number"
          onInput={onVaFileNumberChange}
        />
      </div>
      <VaButtonPair
        class="vads-u-margin-top--0"
        continue
        onPrimaryClick={onClickContinue}
        onSecondaryClick={history.goBack}
        uswds
      />
    </FormPage>
  );
};

export const ZipCodePage = () => {
  const history = useHistory();
  const location = useLocation();
  const formNumber = getFormNumber(location);
  const [zipCode, setZipCode] = useState('');

  const onClickContinue = () => {
    const { state } = location;
    const { options } = state;
    const newState = { ...state, options: { ...options, zipCode } };
    history.push(`/${formNumber}/submit`, newState);
  };

  const onZipCodeChange = e => {
    setZipCode(e.target.value);
  };

  return (
    <FormPage currentLocation={2} pageTitle="Your zip code">
      <p className="vads-u-margin-top--0">
        We use your zip code to send your form to the right place for
        processing.
      </p>
      <div className="vads-u-margin-bottom--5">
        <va-text-input
          hint={null}
          label="Zip code"
          message-aria-describedby="Optional description text for screen readers"
          name="zip-code"
          onInput={onZipCodeChange}
          uswds
        />
      </div>
      <VaButtonPair
        class="vads-u-margin-top--0"
        continue
        onPrimaryClick={onClickContinue}
        onSecondaryClick={history.goBack}
        uswds
      />
    </FormPage>
  );
};
