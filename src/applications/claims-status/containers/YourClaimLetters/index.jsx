import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { getClaimLetters } from '../../actions';
import ClaimsBreadcrumbs from '../../components/ClaimsBreadcrumbs';
import ClaimLetterList from '../../components/claim-letters/ClaimLetterList';
import WIP from '../../components/WIP';
import { ITEMS_PER_PAGE } from '../../constants';
import { isLoadingFeatures, showClaimLettersFeature } from '../../selectors';
import NoLettersContent from './errorComponents/NoLettersContent';
import ServerErrorContent from './errorComponents/ServerErrorContent';
import UnauthenticatedContent from './errorComponents/UnauthenticatedContent';
import { setDocumentTitle } from '../../utils/helpers';
import { setPageFocus } from '../../utils/page';

const paginateItems = items => {
  return items?.length ? chunk(items, ITEMS_PER_PAGE) : [[]];
};

export const YourClaimLetters = ({ isLoading, showClaimLetters }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lettersLoading, setLettersLoading] = useState(true);
  // Using `useRef` here to avoid triggering a rerender whenever these are
  // updated
  const totalItems = useRef(0);
  const totalPages = useRef(0);
  const paginatedItems = useRef([]);
  const requestStatus = useRef(200);
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const iscstIncludeDdlBoaLettersEnabled = useToggleValue(
    TOGGLE_NAMES.cstIncludeDdlBoaLetters,
  );
  const claimLetterHeader = iscstIncludeDdlBoaLettersEnabled
    ? 'Your VA claim and appeal letters'
    : 'Your VA claim letters';

  const claimLetterSubText = iscstIncludeDdlBoaLettersEnabled
    ? 'You can download your claim letters and appeal decisions. We also mail these to you.'
    : 'You can download your claim letters. We also mail you these letters.';

  useEffect(() => {
    getClaimLetters()
      .then(data => {
        paginatedItems.current = paginateItems(data);
        totalItems.current = data?.length || 0;
        totalPages.current = paginatedItems.current.length;

        setCurrentItems(paginatedItems.current[currentPage - 1]);
        requestStatus.current = 200;
      })
      .catch(error => {
        if (error.errors) {
          requestStatus.current = Number(error?.errors[0].code);
        } else {
          requestStatus.current = error.status;
        }
      })
      .then(() => {
        setLettersLoading(false);
      });

    setDocumentTitle('Your VA Claim Letters');
  }, []);

  useEffect(() => {
    setPageFocus();
  });

  /**
   * This commented code was deemed likely to be needed.
   * Commented on: 01/06/2023
   * Stale by: 03/01/2023
   */
  // const getFromToNums = (page, total) => {
  //   const from = (page - 1) * ITEMS_PER_PAGE + 1;
  //   const to = Math.min(page * ITEMS_PER_PAGE, total);

  //   return [from, to];
  // };

  const onPageChange = page => {
    setCurrentItems(paginatedItems.current[page - 1]);
    setCurrentPage(page);
  };

  const getSectionBodyContent = statusCode => {
    if (statusCode === 500) {
      return <ServerErrorContent />;
    }

    if (statusCode === 401 || statusCode === 403) {
      return <UnauthenticatedContent />;
    }

    return (
      <>
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
    );
  };

  if (isLoading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  let content;

  if (showClaimLetters) {
    content = (
      <>
        <h1>{claimLetterHeader}</h1>
        <div className="vads-u-font-size--lg vads-u-padding-bottom--1">
          {claimLetterSubText}
        </div>
        {lettersLoading ? (
          <va-loading-indicator message="Loading your claim letters..." />
        ) : (
          getSectionBodyContent(requestStatus.current)
        )}
      </>
    );
  } else {
    content = <WIP />;
  }

  const crumb = {
    href: `../your-claim-letters`,
    label: `${claimLetterHeader}`,
    isRouterLink: true,
  };

  return (
    <article id="claim-letters" className="row vads-u-margin-bottom--5">
      <div className="usa-width-two-thirds medium-8 columns">
        <ClaimsBreadcrumbs crumbs={[crumb]} />
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
