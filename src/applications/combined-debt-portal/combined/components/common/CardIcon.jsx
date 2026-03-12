import React from 'react';
import { cardIconPropTypes } from './prop-types/CommonPropTypes';

const SRTEXT = {
  warning: 'Important',
  info: 'Informational',
  phone: 'Phone',
};

const CardIcon = ({ type }) => {
  return (
    <va-icon
      icon={type}
      size={3}
      class={`icon-color--${type} vads-u-padding-right--1`}
      srtext={SRTEXT[type]}
    />
  );
};
CardIcon.propTypes = cardIconPropTypes;

export default CardIcon;
