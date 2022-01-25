import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERN,
} from '@department-of-veterans-affairs/component-library/Telephone';

export function VarProp() {
  const contact = 4392819283;

  return <Telephone contact={contact} />;
}

export function WithPattern() {
  return (
    <Telephone
      contact={CONTACTS['711']}
      extension="123"
      pattern={PATTERN['3_DIGIT']}
    />
  );
}

export function MultilineInternational() {
  return (
    <div>
      <div>
        <div>
          <Telephone
            notClickable
            contact={CONTACTS.VA_BENEFITS}
            pattern={PATTERN.OUTSIDE_US}
          />
        </div>
      </div>
    </div>
  );
}
