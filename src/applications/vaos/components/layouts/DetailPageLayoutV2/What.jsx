import PropTypes from 'prop-types';
import React from 'react';
import Section from '../../Section';

export function What({ children, level = 2 }) {
  if (!children) {
    return null;
  }
  return (
    <Section heading="What" level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
What.propTypes = {
  children: PropTypes.node,
  level: PropTypes.number,
};
