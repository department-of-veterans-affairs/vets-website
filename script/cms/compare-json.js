/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const deepDiff = require('deep-diff');
const { camelCase, get, isEqual, omit } = require('lodash');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const assembleEntityTreeFactory = require('../../src/site/stages/build/process-cms-exports');

const {
  readAllNodeNames,
  readEntity,
} = require('../../src/site/stages/build/process-cms-exports/helpers');

// Only compare present fields in GraphQL entity, & exclude fields in keysToIgnore
const keysToIgnore = [
  'entityMetatags',
  'entityType',
  'contentModelType',
  'entityBundle',
  'entityId',
  'breadcrumb', // breadcrumbs are generated from the URL
];

const commandLineDefs = [
  {
    name: 'entity',
    alias: 'e',
    type: String,
    multiple: true,
    description: 'Specify the specific node entity to compare.',
  },
  {
    name: 'bundle',
    type: String,
    description:
      'Compare all entities of the bundle type specified. (Only node entities are supported) i.e. node-q_a, node-health_care_local_facility, etc',
    multiple: true,
  },
  {
    name: 'help',
    type: Boolean,
    description: 'Show this help menu.',
  },
  {
    name: 'html',
    type: Boolean,
    description: 'Output list of paths to HTML pages for mismatched nodes',
  },
  {
    name: 'buildtype',
    type: String,
    description: 'The buildtype to test the data against.',
    defaultValue: 'localhost',
  },
];

const {
  entity: entityNames,
  bundle,
  help,
  html: outputHtml,
  buildtype,
} = commandLineArgs(commandLineDefs);

if (help) {
  console.log(
    commandLineUsage([
      {
        header: 'Content Build JSON Comparison',
        content:
          'Compare the output of GraphQL and transformed CMS export data',
      },
      {
        header: 'Options',
        optionList: commandLineDefs,
      },
    ]),
  );
  process.exit(0);
}

const exportDir = path.resolve(
  __dirname,
  `../../.cache/${buildtype}/cms-export-content`,
);

// Array of nodes from pages.json
const graphQL = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, `../../.cache/${buildtype}/drupal/pages.json`),
  ),
);

const assembleEntityTree = assembleEntityTreeFactory(exportDir);

/**
 * Converts deep-diff's 'kind' property
 * @param {string} kind - The string representing the kind of difference
 * @return {string} Description of the kind of difference
 */
const getDiffType = diff => {
  switch (diff.kind) {
    case 'A':
      return 'Array Change';
    case 'D':
      return 'Property Missing';
    case 'E':
      return typeof diff.lhs !== 'undefined' && typeof diff.rhs !== 'undefined'
        ? 'Property Edited'
        : 'Property Missing';
    case 'N':
      return 'New property Added';
    default:
      return 'Change';
  }
};

/**
 * Converts deep-diff's 'item' property
 * https://www.npmjs.com/package/deep-diff#differences
 * @param {object} item - A deep-diff 'item' object
 * @return {object} A modified deep-diff 'item' object
 */
const getDiffItem = item => {
  const diffItem = {
    item: {
      diffType: getDiffType(item),
    },
  };
  if (!('lhs' in item) || !('rhs' in item)) {
    return !('lhs' in item)
      ? { ...diffItem.item, cmsExport: item.rhs }
      : { ...diffItem.item, graphQL: item.lhs };
  }
  return {};
};

/**
 * Finds the parent node and path in ancestor node(s)
 * of non node entities. Only some paragraph entities are
 * currently supported
 * @param {object} node - The node to find the parent of
 * @param {object []} rawEntities - Array of raw entities
 * @param {object} parent - The object containing the path and parent node
 * @return {array} The finalized array containing the path and parent object of the node
 */
const getParentNode = (
  node,
  rawEntities,
  parent = { path: '', node: null },
) => {
  if (node.baseType === 'node') {
    // eslint-disable-next-line no-param-reassign
    parent.node = node;
  }

  if (parent.path === '') {
    if (node.parent_type[0].value === 'node') {
      // eslint-disable-next-line no-param-reassign
      parent.path += node.parent_field_name[0].value;
      const ent = rawEntities.find(entity => {
        const isSameId =
          parseInt(entity.nid[0].value, 10) ===
          parseInt(node.parent_id[0].value, 10);
        return entity.baseType === 'node' && isSameId;
      });
      getParentNode(ent, rawEntities, parent);
    }
  } else {
    // TODO: Add support for deeper nested paragraphs, and other entity types
  }
  return parent;
};

