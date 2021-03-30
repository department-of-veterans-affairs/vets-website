// Node modules.
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { truncate } from 'lodash';
// Relative imports.
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import recordEvent from 'platform/monitoring/record-event';
import { Article } from '../prop-types';
import { ENTITY_BUNDLES } from 'site/constants/content-modeling';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

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
  searchTypeaheadEnabled,
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
      'search-typeahead-enabled': searchTypeaheadEnabled,
    });
  };

  return (
    <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-color--gray-lighter">
      <div>
        <dfn className="sr-only">Article type: </dfn>
        {articleTypes[article.entityBundle]}
      </div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        <a onClick={onSearchResultClick} href={article.entityUrl.path}>
          {article.title}
        </a>
      </h2>
      <p className="vads-u-margin-bottom--0">
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

const mapStateToProps = store => ({
  searchTypeaheadEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.searchTypeaheadEnabled
  ],
});

export default connect(
  mapStateToProps,
  null,
)(SearchResult);
