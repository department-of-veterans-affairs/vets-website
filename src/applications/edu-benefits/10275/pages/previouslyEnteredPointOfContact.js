// previouslyEnteredPointOfContact.js
import React from 'react';
import { useSelector } from 'react-redux';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import EnteredPointOfContact from '../components/EnteredPointOfContact';

const nameFrom = person => {
  const fn = person?.fullName || {};
  return [fn?.first, fn?.middle, fn?.last].filter(Boolean).join(' ');
};

const toKey = obj => `k_${btoa(JSON.stringify(obj)).slice(0, 12)}`;

export const buildContactOptions = formData => {
  const contacts = [];
  if (!formData?.newCommitment) {
    return [
      {
        key: 'none',
        label: 'None of the above, I will enter a new point of contact',
        data: 'none',
      },
    ];
  }

  const poe = formData.newCommitment?.principlesOfExcellencePointOfContact;
  const sco = formData.newCommitment?.schoolCertifyingOfficial;

  const pushContact = c => {
    // Multiple safety checks to prevent undefined access
    if (!c) return;
    if (!c.fullName) return;
    if (typeof c.fullName !== 'object') return;
    if (!c.fullName.first) return;

    try {
      const fullName = nameFrom(c);
      if (!fullName) return;
      const data = {
        fullName: c.fullName,
        title: c?.title || '',
        email: c?.email || '',
      };
      contacts.push({
        key: toKey(data),
        label: fullName,
        email: data.email,
        data,
      });
    } catch (error) {
      console.warn('Error processing contact:', error);
    }
  };

  pushContact(sco);
  pushContact(poe);

  return [
    ...contacts,
    {
      key: 'none',
      label: 'None of the above, I will enter a new point of contact',
      email: null,
      data: 'none',
    },
  ];
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
    'ui:widget': props => {
      const WidgetComponent = () => {
        const formData = useSelector(state => state.form.data);
        const options = buildContactOptions(formData);
        let parsedValue = props.value;
        if (typeof props.value === 'string' && props.value !== 'none') {
          try {
            parsedValue = JSON.parse(props.value);
          } catch (e) {
            parsedValue = props.value;
          }
        }
        const handleChange = value => {
          if (value === 'none') {
            props.onChange('none');
          } else if (typeof value === 'object') {
            props.onChange(JSON.stringify(value));
          } else {
            props.onChange(value);
          }
        };

        return (
          <EnteredPointOfContact
            value={parsedValue}
            onChange={handleChange}
            options={options}
          />
        );
      };
      return <WidgetComponent />;
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    previouslyEnteredPointOfContact: {
      type: 'string',
    },
  },
};
