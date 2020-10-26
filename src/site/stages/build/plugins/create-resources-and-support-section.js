/* eslint-disable no-param-reassign */

const _ = require('lodash');
const liquid = require('tinyliquid');

const ENVIRONMENTS = require('../../../constants/environments');
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

const BUNDLE_TYPES = new Set([
  'step_by_step',
  'faq_multiple_q_a',
  'q_a',
  'checklist',
  'media_list_images',
  'media_list_videos',
  'support_resources_detail_page',
]);

function getArticlesBelongingToResourcesAndSupportSection(files) {
  return Object.entries(files)
    .filter(([_fileName, file]) => BUNDLE_TYPES.has(file.entityBundle))
    .map(([_fileName, file]) => file);
}

function groupByTags(allArticles) {
  const articleListingsByTag = {};
  const allTaggedArticles = allArticles.filter(a => !!a.fieldTags);

  for (const article of allTaggedArticles) {
    const {
      fieldTags: {
        entity: { fieldTopics },
      },
    } = article;

    fieldTopics.map(fieldTopic => fieldTopic.entity).forEach(fieldTopic => {
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

          if (index > 0) {
            page.entityUrl.breadcrumb.push({
              url: {
                path: `/${pageOfArticles.uri}/`,
              },
              text: index + 1,
            });
          }

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

function createArticleResultSnippet(text) {
  const sanitized = liquid.filters.strip_html(text);
  const truncated = liquid.filters.truncate(sanitized, 200);

  if (sanitized !== truncated) {
    return `${truncated}...`;
  }

  return truncated;
}

function createSearchResults(files) {
  const allArticles = getArticlesBelongingToResourcesAndSupportSection(files);
  const articleSearchData = allArticles.map(article => {
    let limitedDescription = null;

    if (article.entityBundle === 'q_a') {
      const answer = article.fieldAnswer.entity.fieldWysiwyg.processed;
      limitedDescription = createArticleResultSnippet(answer);
    } else {
      limitedDescription = createArticleResultSnippet(
        article.fieldIntroTextLimitedHtml.processed,
      );
    }

    return {
      entityBundle: article.entityBundle,
      entityUrl: {
        path: article.entityUrl.path,
      },
      title: article.title,
      description: limitedDescription,
      fieldPrimaryCategory: article.fieldPrimaryCategory,
      fieldOtherCategories: article.fieldOtherCategories,
      fieldTags: article.fieldTags,
    };
  });

  files['resources/search/articles.json'] = {
    contents: Buffer.from(JSON.stringify(articleSearchData)),
  };
}

function createResourcesAndSupportWebsiteSection(buildOptions) {
  if (buildOptions.buildtype === ENVIRONMENTS.VAGOVPROD) {
    return () => {};
  }

  return files => {
    createArticleListingsPages(files);
    createSearchResults(files);
  };
}

module.exports = createResourcesAndSupportWebsiteSection;
