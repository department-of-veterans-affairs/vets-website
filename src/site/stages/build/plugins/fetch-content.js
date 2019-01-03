const { ApolloClient, gql } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');

const CONTENT_APIS = require('../../../constants/content-apis');

const query = gql`
{
    nodeQuery{
        count
        entities {
            ... on NodePage {
                nid
                entityBundle
                entityPublished
                title
                fieldIntroText
                fieldContentBlock {
                    entity {
                        ... on Paragraph {
                            id
                            entityBundle
                            entityRendered
                        }
                    }
                }
            }
        }
    }
}
`;

function fetchContent(buildOptions) {
  const contentApiRoute = CONTENT_APIS[buildOptions.buildtype];
  const link = createHttpLink({ uri: contentApiRoute, fetch });
  const cache = new InMemoryCache();
  const contentApi = new ApolloClient({ link, cache });

  return async (pages, metalsmith, done) => {

  };
}

module.exports = fetchContent;
