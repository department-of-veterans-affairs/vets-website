import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import EnteredPoc from '../components/EnteredPoc';

const nameFrom = person =>
  [person?.fullName?.first, person?.fullName?.middle, person?.fullName?.last]
    .filter(Boolean)
    .join(' ');

// Removed legacy enum builder (now returning full object via custom widget)

// Stable, top-level widget component so hooks are valid and state isn't reset by remounts
const PreviouslyEnteredPOCWidget = props => {
  const full = useSelector(state => state.form.data);
  // Build options for the custom widget
  const options = [];
  const sco = full?.newCommitment?.schoolCertifyingOfficial;
  const poe = full?.newCommitment?.principlesOfExcellencePointOfContact;
  const push = (key, contact) => {
    const nm = contact && nameFrom(contact);
    if (!nm) return;
    const phone =
      contact?.usPhone ||
      contact?.internationalPhone ||
      contact?.phoneNumber ||
      contact?.internationalPhoneNumber ||
      '';
    const title = contact?.title || '';
    options.push({
      key,
      label: nm,
      email: contact?.email || '',
      data: {
        key,
        fullName: nm,
        title,
        email: contact?.email || '',
        phone,
      },
    });
  };
  const authorizedOfficial = full?.authorizedOfficial;
  const authorizedOfficialName =
    authorizedOfficial && nameFrom(authorizedOfficial);
  if (authorizedOfficialName) {
    const phone =
      authorizedOfficial?.usPhone ||
      authorizedOfficial?.internationalPhone ||
      authorizedOfficial?.phoneNumber ||
      authorizedOfficial?.internationalPhoneNumber ||
      '';
    const title = authorizedOfficial?.title || '';
    options.push({
      key: 'authorizedOfficial',
      label: authorizedOfficialName,
      email: authorizedOfficial?.email || '',
      data: {
        key: 'authorizedOfficial',
        fullName: authorizedOfficialName,
        title,
        email: authorizedOfficial?.email || '',
        phone,
      },
    });
  }
  push('sco', sco);
  push('poe', poe);
  // Also include any additionalLocations entries (new POCs captured earlier)
  full?.additionalLocations?.forEach((loc, idx) => {
    const fn = loc?.fullName || {};
    const name = [fn.first, fn.middle, fn.last].filter(Boolean).join(' ');
    const email = loc?.email || '';
    if (!name && !email) return;
    const phone =
      loc?.usPhone ||
      loc?.internationalPhone ||
      loc?.phoneNumber ||
      loc?.internationalPhoneNumber ||
      '';
    options.push({
      key: `new-${idx}`,
      label: name,
      email,
      data: { key: `new-${idx}`, fullName: name, email, phone },
    });
  });
  options.push({
    key: 'none',
    label: 'None of the above, I will enter a new point of contact',
    email: '',
    data: { key: 'none' },
  });

  const valueProp = props.value !== undefined ? props.value : props.formData;
  return (
    <EnteredPoc value={valueProp} onChange={props.onChange} options={options} />
  );
};

PreviouslyEnteredPOCWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.any,
  value: PropTypes.any,
};

export const uiSchema = {
  ...titleUI({
    title: 'Use a previously entered point of contact',
    description:
      'You can choose someone you’ve already entered on this form as the point of contact for this location. If you select “None of the above,” you’ll be able to enter a new point of contact on the next page.',
  }),
  previouslyEnteredPointOfContact: {
    'ui:title':
      'Select a name below to use them as the point of contact for this additional location.',
    'ui:field': PreviouslyEnteredPOCWidget,
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'You must provide a response',
    },
    'ui:validations': [
      (errors, formData, _uiSchema, _schema, errorMessages) => {
        if (!formData || !formData.key) {
          errors.addError(
            errorMessages?.required || 'You must provide a response',
          );
        }
      },
    ],
    'ui:options': {
      showFieldLabel: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    previouslyEnteredPointOfContact: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        fullName: { type: 'string' },
        title: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
      },
    },
  },
  required: ['previouslyEnteredPointOfContact'],
};
