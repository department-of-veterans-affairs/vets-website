import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { setFocus } from '../utils/page';

const MAX_CONTENTIONS = 3;

function ClaimsContentionList({ contentions, contentionsHeader }) {
  const ellipsis = useRef(null);
  const additionalContentions = useRef(null);
  const viewMoreBtn = useRef(null);
  const hasContentions = contentions && contentions.length;
  const contentionsText = hasContentions
    ? contentions
        .slice(0, MAX_CONTENTIONS)
        .map(cond => cond.name)
        .join(', ')
    : 'Not available';
  const additionalContentionsText = hasContentions
    ? contentions
        .slice(MAX_CONTENTIONS, contentions.length)
        .map(cond => cond.name)
        .join(', ')
    : false;

  const showAdditionalContentions = () => {
    ellipsis.current.style.display = 'none';
    additionalContentions.current.style.display = 'inline';
    viewMoreBtn.current.style.display = 'none';
    setFocus(contentionsHeader.current);
  };

  return (
    <>
      <span className="claim-contentions-list">{contentionsText}</span>
      {hasContentions && contentions.length > MAX_CONTENTIONS ? (
        <>
          <span className="ellipsis" ref={ellipsis}>
            &hellip;
          </span>
          <span className="additional-contentions" ref={additionalContentions}>
            , {additionalContentionsText}
          </span>
          <span>
            <br />
            <va-button
              class="view-more-contentions-btn"
              onClick={() => {
                showAdditionalContentions();
              }}
              secondary
              text="Show full list"
              ref={viewMoreBtn}
            />
          </span>
        </>
      ) : null}
    </>
  );
}

ClaimsContentionList.propTypes = {
  contentions: PropTypes.array,
  contentionsHeader: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

export default ClaimsContentionList;
