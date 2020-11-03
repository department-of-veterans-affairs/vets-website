import React from 'react';

import { ENTITY_BUNDLES } from 'site/constants/content-modeling';

import { Article } from '../prop-types';

const articleTypes = {
  [ENTITY_BUNDLES.Q_A]: 'Question and answer',
  [ENTITY_BUNDLES.CHECKLIST]: 'Checklist',
  [ENTITY_BUNDLES.MEDIA_LIST_IMAGES]: 'Media list',
  [ENTITY_BUNDLES.MEDIA_LIST_VIDEOS]: 'Media list',
  [ENTITY_BUNDLES.SUPPORT_RESOURCES_DETAIL_PAGE]: 'About',
  [ENTITY_BUNDLES.FAQ_MULTIPLE_Q_A]: 'FAQs',
  [ENTITY_BUNDLES.STEP_BY_STEP]: 'Step-by-step',
};

export default function SearchResult({ article }) {
  return (
    <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-color--gray-lighter">
      <div>
        <dfn className="sr-only">Article type: </dfn>
        {articleTypes[article.entityBundle]}
      </div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        <a href={article.entityUrl.path}>{article.title}</a>
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
};
