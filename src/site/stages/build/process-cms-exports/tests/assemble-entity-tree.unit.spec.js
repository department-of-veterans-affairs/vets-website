const path = require('path');
// const fs = require('fs');
const { expect } = require('chai');

const entityMap = require('./entities');

const entityDir = path.join(__dirname, 'entities');
// const assembleEntityTree = require('../index')(entityDir);

const { getContentModelType, readEntity } = require('../helpers');

// const transformedDir = path.join(__dirname, 'transformed-entities');

Object.entries(entityMap).forEach(([contentModelType, entityFileName]) => {
  describe(contentModelType, () => {
    const entity = readEntity(
      entityDir,
      ...entityFileName.split('.').slice(0, 2),
    );

    it('entry in the test entity map should match the content model type', () => {
      expect(contentModelType).to.equal(getContentModelType(entity));
    });

    // Test 2: Look for a post-transformation json file matching the entity type
    //         If one exists, run the transformation on it and compare the result
    it('should transform to match the test output', () => {});
  });
});
