/* eslint-disable no-param-reassign */

const _ = require('lodash');
const liquid = require('tinyliquid');
const he = require('he');

const { ENTITY_BUNDLES } = require('../../../constants/content-modeling');

const { logDrupal } = require('../drupal/utilities-drupal');

const PAGE_SIZE = 10;

const BREADCRUMB_BASE_PATH = [
  {
    url: {
      path: '/',
    },
    text: 'Home',
  },
  {
    url: {
      path: '/resources/',
    },
    text: 'Resources and support',
  },
];

const articleTypesByEntityBundle = {
  [ENTITY_BUNDLES.Q_A]: 'Question and answer',
  [ENTITY_BUNDLES.CHECKLIST]: 'Checklist',
  [ENTITY_BUNDLES.MEDIA_LIST_IMAGES]: 'Images',
  [ENTITY_BUNDLES.MEDIA_LIST_VIDEOS]: 'Videos',
  [ENTITY_BUNDLES.SUPPORT_RESOURCES_DETAIL_PAGE]: 'About',
  [ENTITY_BUNDLES.FAQ_MULTIPLE_Q_A]: 'Multiple FAQs',
  [ENTITY_BUNDLES.STEP_BY_STEP]: 'Step-by-step',
};

const entityBundlesForResourcesAndSupport = new Set(
  Object.keys(articleTypesByEntityBundle),
);

function getArticlesBelongingToResourcesAndSupportSection(files) {
  return Object.entries(files)
    .filter(([_fileName, file]) =>
      entityBundlesForResourcesAndSupport.has(file.entityBundle),
    )
    .map(([_fileName, file]) => file);
}

function excludeQaNodesThatAreNotStandalonePages(files) {
  for (const [fileName, file] of Object.entries(files)) {
    if (file.entityBundle === ENTITY_BUNDLES.Q_A && !file.fieldStandalonePage) {
      logDrupal(`excluding QA node ${file.entityId} from build`);
      delete files[fileName];
    }
  }
}

function groupByTags(allArticles) {
  const articleListingsByTag = {};
  const allTaggedArticles = allArticles.filter(a => !!a.fieldTags);

  for (const article of allTaggedArticles) {
    const {
      fieldTags: {
        entity: {
          fieldTopics,
          fieldAudienceBeneficiares,
          fieldNonBeneficiares,
        },
      },
    } = article;

    const terms = [...fieldTopics];

    if (fieldAudienceBeneficiares) {
      terms.push(fieldAudienceBeneficiares);
    }

    if (fieldNonBeneficiares) {
      terms.push(fieldNonBeneficiares);
    }

    terms.map(fieldTopic => fieldTopic.entity).forEach(fieldTopic => {
      const articleListing = articleListingsByTag[fieldTopic.name];

      if (!articleListing) {
        articleListingsByTag[fieldTopic.name] = {
          articles: [article],
          entityUrl: fieldTopic.entityUrl,
        };
      } else {
        articleListing.articles.push(article);
      }
    });
  }

  return articleListingsByTag;
}

function groupByCategory(allArticles) {
  const articleListingsByCategory = {};
  const categorizedArticles = allArticles.filter(a => !!a.fieldPrimaryCategory);

  for (const article of categorizedArticles) {
    const { fieldPrimaryCategory, fieldOtherCategories } = article;

    const primaryCategoryName = fieldPrimaryCategory.entity.name;
    const primaryCategoryArticleListing =
      articleListingsByCategory[primaryCategoryName];

    if (!primaryCategoryArticleListing) {
      articleListingsByCategory[primaryCategoryName] = {
        articles: [article],
        entityUrl: fieldPrimaryCategory.entity.entityUrl,
      };
    } else {
      primaryCategoryArticleListing.articles.push(article);
    }

    for (const otherCategory of fieldOtherCategories) {
      const otherCategoryName = otherCategory.entity.name;
      const otherCategoryArticles =
        articleListingsByCategory[otherCategoryName];

      if (!otherCategoryArticles) {
        articleListingsByCategory[otherCategoryName] = {
          articles: [article],
          entityUrl: otherCategory.entity.entityUrl,
        };
      } else {
        otherCategoryArticles.articles.push(article);
      }
    }
  }

  return articleListingsByCategory;
}

