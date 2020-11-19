// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { ENTITY_BUNDLES } from 'site/constants/content-modeling';
import { Article } from '../prop-types';

const articleTypes = {
  [ENTITY_BUNDLES.Q_A]: 'Question and answer',
  [ENTITY_BUNDLES.CHECKLIST]: 'Checklist',
  [ENTITY_BUNDLES.MEDIA_LIST_IMAGES]: 'Images',
  [ENTITY_BUNDLES.MEDIA_LIST_VIDEOS]: 'Videos',
  [ENTITY_BUNDLES.SUPPORT_RESOURCES_DETAIL_PAGE]: 'About',
  [ENTITY_BUNDLES.FAQ_MULTIPLE_Q_A]: 'Multiple FAQs',
  [ENTITY_BUNDLES.STEP_BY_STEP]: 'Step-by-step',
};

export default function SearchResult({
  article,
  position,
  query,
  totalResults,
}) {
  const onSearchResultClick = () => {
    recordEvent({
      event: 'onsite-search-results-click',
      'search-text-input': query,
      'search-selection': 'Resources and support',
      'search-results-total-count': totalResults,
      'search-results-total-pages': Math.ceil(totalResults / 10),
      'search-results-position-number': position,
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
      <p
        className="vads-u-margin-bottom--0"
        // the article descriptions contain HTML entities
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: article.description }}
      />
    </div>
  );
}

SearchResult.propTypes = {
  article: Article,
  position: PropTypes.number.isRequired,
  query: PropTypes.string,
  totalResults: PropTypes.number,
};
