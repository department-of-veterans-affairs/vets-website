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

  // Largely copied from scripts/copy-entities.js
  copyDescendants() {
    const propBlacklist = [
      'type',
      'bundle',
      'vid',
      'uid',
      'revision_uid',
      'roles',
    ];
    const copiedUuids = new Set();

    const copyChildren = entity => {
      const uuid = entity.uuid[0].value;
      // Avoid infinite loops
      if (copiedUuids.has(uuid)) return;
      copiedUuids.add(uuid);

      // Iterate through the non-blacklisted properties
      // When an entity reference is found, copy it over and recurse on it
      Object.keys(entity)
        .filter(k => !propBlacklist.includes(k))
        .forEach(propName => {
          // Properties should always be arrays, but just in case, check
          if (Array.isArray(entity[propName])) {
            entity[propName].forEach((p, index) => {
              if (p.target_type && p.target_uuid) {
                // Found an entity reference!
                const fileName = `${p.target_type}.${p.target_uuid}.json`;
                const sourceFile = path.join(tomeSyncContent, fileName);
                const destFile = path.join(
                  processEntitiesRoot,
                  'tests/entities/',
                  fileName,
                );
                if (!fs.existsSync(destFile)) {
                  try {
                    fs.copyFileSync(sourceFile, destFile);
                    this.log(
                      chalk.grey(`${uuid}: `),
                      chalk.green(
                        `Added child entity (${propName}[${index}]): ${fileName}`,
                      ),
                    );
                  } catch (e) {
                    this.log(
                      chalk.grey(`${uuid}: `),
                      chalk.red(`Error copying ${fileName}.`),
                    );
                    this.log(
                      chalk.grey(`${uuid}: `),
                      chalk.yellow('  This UUID: '),
                      entity.uuid[0].value,
                    );
                    this.log(
                      chalk.grey(`${uuid}: `),
                      chalk.yellow('  Child found at: '),
                      `${propName}[${index}]`,
                    );
                    this.log(chalk.yellow('  Child: '), p);
                    throw e;
                  }
                } else
                  this.log(
                    chalk.grey(`${uuid}: `),
                    chalk.blue(
                      `Found child entity (${propName}[${index}]): ${fileName}`,
                    ),
                  );

                // Recurse!
                copyChildren(
                  JSON.parse(
                    fs
                      .readFileSync(
                        path.join(
                          tomeSyncContent,
                          `${p.target_type}.${p.target_uuid}.json`,
                        ),
                      )
                      .toString('utf8'),
                  ),
                );
              }
            });
          }
        });
    };
    // Start copying!
    copyChildren(this.exampleEntity);
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
    this.log('- [ ] Ensure any unused test data is deleted by running:');
    this.log('      script/remove-unnecessary-raw-entity-files.sh');
    this.log('- [ ] Ensure it all works by running:');
    this.log(
      '      yarn test:unit src/site/stages/build/process-cms-exports/tests/assemble-entity-tree.unit.spec.js',
    );
    this.log('      yarn build:content:test');
  }
};
