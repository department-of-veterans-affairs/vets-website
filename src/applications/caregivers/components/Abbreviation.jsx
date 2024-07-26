import React from 'react';
import PropTypes from 'prop-types';
import content from '../locales/en/content.json';

const Abbr = ({ key }) => (
  <dfn>
    <abbr title={content[`dfn--${key}-title`]}>
      {content[`dfn--${key}-abbr`]}
    </abbr>
  </dfn>
);

Abbr.propTypes = {
  key: PropTypes.string,
};

export default Abbr;
