import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getClaimLetters } from '../actions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimLetterList from '../components/ClaimLetterList';
import WIP from '../components/WIP';
import { ITEMS_PER_PAGE } from '../constants';
import { isLoadingFeatures, showClaimLettersFeature } from '../selectors';

const paginateItems = items => {
  return items.length ? chunk(items, ITEMS_PER_PAGE) : [[]];
};

// const getFromToNums = (page, total) => {
//   const from = (page - 1) * ITEMS_PER_PAGE + 1;
//   const to = Math.min(page * ITEMS_PER_PAGE, total);

//   return [from, to];
// };

const NoLettersContent = () => (
  <>
    <h2 className="vads-u-font-size--h3">No letters to show</h2>
    <div className="vads-u-font-size--lg">
      It looks like you don’t have any letters from the VA at the moment. Check
      back when you’re notified about letters.
    </div>
  </>
);

export const YourClaimLetters = ({ isLoading, showClaimLetters }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lettersLoading, setLettersLoading] = useState(true);
  // Using `useRef` here to avoid triggering a rerender whenever these are
  // updated
  const totalItems = useRef(0);
  const totalPages = useRef(0);
  const paginatedItems = useRef([]);

  useEffect(() => {
    getClaimLetters().then(data => {
      paginatedItems.current = paginateItems(data);
      totalItems.current = data.length;
      totalPages.current = paginatedItems.current.length;

      setCurrentItems(paginatedItems.current[currentPage - 1]);
      setLettersLoading(false);
    });

    document.title = 'Your VA Claim Letters | Veterans Affairs';
  }, []);

  const onPageChange = page => {
    setCurrentItems(paginatedItems.current[page - 1]);
    setCurrentPage(page);
  };

  if (isLoading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  let content;

  if (showClaimLetters) {
    // const fromToNums = getFromToNums(currentPage, totalItems.current);

    content = (
      <>
        <h1>Your VA claim letters</h1>
        <div className="vads-u-font-size--lg vads-u-padding-bottom--1">
          We send you letters to update you on the status of your claims,
          appeals, and decision reviews. Download your claim letters on this
          page.
        </div>
        {lettersLoading ? (
          <va-loading-indicator message="Loading your claim letters..." />
        ) : (
          <>
            {/* <p className="vads-u-font-size--lg vads-u-font-family--serif">
              Showing {fromToNums[0]} - {fromToNums[1]} of {totalItems.current}{' '}
              claim letters
            </p> */}
            {currentItems?.length ? (
              <ClaimLetterList letters={currentItems} />
            ) : (
              <NoLettersContent />
            )}
            {totalPages.current > 1 && (
              <VaPagination
                onPageSelect={e => onPageChange(e.detail.page)}
                page={currentPage}
                pages={totalPages.current}
                maxPageListLength={ITEMS_PER_PAGE}
              />
            )}
          </>
        )}
      </>
    );
  } else {
    content = <WIP />;
  }

  return (
    <article id="claim-letters" className="row vads-u-margin-bottom--5">
      <div className="usa-width-two-thirds medium-8 columns">
        <ClaimsBreadcrumbs>
          <Link to="your-claim-letters" key="your-claim-letters">
            Your VA claim letters
          </Link>
        </ClaimsBreadcrumbs>
        {content}
      </div>
    </article>
  );
};

const mapStateToProps = state => ({
  isLoading: isLoadingFeatures(state),
  showClaimLetters: showClaimLettersFeature(state),
});

YourClaimLetters.propTypes = {
  isLoading: PropTypes.bool,
  showClaimLetters: PropTypes.bool,
};

export default connect(mapStateToProps)(YourClaimLetters);
