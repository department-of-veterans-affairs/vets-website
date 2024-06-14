import React from 'react';
import PropTypes from 'prop-types';

import { kebabCase } from 'lodash';

const ParagraphBlock = props => {
  const { content, heading, headingLevel = 3, htmlContent = false } = props;

  if (content) {
    const Heading = `h${headingLevel}`;
    const testId = kebabCase(heading.substring(0, 32));
    const paragraph = htmlContent ? (
      /* eslint-disable react/no-danger */
      /*
         We're choosing to trust the HTML coming from AVS since it is explicitly
         added there and will give us the highest fidelity with the printed AVS.
         cf. https://github.com/department-of-veterans-affairs/avs/blob/master/ll-avs-web/src/main/java/gov/va/med/lom/avs/client/thread/DelimitedNoteContentThread.java
      */
      <p data-testid={testId} dangerouslySetInnerHTML={{ __html: content }} />
    ) : (
      /* eslint-enable react/no-danger */
      <p data-testid={testId}>{content}</p>
    );

    return (
      <div>
        <Heading>{heading}</Heading>
        {paragraph}
      </div>
    );
  }

  return null;
};

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  content: PropTypes.string,
  heading: PropTypes.string,
  headingLevel: PropTypes.number,
  htmlContent: PropTypes.bool,
};
