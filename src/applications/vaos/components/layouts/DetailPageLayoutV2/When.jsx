import PropTypes from 'prop-types';
import React from 'react';
import Section from '../../Section';

export default function When({ children, level = 2 }) {
  return (
    <Section heading="When" level={level}>
      <span data-dd-privacy="mask">{children}</span>
    </Section>
  );
}
When.propTypes = {
  children: PropTypes.node,
  level: PropTypes.number,
};
