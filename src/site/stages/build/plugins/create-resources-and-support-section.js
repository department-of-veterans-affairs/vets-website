const _ = require('lodash');

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
  const tagMap = {};
  const allTaggedArticles = allArticles.filter(a => !!a.fieldTags);

  for (const article of allTaggedArticles) {
    const {
      fieldTags: {
        entity: { fieldTopics },
      },
    } = article;

    fieldTopics.map(fieldTopic => fieldTopic.entity.name).forEach(tag => {
      const taggedArticles = tagMap[tag] || [];
      tagMap[tag] = taggedArticles.concat(article);
    });
  }

  return tagMap;
}

function groupByCategory(allArticles) {
  const categoryMap = {};
  const categorizedArticles = allArticles.filter(a => !!a.fieldPrimaryCategory);

  for (const article of categorizedArticles) {
    const {
      fieldPrimaryCategory: {
        entity: { name: primaryCategoryName },
      },
      fieldOtherCategories,
    } = article;

    const primaryCategoryArticles = categoryMap[primaryCategoryName] || [];
    categoryMap[primaryCategoryName] = primaryCategoryArticles.concat(article);

    for (const otherCategory of fieldOtherCategories) {
      const otherCategoryName = otherCategory.entity.name;
      const otherCategoryArticles = categoryMap[otherCategoryName] || [];
      categoryMap[otherCategoryName] = otherCategoryArticles.concat(article);
    }
  }

  return categoryMap;
}

function createPaginatedArticleListings({
  articlesByGroupName,
  getTitle,
  getRootUrl,
  getPaginationSummary,
}) {
  return Object.entries(articlesByGroupName).reduce(
    (files, groupNameArticlePairs) => {
      const [groupName, allArticlesForGroupUnsorted] = groupNameArticlePairs;

      const allArticlesForGroup = _.sortBy(
        allArticlesForGroupUnsorted,
        'title',
      );

      const groupRootUrl = getRootUrl(groupName);
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
            (articleListing, pageIndex) => {
              return {
                label: pageIndex + 1,
                href: `/${articleListing.uri}`,
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

function createResourcesAndSupportWebsiteSection(buildOptions) {
  if (buildOptions.buildtype === ENVIRONMENTS.VAGOVPROD) {
    return () => {};
  }

  return files => {
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

      getRootUrl(categoryName) {
        return `resources/${_.kebabCase(categoryName)}`;
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

      getRootUrl(tag) {
        return `resources/tag/${_.kebabCase(tag)}`;
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
        logDrupal(
          `Generating Resources and Support article listing at: ${path}`,
        );
        // eslint-disable-next-line no-param-reassign
        files[path] = page;
      },
    );
  };
}

module.exports = createResourcesAndSupportWebsiteSection;
