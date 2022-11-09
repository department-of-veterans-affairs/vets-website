import React from 'react';
import PropTypes from 'prop-types';

import ClaimLetterListItem from './ClaimLetterListItem';

const renderLetters = letters =>
  letters.map(letter => (
    <ClaimLetterListItem key={letter.documentId} letter={letter} />
  ));

const ClaimLetterList = ({ letters }) => (
  <ol className="vads-u-margin--0 vads-u-padding--0">
    {renderLetters(letters)}
  </ol>
);

ClaimLetterList.propTypes = {
  letters: PropTypes.array,
};

export default ClaimLetterList;
