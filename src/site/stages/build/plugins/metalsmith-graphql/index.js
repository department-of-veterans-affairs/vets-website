/*jshint esversion: 6 */
/*
 *
 * To be added:
 *  @TODO Add authentication: https://www.apollographql.com/docs/react/recipes/authentication.html & https://github.com/drupal-graphql/graphql/issues/357
 *  @TODO better data model for paragraphs in metadata - need paragraph type and maybe a way to get raw values instead of whole rendered entity
 *
 *  */

const { ApolloClient, gql } = require('apollo-boost');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');


function plugin() {

    const siteUrl = "http://dev.va.agile6.com/graphql";
    const client = new ApolloClient({
        link: createHttpLink({
            uri: siteUrl,
            fetch: fetch
        }),
        cache: new InMemoryCache()
    });
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

    const getParagraphData = (paragraphField) => {
        let temp = {};
        paragraphField.forEach(function(para){
            let { id, entityRendered } = para.entity;
            temp[`paragraph-${id}`] = entityRendered;
        });
        return temp;
    };

    return function(files, metalsmith, done) {
        const handleSuccess = (resolvedValue) => {
            const entities = resolvedValue.data.nodeQuery.entities;
            let temp = {};
            let paraTemp = {};
            let nodeData = {};
            const values = Object.values(entities);
            values.forEach(function(node) {
                if(node) {
                    temp = {};
                    paraTemp = {};
                    let { nid } = node;
                    temp.nodeTitle = node.title;
                    temp.introText = node.fieldIntroText;

                    // Get Paragraph data
                    const paragraphs = node.fieldContentBlock;
                    paraTemp = getParagraphData(paragraphs);
                    nodeData[nid] = Object.assign({}, temp, paraTemp);
                }
            });

            // add nodeData variables to the metalsmith metadata
            let metadata = metalsmith.metadata();
            metadata.nodes = nodeData;
            metalsmith.metadata(metadata);
            console.log('metadata');
            console.log(metadata);

            done();
        };

        client.query({
            query: query
        }).then(data => handleSuccess(data))
        .catch(error => console.error(error));
    };
}


// Expose Plugin
module.exports = plugin;
