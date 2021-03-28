import React from 'react';
import DynamicCheckboxWidget from './DynamicCheckboxWidget.jsx';
import { vaLocation } from '../schema-imports';

function ReviewWidget({ value }) {
  return <span>{value}</span>;
}

export const schema = {
  vaLocation,
};

export const uiSchema = {
  vaLocation: {
    preferredFacility: {
      'ui:widget': DynamicCheckboxWidget,
      'ui:description': (
        <>
          <p>
            These are the VA medical centers closest to the address you
            provided. Select the medical center where you’d like to get your
            COVID-19 vaccine . If you don't select any, we'll match you with the
            closest one.
          </p>
          <p>
            <strong>Note</strong>: if you get a vaccine that requires 2 doses to
            be fully effective, you'll need to return to the same VA medical
            center to get your second dose.
          </p>
        </>
      ),
      'ui:options': {
        hideLabelText: true,
      },
      'ui:reviewWidget': ReviewWidget,
    },
  },
};
