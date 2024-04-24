import React from 'react';
import PropTypes from 'prop-types';

const stripAvsTitle = lines => {
  return lines.filter(line => {
    return !line.match(/^\s*After[- ]Visit Summary\s*$/i);
  });
};

function AvsPageHeader({ text }) {
  let lines = text.split('\n');
  lines = stripAvsTitle(lines);
  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < lines.length - 1 && <br role="presentation" />}
    </React.Fragment>
  ));
}

export default AvsPageHeader;

AvsPageHeader.propTypes = {
  text: PropTypes.string,
};
