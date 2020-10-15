const ENVIRONMENTS = require('../../../constants/environments');
const _ = require('lodash');

const PAGE_SIZE = 10;

function createResourcesAndSupport(buildOptions) {
  if (buildOptions.buildtype === ENVIRONMENTS.VAGOVPROD) {
    return () => {};
  }

  return files => {
    const {
      drupalData: {
        data: { resourcesAndSupportArticleListings },
      },
    } = buildOptions;

    if (!resourcesAndSupportArticleListings) {
      return;
    }

    const allArticles = resourcesAndSupportArticleListings.entities;

    // Create a map where keys = name of a category
    // and values = array of articles under that category
    const articlesByCategory = _.groupBy(
      allArticles,
      article => article.fieldPrimaryCategory.entity.name,
    );

    for (const [categoryName, allArticlesForCategory] of Object.entries(
      articlesByCategory,
    )) {
      const categoryUri = _.kebabCase(categoryName);
      const categoryRootUrl = `resources/${categoryUri}`;
      const paginatedArticles = _.chunk(allArticlesForCategory, PAGE_SIZE);

      paginatedArticles.forEach((pageOfArticles, index) => {
        const pageNum = index > 0 ? `/${index + 1}/` : '/';

        // eslint-disable-next-line no-param-reassign
        pageOfArticles.uri = `${categoryRootUrl}${pageNum}`;
      });

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
          layout: 'support_resources_article_listing.drupal.liquid',
          title: `All articles in: ${categoryName}`,
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
      });

      pages.forEach(page => {
        // eslint-disable-next-line no-param-reassign
        files[`${page.path}index.html`] = page;
      });
    }
  };
}

module.exports = createResourcesAndSupport;
