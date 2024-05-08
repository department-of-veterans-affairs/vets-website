import React from 'react';
import PropTypes from 'prop-types';

import ClaimLetterListItem from './ClaimLetterListItem';

const renderLetters = letters =>
  letters.map(letter => (
    <ClaimLetterListItem key={letter.documentId} letter={letter} />
  ));

const ClaimLetterList = ({ letters }) => (
  <>
    {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
    <ol
      id="claim-letter-list"
      className="usa-unstyled-list vads-u-margin--0"
      role="list"
    >
      {renderLetters(letters)}
    </ol>
  </>
);

ClaimLetterList.propTypes = {
  letters: PropTypes.array,
};

export default ClaimLetterList;
