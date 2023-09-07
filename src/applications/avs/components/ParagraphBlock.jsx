import React from 'react';
import PropTypes from 'prop-types';

import { kebabCase } from 'lodash';

const ParagraphBlock = props => {
  const { content, heading } = props;

  if (content) {
    return (
      <div>
        <h3>{heading}</h3>
        <p data-testid={kebabCase(heading.substring(0, 32))}>{content}</p>
      </div>
    );
  }

  return null;
};

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  content: PropTypes.string,
  heading: PropTypes.string,
};