function createPaginatedArticleListings({
  articlesByGroupName,
  getTitle,
  getPaginationSummary,
}) {
  return Object.entries(articlesByGroupName).reduce(
    (files, groupNameArticlePairs) => {
      const [groupName, articleListing] = groupNameArticlePairs;

      const allArticlesForGroup = _.sortBy(articleListing.articles, 'title');

      // Example "articleListing.entityUrl.path" -> "/taxonomy/term/282"
      // Slice off the leading slash
      const groupRootUrl = articleListing.entityUrl.path.slice(1);
      const paginatedArticles = _.chunk(allArticlesForGroup, PAGE_SIZE);

      paginatedArticles.forEach((pageOfArticles, index) => {
        const pageNum = index > 0 ? `/${index + 1}/` : '/';

        // eslint-disable-next-line no-param-reassign
        pageOfArticles.uri = `${groupRootUrl}${pageNum}`;
      });

      const sectionTitle = getTitle(groupName);

      const categoryBreadcrumb = [
        ...BREADCRUMB_BASE_PATH,
        {
          url: {
            path: `/${groupRootUrl}/`,
          },
          text: sectionTitle,
        },
      ];

      const pagesForCategory = paginatedArticles.map(
        (pageOfArticles, index) => {
          const paginatorInner = paginatedArticles.map(
            (nextPage, pageIndex) => {
              return {
                label: pageIndex + 1,
                href: `/${nextPage.uri}`,
                class: pageIndex === index ? 'va-pagination-active' : '',
              };
            },
          );

          let paginatorPrev = null;
          let paginatorNext = null;

          if (index > 0) paginatorPrev = paginatorInner[index - 1].href;

          if (index + 1 < paginatedArticles.length)
            paginatorNext = paginatorInner[index + 1].href;

          const pageStart = index * PAGE_SIZE + 1;
          const pageEnd = Math.min(
            (index + 1) * PAGE_SIZE,
            allArticlesForGroup.length,
          );

          const paginationTitle = getPaginationSummary({
            pageStart,
            pageEnd,
            totalArticles: allArticlesForGroup.length,
            groupName,
          });

          const page = {
            articleTypesByEntityBundle,
            contents: Buffer.from(''),
            path: pageOfArticles.uri,
            entityUrl: {
              breadcrumb: [...categoryBreadcrumb],
            },
            layout: 'support_resources_article_listing.drupal.liquid',
            title: sectionTitle,
            articles: pageOfArticles,
            paginationTitle,
            paginator: {
              prev: paginatorPrev,
              inner: paginatorInner,
              next: paginatorNext,
            },
          };

          page.debug = JSON.stringify(page);

          return page;
        },
      );

      return [...files, ...pagesForCategory];
    },
    [],
  );
}

function createArticleListingsPages(files) {
  const allArticles = getArticlesBelongingToResourcesAndSupportSection(files);

  if (allArticles.length === 0) {
    logDrupal(
      'No articles found for the Resources and Support section of the website.',
    );
    return;
  }

  const articlesByTag = groupByTags(allArticles);
  const articlesByCategory = groupByCategory(allArticles);

  const articleListingsByCategoryFiles = createPaginatedArticleListings({
    articlesByGroupName: articlesByCategory,

    getTitle(categoryName) {
      return `All articles in: ${categoryName}`;
    },

    getPaginationSummary({
      pageStart,
      pageEnd,
      totalArticles,
      groupName: categoryName,
    }) {
      return `Showing ${pageStart} - ${pageEnd} of ${totalArticles} articles in "<strong>${categoryName}</strong>"`;
    },
  });

  const articleListingsByTagFiles = createPaginatedArticleListings({
    articlesByGroupName: articlesByTag,

    getTitle(tag) {
      return `All articles tagged: ${tag}`;
    },

    getPaginationSummary({
      pageStart,
      pageEnd,
      totalArticles,
      groupName: tag,
    }) {
      return `Showing ${pageStart} - ${pageEnd} of ${totalArticles} articles tagged "<strong>${tag}</strong>"`;
    },
  });

  [...articleListingsByCategoryFiles, ...articleListingsByTagFiles].forEach(
    page => {
      const path = `${page.path}index.html`;
      logDrupal(`Generating Resources and Support article listing at: ${path}`);
      files[path] = page;
    },
  );
}

