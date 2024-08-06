import React from 'react';
import PropTypes from 'prop-types';
import content from '../locales/en/content.json';

const Abbr = ({ abbrKey }) => (
  <dfn>
    <abbr title={content[`dfn--${abbrKey}-title`]}>
      {content[`dfn--${abbrKey}-abbr`]}
    </abbr>
  </dfn>
);

Abbr.propTypes = {
  abbrKey: PropTypes.string,
};

export default Abbr;
