/**
 * Generate the node files from the grapQl output in the pages.json file
 * so we can compare them to the node files that we generate
 */

const _ = require('lodash');
const fs = require('fs');
const Conf = require('./config');

const conf = new Conf();

const graphqlDir = conf.nodeFileDir; // where we put the graphql nodes

/*
* Save a single node to file
*/

function saveNode(node) {
  // Create the dir if it doesn't exist
  if (!fs.existsSync(graphqlDir)) {
    fs.mkdirSync(graphqlDir);
  }

  const prettyOutJson = JSON.stringify(node, null, 2);
  if (node.entityId) {
    const id = `${node.entityId}`;
    /* eslint-disable no-console */
    console.log(id);

    // File name starts with the node id for easy file completion
    const fileName = `${graphqlDir}/${id}.json`;
    fs.writeFileSync(fileName, prettyOutJson);
  } else {
    /* eslint-disable no-console */
    console.error('Node Does not have an entityId');
  }
}

/**
 * Load the graphQL generated file
 */

function load() {
  const stringData = fs.readFileSync(conf.graphqlFile);
  const data = JSON.parse(stringData);

  // This is where in the graph the nodes are
  const entities = data.data.nodeQuery.entities;

  // Traverse the nodes
  _.map(entities, (value, key) => {
    saveNode(value);
  });
  /* eslint-disable no-console */
  console.log(`Generated ${entities.length} graphQL entities in ${graphqlDir}`);
}

load();
