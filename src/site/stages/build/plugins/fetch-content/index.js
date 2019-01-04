/* eslint-disable no-param-reassign */

const { ApolloClient } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');

const CONTENT_APIS = require('../../../../constants/content-apis');
const getAllPages = require('./getAllPages.graphql');

function fetchContent(buildOptions) {
  const contentApiRoute = `${CONTENT_APIS[buildOptions.buildtype]}/graphql`;
  const link = createHttpLink({ uri: contentApiRoute, fetch });
  const cache = new InMemoryCache();
  const contentApi = new ApolloClient({ link, cache });

  return async (files, metalsmith, done) => {
    const responseData = await contentApi.query({ query: getAllPages });
    const {
      data: {
        nodeQuery: { entities: pages },
      },
    } = responseData;

    for (const page of pages) {
      const {
        entityUrl: { path },
      } = page;
      files[path] = page;
    }

    done();
  };
}

module.exports = fetchContent;
