import React from 'react';
import { useTranslation } from 'react-i18next';
import CardIcon from './CardIcon';
import { phoneNumbersPropTypes } from './prop-types/CommonPropTypes';

const PhoneNumbers = ({ phoneSet }) => {
  const { t } = useTranslation();
  if (!phoneSet) return null;
  return (
    <div className="vads-u-margin-top--2">
      {Object.entries(phoneSet).map(([key, entry]) => {
        const label = entry.labelKey ? t(entry.labelKey) : entry.label;
        const value = entry.valueKey ? t(entry.valueKey) : entry.value;
        const isInternational =
          key === 'international' ||
          label?.toLowerCase().includes('international');
        return (
          <p key={key}>
            <CardIcon type="phone" />
            {label && <strong>{label} </strong>}
            <va-telephone
              contact={value}
              international={isInternational}
              class="vads-u-font-weight--bold"
            />
          </p>
        );
      })}
    </div>
  );
};

PhoneNumbers.propTypes = phoneNumbersPropTypes;

export default PhoneNumbers;
