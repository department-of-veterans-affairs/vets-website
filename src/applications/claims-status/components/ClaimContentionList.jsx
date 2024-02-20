import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const MAX_CONTENTIONS = 3;

const renderContentions = (contentions, limit = MAX_CONTENTIONS) => {
  const list = contentions.slice(0, limit);

  return list.map((contention, index) => {
    return <li key={index}>{contention.name}</li>;
  });
};

function ClaimContentionList({ contentions, onClick }) {
  const [showAllContentions, setShowAllContentions] = useState(false);
  const hasContentions = contentions && contentions.length;

  const showAdditionalContentions = () => {
    setShowAllContentions(true);
    onClick();
  };

  if (!hasContentions) return <div>Not Available</div>;
  const limit = showAllContentions ? contentions.length : MAX_CONTENTIONS;
  const showButton =
    !showAllContentions && contentions.length > MAX_CONTENTIONS;

  return (
    <>
      <ul>{renderContentions(contentions, limit)}</ul>
      {showButton && (
        <va-button
          class="show-all-button"
          onClick={showAdditionalContentions}
          secondary
          text="Show full list"
          uswds="false"
        />
      )}
    </>
  );
}

ClaimContentionList.propTypes = {
  contentions: PropTypes.array,
  onClick: PropTypes.func,
};

export default ClaimContentionList;
