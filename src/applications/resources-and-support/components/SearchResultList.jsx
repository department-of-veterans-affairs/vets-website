import React from 'react';
import PropTypes from 'prop-types';

import { Article, TaxonomyTerm } from '../prop-types';
import { ENTITY_BUNDLES } from '../constants';

const articleTypes = {
  [ENTITY_BUNDLES.Q_A]: 'Question and answer',
  [ENTITY_BUNDLES.CHECKLIST]: 'Checklist',
  [ENTITY_BUNDLES.MEDIA_LIST_IMAGES]: 'Media list',
  [ENTITY_BUNDLES.MEDIA_LIST_VIDEOS]: 'Media list',
  [ENTITY_BUNDLES.SUPPORT_RESOURCES_DETAIL_PAGE]: 'About',
  [ENTITY_BUNDLES.FAQ_MULTIPLE_Q_A]: 'FAQs',
  [ENTITY_BUNDLES.STEP_BY_STEP]: 'Step by step',
};

function Tag({ term }) {
  return (
    <a
      href={term.entityUrl.path}
      style={{ borderRadius: 3 }}
      className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 usa-button-secondary vads-u-font-size--sm vads-u-border--1px vads-u-border-color--primary-alt vads-u-padding--0p25 vads-u-padding-x--0p5 medium-screen:vads-u-margin-left--1 vads-u-text-decoration--none vads-u-color--base"
    >
      {term.name}
    </a>
  );
}

Tag.propTypes = {
  term: TaxonomyTerm.isRequired,
};

export default function SearchResultList({ results }) {
  return (
    <ul className="usa-unstyled-list">
      {results.map((article, articleIndex) => {
        return (
          <li key={`article-${articleIndex}`}>
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
              <div className="vads-u-margin-top--1">
                <dfn className="vads-u-font-weight--bold">Topics </dfn>
                <Tag term={article.fieldPrimaryCategory.entity} />
                {article.fieldOtherCategories?.map((otherCategory, index) => {
                  return (
                    <Tag
                      key={`category-${index}`}
                      term={otherCategory.entity}
                    />
                  );
                })}
              </div>
              {article.fieldTags?.entity?.fieldTopics?.length > 0 && (
                <div className="vads-u-margin-top--1">
                  <dfn className="vads-u-font-weight--bold">Audience </dfn>
                  {article.fieldTags?.entity?.fieldTopics?.map(
                    (fieldTopic, index) => {
                      return (
                        <Tag key={`topic-${index}`} term={fieldTopic.entity} />
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

SearchResultList.propTypes = {
  results: PropTypes.arrayOf(Article).isRequired,
};
