import PropTypes from 'prop-types';
import React from 'react';
import Section from '../../Section';

export function Where({ children, heading = 'Where', level = 2 } = {}) {
  return (
    <Section heading={heading} level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
Where.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
  level: PropTypes.number,
};
