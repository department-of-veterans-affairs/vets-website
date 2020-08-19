/**
 * Generate the node files from the grapQl output in the pages.json file
 * so we can compare them to the node files that we generate
 */

const fs = require('fs-extra');
const Conf = require('./config');

const conf = new Conf();

let graphqlDir = conf.nodeFileDir; // where we put the graphql nodes
let graphqlFile = conf.graphqlFile; // The graphQL file

if (process.argv[2] === '--transformers') {
  graphqlDir = conf.nodeTransformedFileDir; // where we put the transformed nodes
  graphqlFile = conf.transformedFile; // The transformed output schemas
}

/*
* Save a single node to file
*/

function saveNode(node) {
  // Create the dir if it doesn't exist
  fs.ensureDirSync(graphqlDir);

  if (node && node.entityId) {
    const id = `${node.entityId}`;
    /* eslint-disable no-console */
    console.log(id);

    // File name starts with the node id for easy file completion
    const fileName = `${graphqlDir}/${id}.json`;
    fs.outputJsonSync(fileName, node, { spaces: 2 });
  } else {
    /* eslint-disable no-console */
    console.error('Node Does not have an entityId');
  }
}

/**
 * Load the graphQL generated file
 */

function load() {
  const data = fs.readJsonSync(graphqlFile);

  // This is where in the graph the nodes are
  const entities = data.data.nodeQuery.entities;

  // Traverse the nodes
  entities.map(value => saveNode(value));
  /* eslint-disable no-console */
  console.log(`Generated ${entities.length} graphQL entities in ${graphqlDir}`);
}

load();
