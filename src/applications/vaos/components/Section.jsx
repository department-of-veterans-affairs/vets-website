import React from 'react';
import PropTypes from 'prop-types';

export default function Section({ children, heading, level = 2 }) {
  const Heading = `h${level}`;

  return (
    <>
      <Heading
        role="heading"
        className="vads-u-font-size--h4 vads-u-margin-bottom--0p5"
      >
        {heading}
      </Heading>
      {children}
    </>
  );
}

Section.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
  level: PropTypes.number,
};
