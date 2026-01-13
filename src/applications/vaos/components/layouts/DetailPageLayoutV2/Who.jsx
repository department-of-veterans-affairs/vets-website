import PropTypes from 'prop-types';
import React from 'react';
import Section from '../../Section';

export default function Who({ children, level = 2 }) {
  if (!children) {
    return null;
  }
  return (
    <Section heading="Who" level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
Who.propTypes = {
  children: PropTypes.node,
  level: PropTypes.number,
};
