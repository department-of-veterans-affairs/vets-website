import React, { useEffect, useState, useRef } from 'react';
import { VaTelephoneInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTelephoneInputFieldMapping from './vaTelephoneInputFieldMapping';
import environment from '../../../../utilities/environment';
import { TELEPHONE_VALIDATION_ENDPOINT } from './vaTelephoneInputValidationCodes';
/**
 * Usage uiSchema:
 * ```
 * internationalPhone: {
 *   'ui:title': 'Phone number',
 *   'ui:description': 'description',
 *   'ui:webComponentField': VaTelephoneInput,
 *   'ui:hint': 'hint',
 *   'ui:errorMessages': {
 *     required: 'This is a custom error message.',
 *   },
 *   'ui:options': {
 *     noCountry: true,
 *     header: 'Mobile phone number',
 *   },
 * }
 * ```
 *
 * Usage schema:
 * ```
 * internationalPhone: {
 *   type: 'object',
 *   properties: {
 *     callingCode: { type: 'number', title: 'Calling code' }
 *     countryCode: { type: 'string', title: 'Country code' }
 *     contact: { type: 'string', title: 'Contact' }
 *     isValid: { type: 'boolean', title: 'Is valid' }
 *   }
 * }
 * ```
 * @param {WebComponentFieldProps} props */
export default function VaTelephoneInputField(props) {
  const mappedProps = vaTelephoneInputFieldMapping(props);
  const [validationError, setValidationError] = useState(null);
  const abortControllerRef = useRef(null);
  const previousPayload = useRef(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    // component emits event on load that is important for validation
    // it does not get emitted in test env as it does in browser so emit manually
    if (environment.isUnitTest()) {
      const testEvent = {
        detail: {
          callingCode: 1,
          contact: 'not valid',
          countryCode: 'US',
          error: 'This is a test',
          isValid: false,
        },
      };
      mappedProps.onVaContact(testEvent);
    }
  }, []);

  async function validateContact({ detail: { callingCode, contact } }) {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // numbers outside North American numbering plan
    const internationalIndicator = callingCode !== '1';
    // for US-type numbers clip area code
    const phoneNumber = internationalIndicator ? contact : contact.slice(3);
    // only US numbers use area codes
    const areaCode = internationalIndicator ? null : contact.slice(0, 3);
    const payload = {
      telephone: {
        internationalIndicator,
        phoneType: 'HOME',
        countryCode: callingCode,
        ...(!internationalIndicator && { areaCode }),
        phoneNumber,
      },
    };

    // don't validate if payload hasn't changed
    const payloadString = JSON.stringify(payload);
    if (previousPayload.current === payloadString) {
      return;
    }
    previousPayload.current = payloadString;

    let status;
    try {
      const response = await fetch(TELEPHONE_VALIDATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const body = await response.json();
      status = response.status;
      // there was a validation error
      if (status === 400) {
        const messages = body?.messages;
        if (Array.isArray(messages) && messages.length > 0) {
          // take first error
          const error = messages[0]?.text || null;
          if (!controller.signal.aborted) setValidationError(error);
        }
      }
    } catch {
      // if validation fails don't throw an error
    } finally {
      // only set an error if we got back a 400
      if (status !== 400 && !controller.signal.aborted) {
        setValidationError(null);
      }
    }
  }

  const handleChange = (event, value) => {
    const payload = value || event.detail || {};
    props.childrenProps.onChange({
      callingCode: parseInt(payload.callingCode, 10) || null,
      countryCode: payload.countryCode || null,
      contact: payload.contact,
      isValid: payload.isValid,
      error: payload.error,
      touched: payload.touched,
      required: mappedProps.required,
    });
    if (payload.isValid) {
      // fire and forget instead of awaiting
      validateContact(event);
    }
  };

  const error = validationError || mappedProps.error;

  return (
    <VaTelephoneInput
      onVaContact={handleChange}
      {...mappedProps}
      error={error}
    />
  );
}
