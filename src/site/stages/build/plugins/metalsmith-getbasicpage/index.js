/*global __dirname, require, console, module, plugin, metalsmith,  error, response, data, process*/
/*jshint esversion: 6 */


const request = require('request');
const debug = require('metalsmith-debug')('metalsmith-getbasicpage');


/**
 * Metalsmith plugin to prepare a yml data file from api data
 */
function plugin() {

    const getBasicPageQuery = (siteUrl, endPoint) => {
        return siteUrl + endPoint;
    };

    const getParagraphQuery = (siteUrl, endPoint, paragraphType, paragraphID) => {
        return siteUrl + endPoint + paragraphType + '/' + paragraphID;
    };

    const getParagraphData = (paragraphRequest) => {

        request.get(paragraphRequest, function(error, response, data) {
            if(error) {
                console.log(error);
            }

            const paragraphObj = JSON.parse(data);
            let paragraph = paragraphObj.data;

            content = paragraph.attributes.field_wysiwyg;

            return content;

        });

    };

    return function(files, metalsmith, done) {
        const siteUrl = 'http://vagovcms.lndo.site';
        const pageEndPoint = '/jsonapi/node/page';
        const paragraphEndPoint = '/jsonapi/paragraph/';
        const pageRequest = getBasicPageQuery(siteUrl, pageEndPoint);

        // get data from Lando Drupal instance
        request.get(pageRequest, function(error, response, data) {
            if(error) {
                console.log(error);
            }

            const pageDataObj = JSON.parse(data);
            pageDataObj.siteUrl = siteUrl;

            let pagesSummary = {};
            let temp = {};

            pageDataObj.data.forEach(function (page) {
                temp = {};

                temp.pageTitle = page.attributes.title;
                temp.introText = page.attributes.field_intro_text;

                paragraphID = page.relationships.field_content_block.data[0].id;
                paragraphType = 'wysiwyg';

                let paragraphRequest = getParagraphQuery(siteUrl, paragraphEndPoint, paragraphType, paragraphID);
                temp.paragraph = getParagraphData(paragraphRequest);



                pagesSummary[page.id] = temp;
            });

            // add pagesSummary variables to the metalsmith metadata
            let metadata = metalsmith.metadata();
            metadata.basicPages = pagesSummary;
            metalsmith.metadata(metadata);
            console.log(metadata);

            done();
        });

    };
}

// Expose Plugin
module.exports = plugin;