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

function createResourcesAndSupport(buildOptions) {
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

    const articlesByCategory = _.groupBy(
      allArticles,
      article => article.fieldPrimaryCategory.entity.name,
    );

    for (const categoryArticlesPairs of Object.entries(articlesByCategory)) {
      const [categoryName, allArticlesForCategory] = categoryArticlesPairs;
      const categoryUri = _.kebabCase(categoryName);
      const categoryRootUrl = `resources/${categoryUri}`;
      const paginatedArticles = _.chunk(allArticlesForCategory, PAGE_SIZE);

      paginatedArticles.forEach((pageOfArticles, index) => {
        const pageNum = index > 0 ? `/${index + 1}/` : '/';

        // eslint-disable-next-line no-param-reassign
        pageOfArticles.uri = `${categoryRootUrl}${pageNum}`;
      });

      const categoryTitle = `All articles in: ${categoryName}`;

      const categoryBreadcrumb = [
        ...BREADCRUMB_BASE_PATH,
        {
          url: {
            path: `/${categoryRootUrl}/`,
          },
          text: categoryTitle,
        },
      ];

      const pages = paginatedArticles.map((pageOfArticles, index) => {
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
          allArticlesForCategory.length,
        );

        const paginationTitle = `Showing ${pageStart} - ${pageEnd} of ${
          allArticlesForCategory.length
        } articles in "<strong>${categoryName}</strong>"`;

        const page = {
          contents: Buffer.from(''),
          path: pageOfArticles.uri,
          entityUrl: {
            breadcrumb: [...categoryBreadcrumb],
          },
          layout: 'support_resources_article_listing.drupal.liquid',
          title: categoryTitle,
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
      });

      pages.forEach(page => {
        const path = `${page.path}index.html`;
        logDrupal(
          `Generating Resources and Support article listing at: ${path}`,
        );
        // eslint-disable-next-line no-param-reassign
        files[path] = page;
      });
    }
  };
}

module.exports = createResourcesAndSupport;