const drupalToVaPath = content => {
  let replaced = content;
  if (content) {
    replaced = content.replace(/.*(?:png|jpg|jpeg|svg|gif)/gi, img =>
      img
        .replace('http://va-gov-cms.lndo.site/sites/default/files', '/img')
        .replace('http://dev.cms.va.gov/sites/default/files', '/img')
        .replace('http://staging.cms.va.gov/sites/default/files', '/img')
        .replace('http://prod.cms.va.gov/sites/default/files', '/img')
        .replace('https://prod.cms.va.gov/sites/default/files', '/img')
        .replace('http://cms.va.gov/sites/default/files', '/img')
        .replace('https://cms.va.gov/sites/default/files', '/img'),
    );

    replaced = replaced.replace(/.*\.(?:doc|docx|xls|pdf|txt)/gi, file =>
      file
        .replace('http://va-gov-cms.lndo.site/sites/default/files', '/files')
        .replace('http://dev.cms.va.gov/sites/default/files', '/files')
        .replace('http://staging.cms.va.gov/sites/default/files', '/files')
        .replace('http://prod.cms.va.gov/sites/default/files', '/files')
        .replace('https://prod.cms.va.gov/sites/default/files', '/files')
        .replace('http://cms.va.gov/sites/default/files', '/files')
        .replace('https://cms.va.gov/sites/default/files', '/files'),
    );

    replaced = replaced.replace(/\/(img|files)\/.+/g, url =>
      url.replace(/\?.+/g, ''),
    );
  }

  return replaced;
};

const searchItem = (object, item) => {
  const newObj = object[item];
  if (newObj) {
    Object.keys(newObj).forEach(key => {
      if (typeof newObj[key] === 'object') {
        searchItem(newObj, key);
      }
      if (typeof newObj[key] === 'string' && key !== 'processed') {
        newObj[key] = drupalToVaPath(newObj[key]);
      }
    });
  }
};

const convertToRelativePath = object => {
  if (object) {
    Object.keys(object).forEach(item => {
      if (typeof object[item] === 'object') {
        searchItem(object, item);
      }
    });
  }
};

const stripIgnoredKeys = obj => {
  const result = omit(obj, keysToIgnore);

  Object.keys(result).forEach(key => {
    if (Array.isArray(result[key])) {
      result[key] = result[key].map(item => stripIgnoredKeys(item));
    } else if (typeof result[key] === 'object') {
      result[key] = stripIgnoredKeys(result[key]);
    }
  });

  return result;
};

/**
 * Compares two arrays using lodash isEqual on each item.
 * @param cmsExportArray
 * @param graphQLArray
 * @param dataPath
 */
const compareArrays = (cmsExportArray, graphQLArray, dataPath) => {
  const cmsArrayLength = cmsExportArray.length;
  const graphQLLength = graphQLArray.length;
  const arrayDiffs = [];

  if (cmsArrayLength !== graphQLLength) {
    arrayDiffs.push({
      diffType: 'Array Length',
      path: dataPath,
      graphQL: graphQLLength,
      cmsExport: cmsArrayLength,
    });
  }

  graphQLArray.forEach((graphQlItem, index) => {
    const cleanGraphQlItem = stripIgnoredKeys(graphQlItem);
    const cleanCmsItem = stripIgnoredKeys(cmsExportArray[index]);

    if (
      !isEqual(cleanGraphQlItem, cleanCmsItem) &&
      JSON.stringify(cleanGraphQlItem) !== JSON.stringify(cleanCmsItem)
    ) {
      let addDiff = true;

      if (typeof cleanGraphQlItem === 'object') {
        const diff = deepDiff(cleanGraphQlItem, cleanCmsItem).filter(
          d => d.kind !== 'N',
        );
        if (!diff?.length > 0) addDiff = false;
      }
      if (addDiff) {
        arrayDiffs.push({
          diffType: 'Array Edit',
          path: `${dataPath}/${index}`,
          graphQL: cleanGraphQlItem,
          cmsExport: cleanCmsItem,
        });
      }
    }
  });

  return arrayDiffs.length > 0 ? arrayDiffs : null;
};

/**
 * Compares two entity JSON objects
 * https://www.npmjs.com/package/deep-diff#differences
 * @param {object} baseGraphQlObject - The graphQL object to compare
 * @param {object} baseCmsExportObject - The transformed CMS export object to compare
 * @return {object []} The array of differences found from deep-diff'
 */
