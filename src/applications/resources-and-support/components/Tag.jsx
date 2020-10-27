import React from 'react';

import { TaxonomyTerm } from '../prop-types';

export default function Tag({ term }) {
  return (
    <a
      href={term.entityUrl.path}
      style={{ borderRadius: 3 }}
      className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 usa-button-secondary vads-u-font-size--sm vads-u-border--1px vads-u-border-color--primary-alt vads-u-padding--0p25 vads-u-padding-x--0p5 medium-screen:vads-u-margin-left--1 vads-u-text-decoration--none vads-u-color--base"
    >
      {term.name}
    </a>
  );
}

Tag.propTypes = {
  term: TaxonomyTerm.isRequired,
};
