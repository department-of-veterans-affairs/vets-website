// previouslyEnteredPointOfContact.js
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import EnteredPointOfContact from '../components/EnteredPoc';

const nameFrom = person =>
  [person?.fullName?.first, person?.fullName?.middle, person?.fullName?.last]
    .filter(Boolean)
    .join(' ');

const buildContacts = full => {
  const items = [];

  // School Certifying Official
  const sco = full?.newCommitment?.schoolCertifyingOfficial;
  const scoName = sco && nameFrom(sco);
  if (scoName)
    items.push({
      value: 'sco',
      label: `${scoName}\n${sco?.email || ''}`,
    });

  const poe = full?.newCommitment?.principlesOfExcellencePointOfContact;
  const poeName = poe && nameFrom(poe);
  if (poeName)
    items.push({
      value: 'poe',
      label: `${poeName}\n${poe?.email || ''}`,
    });
  full?.additionalLocations?.forEach((location, idx) => {
    const fn = location?.fullName || {};
    const name = [fn.first, fn.middle, fn.last].filter(Boolean).join(' ');
    const email = location?.email || '';
    if (!name && !email) return;
    items.push({
      value: `new-${idx}`,
      label: `${name}\n${email}`,
    });
  });
  return {
    enum: ['none', ...items.map(i => i.value)],
    enumNames: ['None of the above', ...items.map(i => i.label)],
  };
};

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
    options.push({ key, label: nm, email: contact?.email || '' });
  };
  push('sco', sco);
  push('poe', poe);
  // Also include any additionalLocations entries (new POCs captured earlier)
  full?.additionalLocations?.forEach((loc, idx) => {
    const fn = loc?.fullName || {};
    const name = [fn.first, fn.middle, fn.last].filter(Boolean).join(' ');
    const email = loc?.email || '';
    if (!name && !email) return;
    options.push({ key: `new-${idx}`, label: name, email });
  });
  options.push({
    key: 'none',
    label: 'None of the above, I will enter a new point of contact',
    email: '',
  });

  const valueKey = typeof props.value === 'string' ? props.value : 'none';
  return (
    <EnteredPointOfContact
      value={valueKey}
      onChange={props.onChange}
      options={options}
    />
  );
};

PreviouslyEnteredPOCWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
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
    'ui:widget': PreviouslyEnteredPOCWidget,
    'ui:options': {
      // On array item pages use the full form data argument
      updateSchema: (_itemData, _itemSchema, _ui, _idx, _path, fullFormData) =>
        buildContacts(fullFormData),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    previouslyEnteredPointOfContact: {
      type: 'string',
      enum: ['none'],
      enumNames: ['None of the above'],
    },
  },
  required: ['previouslyEnteredPointOfContact'],
};