const compareJson = (baseGraphQlObject, baseCmsExportObject) => {
  // Save present keys in CMS export and GraphQL objects
  let graphQlObject = {};
  let cmsExportObject = {};

  // Output missing keys to console
  Object.keys(baseGraphQlObject).forEach(key => {
    if (key in baseCmsExportObject && !keysToIgnore.includes(key)) {
      cmsExportObject[key] = baseCmsExportObject[key];
      graphQlObject[key] = baseGraphQlObject[key];
    } else if (!keysToIgnore.includes(key)) {
      // Output missing fields to console if '--entity' flag is used
      if (entityNames) console.log(`Field missing: ${key}`);
    } else {
      // Do nothing because key is in keysToIgnore
    }
  });

  convertToRelativePath(graphQlObject);

  const arrayDiffs = [];

  graphQlObject = stripIgnoredKeys(graphQlObject);
  cmsExportObject = stripIgnoredKeys(cmsExportObject);

  // Get array of differences. Exclude new properties because transformed
  // CMS objects may have additional properties
  let diffs = deepDiff(graphQlObject, cmsExportObject, (diffPath, key) => {
    // Store arrays for comparison by alternate method.
    const cmsObjectAtPath = get(cmsExportObject, diffPath);
    const graphQlObjectAtPath = get(graphQlObject, diffPath);

    const isArrayPath =
      cmsObjectAtPath &&
      graphQlObjectAtPath &&
      Array.isArray(cmsObjectAtPath) &&
      Array.isArray(graphQlObjectAtPath);

    if (isArrayPath) {
      const compareArrayResult = compareArrays(
        cmsObjectAtPath,
        graphQlObjectAtPath,
        diffPath.join('.'),
      );
      if (compareArrayResult) arrayDiffs.push(...compareArrayResult);

      return true;
    }

    // Filter & ignore keys in keysToIgnore
    return keysToIgnore.includes(key);
  });

  diffs = diffs?.filter(d => d.kind !== 'N').map(diff => {
    return {
      diffType: getDiffType(diff),
      path: diff.index
        ? `${diff.path.join('/')}[${diff.index}]`
        : diff.path.join('/'),
      ...(diff.item && { item: getDiffItem(diff.item) }),
      ...('lhs' in diff && { graphQL: diff.lhs }),
      ...('rhs' in diff && { cmsExport: diff.rhs }),
    };
  });

  return { deepDiffs: diffs, arrayDiffs };
};

const MAX_DIFFS = 100;

/**
 * Handles running and outputting the diff based on the command line input
 */