function cleanHTML(text) {
  // Escape early if text is falsey since there's nothing to sanitize.
  if (!text) {
    return text;
  }

  // Strip out the html tags.
  const strippedHTML = liquid.filters.strip_html(text);

  // Strip out newlines.
  const strippedNewlines = liquid.filters.strip_newlines(strippedHTML);

  // Strip out character references (e.g. &amp;)
  return he.decode(strippedNewlines);
}

function deriveQASearchableContent(entity) {
  // Some QAs have react widgets, so we need to have it default to an empty string in that scenario.
  const wysiwyg = entity.fieldAnswer.entity?.fieldWysiwyg?.processed || '';

  // Sanitize the wysiwyg of HTML markup + character references.
  const cleanedWysiwyg = cleanHTML(wysiwyg);

  // Combine the title (question) and wysiwyg (answer).
  return `${entity.title} ${cleanedWysiwyg}`;
}

function deriveFAQMultipleQASearchableContent(entity) {
  return entity.fieldQAGroups
    .map(fieldQAGroup =>
      fieldQAGroup.entity.fieldQAs
        .map(fieldQA => deriveQASearchableContent(fieldQA.entity))
        .join(' '),
    )
    .join(' ');
}

function deriveStepByStepSearchableContent(entity) {
  return entity.fieldSteps
    .map(
      fieldStep =>
        `${fieldStep.entity.fieldSectionHeader} ${cleanHTML(
          fieldStep.entity.fieldStep
            .map(fieldSubStep => fieldSubStep.entity.fieldWysiwyg.processed)
            .join(' '),
        )}`,
    )
    .join(' ');
}

function deriveSupportResourcesDetailPageSearchableContent(entity) {
  return entity.fieldContentBlock
    .map(contentBlock => {
      switch (contentBlock.entity.entityBundle) {
        case 'wysiwyg': {
          return cleanHTML(contentBlock.entity.fieldWysiwyg.processed);
        }
        case 'table': {
          return cleanHTML(contentBlock.entity.fieldTable.tableValue);
        }
        case 'collapsible_panel': {
          return contentBlock.entity.fieldVaParagraphs
            .map(vaParagraph => {
              return `${
                vaParagraph.entity.fieldTitle
              } ${vaParagraph.entity.fieldVaParagraphs
                .map(subVAParagraph =>
                  cleanHTML(subVAParagraph.entity.fieldTable.tableValue),
                )
                .join(' ')}`;
            })
            .join(' ');
        }
        case 'react_widget': {
          return '';
        }
        default: {
          return '';
        }
      }
    })
    .join(' ');
}

function deriveSearchableContent(article) {
  switch (article.entityBundle) {
    case 'faq_multiple_q_a': {
      return deriveFAQMultipleQASearchableContent(article);
    }
    case 'q_a': {
      return deriveQASearchableContent(article);
    }
    case 'step_by_step': {
      return deriveStepByStepSearchableContent(article);
    }
    case 'support_resources_detail_page': {
      return deriveSupportResourcesDetailPageSearchableContent(article);
    }
    default: {
      return '';
    }
  }
}

function deriveIntroText(article) {
  const text =
    article.entityBundle === 'q_a'
      ? article.fieldAnswer.entity.fieldWysiwyg.processed
      : article.fieldIntroTextLimitedHtml.processed;
  return cleanHTML(text);
}

function createSearchResults(files) {
  const allArticles = getArticlesBelongingToResourcesAndSupportSection(files);
  const articleSearchData = allArticles.map(article => ({
    entityBundle: article.entityBundle,
    entityUrl: { path: article.entityUrl.path },
    fieldOtherCategories: article.fieldOtherCategories,
    fieldPrimaryCategory: article.fieldPrimaryCategory,
    fieldTags: article.fieldTags,
    searchableContent: deriveSearchableContent(article),
    introText: deriveIntroText(article),
    title: article.title,
  }));

  files['resources/search/articles.json'] = {
    contents: Buffer.from(JSON.stringify(articleSearchData)),
  };
}

function createResourcesAndSupportWebsiteSection() {
  return files => {
    excludeQaNodesThatAreNotStandalonePages(files);
    createArticleListingsPages(files);
    createSearchResults(files);
  };
}

module.exports = createResourcesAndSupportWebsiteSection;
