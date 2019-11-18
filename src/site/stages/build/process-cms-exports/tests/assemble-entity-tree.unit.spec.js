const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const chalk = require('chalk');

const entityMap = require('./entities');

const entityDir = path.join(__dirname, 'entities');
const assembleEntityTree = require('../index')(entityDir);

const { getContentModelType, readEntity } = require('../helpers');
const { getEntityTransformer } = require('../transform');

const transformersDir = path.join(__dirname, '..', 'transformers');

const transformedEntitiesDir = path.join(__dirname, 'transformed-entities');
const transformedEntitiesList = fs.readdirSync(transformedEntitiesDir);

describe('CMS export', () => {
  describe('transformers:', () => {
    const excluded = ['helpers.js'];

    // Each transformer should be tested
    fs.readdirSync(transformersDir)
      .filter(fileName => !excluded.includes(fileName))
      .forEach(fileName => {
        it(`${fileName} should have a corresponding test file mapped in tests/entities/index.js`, () => {
          const testFileName = entityMap[fileName.slice(0, -3)]; // Slice off the '.js'
          expect(testFileName).to.be.a.string;
          expect(testFileName).to.not.be.undefined; // Turns out undefined acts like a string in the above test
        });
      });
  });

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
      if (getEntityTransformer(contentModelType, false)) {
        it('should transform to match the test output', () => {
          const transformedFileName = `${contentModelType}.json`;

          // We have a transformer, but no transformed JSON file;
          // Output what we think the transformed entity should look like
          if (!transformedEntitiesList.includes(transformedFileName)) {
            process.stdout.write(
              `${chalk.red(
                `No transformed entity JSON file found for ${contentModelType}.\n`,
              )}\nassembleEntityTree result for ${contentModelType}:\n${JSON.stringify(
                assembleEntityTree(entity),
                null,
                2,
              )}\n`,
            );
            throw new Error(
              `No transformed entity JSON file found for ${contentModelType}`,
            );
          }

          const transformedEntity = JSON.parse(
            fs.readFileSync(
              path.join(transformedEntitiesDir, transformedFileName),
            ),
          );
          let assembled;
          try {
            assembled = assembleEntityTree(entity);
            expect(assembled).to.deep.equal(transformedEntity);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(
              'Transformed entity in the test JSON file:\n',
              JSON.stringify(transformedEntity, null, 2),
            );
            // eslint-disable-next-line no-console
            console.log(
              'Transformed from assembleEntityTree:\n',
              JSON.stringify(assembled, null, 2),
            );
            throw e;
          }
        });
      }
    });
  });
});
