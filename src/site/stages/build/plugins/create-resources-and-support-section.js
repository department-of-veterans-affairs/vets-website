const ENVIRONMENTS = require('../../../constants/environments');
const _ = require('lodash');

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

    const articles = resourcesAndSupportArticleListings.entities;

    const articlesByCategory = _.groupBy(
      articles,
      article => article.fieldPrimaryCategory.entity.name,
    );

    Object.entries(articlesByCategory).forEach(
      ([categoryName, categoryArticles]) => {
        const categoryRootUrl = `resources-and-support/categories/${_.kebabCase(
          categoryName,
        )}`;
        const articleListings = _.chunk(categoryArticles, 10);

        articleListings.forEach((articleListing, index) => {
          const pageNum = index > 0 ? `/${index + 1}/` : '/';
          articleListing.pagePath = `${categoryRootUrl}${pageNum}`;
        });

        articleListings.forEach((articleListing, index) => {
          const paginatorInner = articleListings.map(
            (articleListing, pageIndex) => {
              return {
                label: pageIndex + 1,
                href: `/${articleListing.pagePath}`,
                class: pageIndex === index ? 'va-pagination-active' : '',
              };
            },
          );

          const paginatorPrev =
            index > 0 ? `/${articleListings[index - 1].pagePath}` : null;
          const paginatorNext =
            index + 1 < articleListings.length
              ? `/${articleListings[index + 1].pagePath}`
              : null;

          const page = {
            contents: Buffer.from(
              '<!-- generated from Drupal data structure -->',
            ),
            layout: 'support_resources_article_listing.drupal.liquid',
            title: `All articles in: ${categoryName}`,
            articles: articleListing,
            paginator: {
              prev: paginatorPrev,
              inner: paginatorInner,
              next: paginatorNext,
            },
          };

          page.debug = JSON.stringify(page);
          files[`${articleListing.pagePath}index.html`] = page;
        });
      },
    );
  };
}

module.exports = createResourcesAndSupport;
