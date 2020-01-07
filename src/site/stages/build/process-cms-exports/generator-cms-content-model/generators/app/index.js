const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');

const rawExamplesIndex = require('../../../tests/entities');

const processEntitiesRoot = path.join(__dirname, '../../../');
const tomeSyncContent = path.join(
  __dirname,
  '../../../../../../../../../tome-sync-output/content',
);

const metaIndex = fs.readFileSync(
  path.join(tomeSyncContent, 'meta/index.json'),
  'utf8',
);
const templatesPath = path.join(
  processEntitiesRoot,
  'generator-cms-content-model/templates/',
);

/**
 * Takes an object and returns all the property names of itself and
 * its nested objects recursively.
 *
 * @param {Object} obj - The object to get the property names from
 * @return {Set<string>} - All the unique property names in snake_case
 */
const allSnakeCasedPropertyNames = obj =>
  new Set(
    _.flatten(
      Object.keys(obj).map(key => {
        if (
          obj[key] &&
          typeof obj[key] === 'object' &&
          !Array.isArray(obj[key])
        )
          return Array.from(allSnakeCasedPropertyNames(obj[key])).concat([
            _.snakeCase(key),
          ]);

        return _.snakeCase(key);
      }),
    ),
  );

module.exports = class extends Generator {
  async getContentModelType() {
    this.contentModelType = (await this.prompt([
      {
        type: 'input',
        name: 'type',
        message: 'Content model type (e.g. node-page)',
      },
    ])).type;
  }

  async findExampleModel() {
    this.exampleFileName = rawExamplesIndex[this.contentModelType];
    if (!this.exampleFileName)
      throw new Error(
        `Could not find example raw entity for type '${
          this.contentModelType
        }' in tests/entities/.`,
      );

    // Make sure the file actually exists
    this.exampleFilePath = path.join(
      processEntitiesRoot,
      'tests/entities',
      this.exampleFileName,
    );
    if (!fs.existsSync(this.exampleFilePath))
      throw new Error(
        `Could not find example raw entity at ${this.exampleFilePath}`,
      );
    else
      this.log(
        `Found example ${this.contentModelType} at ${this.exampleFilePath}`,
      );

    this.exampleEntity = JSON.parse(
      fs.readFileSync(this.exampleFilePath, 'utf8'),
    );

    // Check meta/index.json to make sure the entity is _used_
    // somewhere. If it isn't, we won't have a corresponding entity in
    // pages.json to test against. This search only ensures that the
    // UUID is found multiple times--once at the root-level of the
    // index (simply because the entity exists), and one or more times
    // as a child of other entities. It's imperfect, since the entity
    // we're searching for may be a child of, say, a user entity which
    // we won't end up using, and this check won't catch that.
    const searchResult = metaIndex.match(
      new RegExp(path.parse(this.exampleFileName).name, 'g'),
    );

    // If it's found only once, it _may_ be a root-level entity such
    // as a node. Ask for confirmation before continuing.
    if (searchResult.length < 2) {
      const shouldContinue = (await this.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message:
            "It looks like the entity I found isn't a child of any entity and may not be found in pages.json. Continue?",
        },
      ])).continue;
      if (!shouldContinue) {
        this.log(
          'Try finding another example of this content model in the tome sync output.',
        );
        this.log(
          `- [ ] Copy this new file to ${path.join(
            processEntitiesRoot,
            'tests/entities/',
          )}`,
        );
        this.log('- [ ] Update the index.js to point to the new file');
        this.log(`- [ ] Delete the old ${this.exampleFileName}.`);
        process.exit(0);
      }
    }
  }

  async getTransformedTestData() {
    this.log(JSON.stringify(this.exampleEntity, null, 2));

    const transformedEntityTestFile = path.join(
      processEntitiesRoot,
      'tests/transformed-entities',
      `${this.contentModelType}.json`,
    );
    if (fs.existsSync(transformedEntityTestFile)) {
      this.log(
        chalk.green(`Found transformed entity test file:`),
        transformedEntityTestFile,
      );
      this.transformedTestData = JSON.parse(
        fs.readFileSync(transformedEntityTestFile),
      );
      return;
    }
    // TODO: Generate search suggestions
    // TODO: Search pages.json and find matches
    // TODO: Ask for new search parameters if necessary

    this.transformedTestData = (await this.prompt([
      {
        type: 'editor',
        name: 'data',
        message: 'Enter the corresponding entity data from pages.json.',
        validate: input => {
          try {
            JSON.parse(input);
            return true;
          } catch (e) {
            this.log(chalk.red('\nJSON parsing error:'), e.message);
            this.log(chalk.red('Input:'), input);
            return 'Please provide valid JSON.';
          }
        },
      },
    ])).data;
    this.transformedTestData = JSON.parse(this.transformedTestData);

    fs.writeFileSync(
      transformedEntityTestFile,
      JSON.stringify(this.transformedTestData, null, 2),
      'utf8',
    );

    this.log(
      chalk.green(`Wrote transformed entity test file:`),
      transformedEntityTestFile,
    );
  }

  async getFilters() {
    const guesses = allSnakeCasedPropertyNames(this.transformedTestData);
    this.rawPropertyNames = (await this.prompt([
      {
        type: 'checkbox',
        name: 'names',
        message: 'Which keys do you want to keep?',
        choices: Object.keys(this.exampleEntity).map(key => ({
          value: key,
          checked: guesses.has(key),
        })),
      },
    ])).names;
  }

  /**
   * Copies the example entity's children.
   * Note: This doesn't copy grandchildren or deeper.
   */
  copyExampleChildren() {
    // Iterate through the example file's kept properties
    Object.keys(this.exampleEntity)
      .filter(propName => this.rawPropertyNames.includes(propName))
      .forEach(propName => {
        const prop = this.exampleEntity[propName];
        if (Array.isArray(prop)) {
          prop.forEach(p => {
            if (p.target_uuid && p.target_type) {
              // We have an entity reference!
              const childFileName = `${p.target_type}.${p.target_uuid}.json`;
              const testChildPath = path.join(
                processEntitiesRoot,
                'tests/entities/',
                childFileName,
              );

              // Copy the child
              if (!fs.existsSync(testChildPath)) {
                fs.copyFileSync(
                  path.join(tomeSyncContent, childFileName),
                  testChildPath,
                );
                this.log(
                  chalk.green(
                    `Added required child (${propName}): ${childFileName}`,
                  ),
                );
              } else
                this.log(
                  chalk.green(
                    `Found required child (${propName}): ${childFileName}`,
                  ),
                );
            }
          });
        } else this.log(`${propName} is not an array. That's unexpected.`);
      });
  }

  writeSchemas() {
    const rawSchemaPath = path.join(
      processEntitiesRoot,
      `schemas/raw/${this.contentModelType}.js`,
    );
    const transformedSchemaPath = path.join(
      processEntitiesRoot,
      `schemas/transformed/${this.contentModelType}.js`,
    );

    this.transformedPropertyNames = this.rawPropertyNames.map(n =>
      _.camelCase(n),
    );

    this.fs.copyTpl(path.join(templatesPath, 'raw-schema'), rawSchemaPath, {
      propertyNames: this.rawPropertyNames,
    });
    const [baseType, subType] = this.contentModelType.split('-');
    this.fs.copyTpl(
      path.join(templatesPath, 'transformed-schema'),
      transformedSchemaPath,
      {
        baseType,
        subType,
        contentModelType: this.contentModelType,
        propertyNames: this.transformedPropertyNames,
      },
    );
  }

  writeTransformer() {
    const [entityType, entityBundle] = this.contentModelType.split('-');
    this.fs.copyTpl(
      path.join(templatesPath, 'transformer'),
      path.join(
        processEntitiesRoot,
        `transformers/${this.contentModelType}.js`,
      ),
      {
        entityType,
        entityBundle,
        propertyNames: this.transformedPropertyNames,
        rawPropertyNames: this.rawPropertyNames,
      },
    );
  }

  partingWords() {
    this.log(
      chalk.green(
        `\nSuccessfully created the scaffolding for ${this.contentModelType}!`,
      ),
    );
    this.log('\nNext steps:');
    this.log('- [ ] Clean up the raw schema');
    this.log('- [ ] Clean up the transformed schema');
    this.log('- [ ] Finish the transformer');
    this.log('- [ ] Ensure it all works by running:');
    this.log(
      '      yarn test:unit src/site/stages/build/process-cms-exports/tests/assemble-entity-tree.unit.spec.js',
    );
    this.log('      yarn build:content:test');
  }
};
