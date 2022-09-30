import React from 'react';
import PropTypes from 'prop-types';

import ClaimLetterListItem from './ClaimLetterListItem';

const ClaimLetterList = ({ letters }) => {
  return letters.map(letter => (
    <ClaimLetterListItem key={letter.documentId} letter={letter} />
  ));
};

ClaimLetterList.propTypes = {
  letters: PropTypes.array,
};

export default ClaimLetterList;
