import React from 'react';
import PropTypes from 'prop-types';

function TextWithLineBreaks({ text }) {
  const lines = text.split('\n');
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < lines.length - 1 && <br role="presentation" />}
    </React.Fragment>
  ));
}

export default TextWithLineBreaks;

TextWithLineBreaks.propTypes = {
  text: PropTypes.string,
};
