import PropTypes from 'prop-types';
import React from 'react';
import Section from '../../Section';

export function Prepare({ children } = {}) {
  return <Section heading="Prepare for your appointment">{children}</Section>;
}
Prepare.propTypes = {
  children: PropTypes.node,
};