const runComparison = () => {
  if (entityNames) {
    const rawEntities = [];
    const transformedEntities = entityNames.map(entityName => {
      const nodeNamePieces = entityName.split('.').slice(0, 2);
      assert(
        nodeNamePieces.length === 2,
        '--entity (or -e) needs to be the filename of an entity. E.g. node.<uuid>.json',
      );

      const unTransformedEntity = readEntity(exportDir, ...nodeNamePieces);
      rawEntities.push(unTransformedEntity);

      return assembleEntityTree(unTransformedEntity, false);
    });

    let graphQlObject;

    // Handle paragraph entities
    if (rawEntities[0].baseType !== 'node') {
      const cmsEntities = readAllNodeNames(exportDir)
        .filter(([baseType]) => ['node', 'paragraph'].includes(baseType))
        .map(entityDetails => readEntity(exportDir, ...entityDetails));

      // Find parent node for paragraph object
      const parentNode = getParentNode(rawEntities[0], cmsEntities);
      const graphQlNode = graphQL.data.nodeQuery.entities.filter(
        e =>
          e.entityBundle === parentNode.node.entityBundle &&
          parseInt(e.entityId, 10) === parentNode.node.nid[0].value,
      )[0];

      // Get specific paragraph object
      graphQlObject = graphQlNode[camelCase(parentNode.path)][0];
    } else {
      // Find GraphQL object from pages.json data
      graphQlObject = graphQL.data.nodeQuery.entities.filter(
        e =>
          e.entityBundle === rawEntities[0].entityBundle &&
          parseInt(e.entityId, 10) === rawEntities[0].nid[0].value,
      )[0];
    }

    if (graphQlObject) {
      const diff = compareJson(graphQlObject, transformedEntities[0]);
      if (diff) {
        fs.writeFileSync(
          path.join(__dirname, `../../content-object-diff.json`),
          JSON.stringify(diff.deepDiffs),
        );
        console.log(
          `${diff.deepDiffs.length} differences: './content-object-diff.json'`,
        );
      } else {
        console.log(`No differences found!`);
      }
    } else {
      console.log(`Node not present in .cache/${buildtype}/drupal/pages.json`);
    }
  } else {
    let rawEntities = readAllNodeNames(exportDir).map(entityDetails =>
      readEntity(exportDir, ...entityDetails),
    );

    if (bundle) {
      rawEntities = rawEntities.filter(e =>
        bundle.includes(e.contentModelType),
      );
    }

    // Get only published nodes
    const transformedEntities = rawEntities
      .map(entity => assembleEntityTree(entity, false))
      .filter(e => e && Object.keys(e).length);

    fs.rmdirSync('content-object-diffs', { recursive: true });
    fs.mkdirSync('content-object-diffs');

    // Keep track of number or diffs
    let nodesWithDiffs = 0;
    let totalDiffs = 0;
    let totalObjectsCompared = 0;
    const pagesWithDiffs = {};
    const diffsByBundle = {};

    // Compare JSON objects for each node entity
    transformedEntities.forEach(entity => {
      const baseObject = graphQL.data.nodeQuery.entities.filter(
        e =>
          e.entityBundle === entity.entityBundle &&
          parseInt(e.entityId, 10) === parseInt(entity.entityId, 10),
      )[0];

      if (baseObject) {
        const diff = compareJson(baseObject, entity);

        if (diff.deepDiffs?.length > 0 || diff.arrayDiffs?.length > 0) {
          // Entity file name object to add to diff file
          const entityFileObject = {
            entityFile: `node.${
              rawEntities.find(
                rawEntity =>
                  parseInt(rawEntity.nid[0].value, 10) ===
                  parseInt(entity.entityId, 10),
              ).uuid
            }.json`,
          };

          // Default name for file
          const defaultFileName = path.join(
            __dirname,
            '../../',
            'content-object-diffs',
            `${entity.entityBundle}-${entity.entityId}`,
          );

          // Increment number of diffs for bundle.
          diffsByBundle[entity.entityBundle] =
            diffsByBundle[entity.entityBundle] + 1 || 1;

          // Add entity file name to deepDiff/arrayDiff outputs
          if (diff.deepDiffs?.length > 0) {
            totalDiffs += diff.deepDiffs.length - 1;
            diff.deepDiffs.unshift(entityFileObject);
            fs.writeFileSync(
              `${defaultFileName}.json`,
              JSON.stringify(diff.deepDiffs, null, 2),
            );
            ++nodesWithDiffs;
          }

          if (diff.arrayDiffs?.length > 0) {
            diff.arrayDiffs.unshift(entityFileObject);
            fs.writeFileSync(
              `${defaultFileName}-array.json`,
              JSON.stringify(diff.arrayDiffs.slice(0, MAX_DIFFS), null, 2),
            );
          }

          if (outputHtml) {
            // Keep track of the subset of pages to validate by HTML comparison.
            const htmlPagePath = path.join(entity.entityUrl.path, 'index.html');
            pagesWithDiffs[htmlPagePath] = {
              ...(diff.deepDiffs?.length && {
                deepDiff: `${defaultFileName}.json`,
              }),
              ...(diff.arrayDiffs?.length && {
                arrayDiff: `${defaultFileName}-array.json`,
              }),
            };
          }
        }
        ++totalObjectsCompared;
      }
    });

    console.log(
      nodesWithDiffs === 0
        ? `No differences found in ${totalObjectsCompared} nodes!`
        : `${nodesWithDiffs}/${totalObjectsCompared} nodes with ${totalDiffs} differences: './content-object-diffs'`,
    );

    console.log(
      'Number of diffs by bundle:',
      JSON.stringify(diffsByBundle, null, 2),
    );

    if (outputHtml) {
      const htmlPagePaths = Object.keys(pagesWithDiffs);
      htmlPagePaths.sort();

      const outputHtmlPath = path.join(
        __dirname,
        '..',
        '..',
        'content-object-diffs',
        'pages-with-diffs.json',
      );

      const sortedPagesWithDiffs = htmlPagePaths.reduce(
        (diffs, page) => ({
          ...diffs,
          [page]: pagesWithDiffs[page],
        }),
        {},
      );

      fs.writeFileSync(
        outputHtmlPath,
        JSON.stringify(sortedPagesWithDiffs, null, 2),
      );

      console.log('HTML pages with diffs:', outputHtmlPath);
    }
  }
};

runComparison();
