import React from 'react';
import PropTypes from 'prop-types';

import ParagraphBlock from './ParagraphBlock';

const MoreInformation = props => {
  // eslint-disable-next-line no-unused-vars
  const { avs } = props;

  return (
    <div>
      <ParagraphBlock
        heading="More help and information"
        content={avs.moreHelpAndInformation}
        htmlContent
      />
    </div>
  );
};

export default MoreInformation;

MoreInformation.propTypes = {
  avs: PropTypes.object,
};
