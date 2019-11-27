const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');

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
    if (!fs.existsSync(path.join(processEntitiesRoot, 'tests/entities')))
      throw new Error(
        `Could not find example raw entity at tests/entities/${
          this.exampleFileName
        }`,
      );
    else
      this.log(
        `Found example ${this.contentModelType} at tests/entities/${
          this.exampleFileName
        }`,
      );

    // Check meta/index.json to make sure the entity is _used_
    // somewhere. If it isn't, we won't have a corresponding entity in
    // pages.json to test against. This search only ensures that the
    // UUID is found multiple times--once at the root-level of the
    // index (simply because the entity exists), and one or more times
    // as a child of other entities. It's imperfect, since the entity
    // we're searching for may be a child of, say, a user entity which
    // we won't end up using, and this check won't catch that.
    const exp = new RegExp(path.parse(this.exampleFileName).name, 'g');
    const searchResult = metaIndex.match(exp);
    this.log(exp);
    this.log(searchResult);

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
        this.log('- [ ] And update the index.js to point to the new file');
        this.log(`- [ ] Delete the old ${this.exampleFileName}.`);
        process.exit(0);
      }
    }
  }

  copyExampleChildren() {
    // If we get this far, we know we've got a valid example already
    // Time to copy the children
  }
};
