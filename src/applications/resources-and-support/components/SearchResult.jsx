import PropTypes from 'prop-types';
import React from 'react';
import { truncate } from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import { Article } from '../prop-types';
import { ENTITY_BUNDLES } from '../content-modeling';

const articleTypes = {
  [ENTITY_BUNDLES.Q_A]: 'Question and answer',
  [ENTITY_BUNDLES.CHECKLIST]: 'Checklist',
  [ENTITY_BUNDLES.MEDIA_LIST_IMAGES]: 'Images',
  [ENTITY_BUNDLES.MEDIA_LIST_VIDEOS]: 'Videos',
  [ENTITY_BUNDLES.SUPPORT_RESOURCES_DETAIL_PAGE]: 'About',
  [ENTITY_BUNDLES.FAQ_MULTIPLE_Q_A]: 'Multiple FAQs',
  [ENTITY_BUNDLES.STEP_BY_STEP]: 'Step-by-step',
};

export const SearchResult = ({
  article,
  page,
  position,
  query,
  totalResults,
}) => {
  const onSearchResultClick = () => {
    // Track search result click.
    recordEvent({
      event: 'onsite-search-results-click',
      'search-page-path': document.location.pathname,
      'search-query': query,
      'search-result-chosen-page-url': article.entityUrl.path,
      'search-result-chosen-title': article.title,
      'search-results-pagination-current-page': page,
      'search-results-position': position,
      'search-results-top-recommendation': undefined,
      'search-results-total-count': totalResults,
      'search-results-total-pages': Math.ceil(totalResults / 10),
      'search-result-type': 'title',
      'search-selection': 'Resources and support',
    });
  };

  return (
    <div className="vads-u-padding-y--4 vads-u-border-top--1px vads-u-border-color--gray-lighter">
      <div id={article.entityUrl.path} className="vads-u-margin-bottom--1p5">
        <dfn className="sr-only">Article type: </dfn>
        {articleTypes[article.entityBundle]}
      </div>
      <h3
        aria-describedby={article.entityUrl.path}
        className="vads-u-margin-top--0 vads-u-font-size--md"
      >
        <va-link
          onClick={onSearchResultClick}
          href={article.entityUrl.path}
          text={article.title}
        />
      </h3>
      <p className="vads-u-margin-top--1p5 vads-u-margin-bottom--0">
        {truncate(article.introText, { length: 190 })}
      </p>
    </div>
  );
};

SearchResult.propTypes = {
  article: Article,
  page: PropTypes.number,
  position: PropTypes.number.isRequired,
  query: PropTypes.string,
  totalResults: PropTypes.number,
};

export default SearchResult;
