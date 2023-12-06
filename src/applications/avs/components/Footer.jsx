import React from 'react';
import PropTypes from 'prop-types';

import { getFormattedGenerationDate } from '../utils';

const Footer = props => {
  const { avs } = props;
  const generationDate = getFormattedGenerationDate(avs);

  if (generationDate) {
    return (
      <p data-testid="avs-footer">
        Date and time generated
        <br />
        {generationDate}
      </p>
    );
  }

  return null;
};

export default Footer;

Footer.propTypes = {
  avs: PropTypes.object,
};
