const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const findImportsLite = require('./find-imports-lite');
const { extractImports, findImportsAsync } = require('./find-imports-lite');

const FIXTURES_DIR = path.join(__dirname, 'test-fixtures', 'find-imports-lite');

describe('find-imports-lite', () => {
  describe('extractImports', () => {
    it('extracts ES6 default imports', () => {
      const content = `import React from 'react';`;
      expect(extractImports(content)).to.deep.equal(['react']);
    });

    it('extracts ES6 named imports', () => {
      const content = `import { useState, useEffect } from 'react';`;
      expect(extractImports(content)).to.deep.equal(['react']);
    });

    it('extracts ES6 namespace imports', () => {
      const content = `import * as utils from './utils';`;
      expect(extractImports(content)).to.deep.equal(['./utils']);
    });

    it('extracts side-effect-only imports', () => {
      const content = `import './styles.css';`;
      expect(extractImports(content)).to.deep.equal(['./styles.css']);
    });

    it('extracts dynamic imports', () => {
      const content = `const mod = import('./lazy-module');`;
      expect(extractImports(content)).to.deep.equal(['./lazy-module']);
    });

    it('extracts require statements', () => {
      const content = `const fs = require('fs');`;
      expect(extractImports(content)).to.deep.equal(['fs']);
    });

    it('extracts multiple imports from one file', () => {
      const content = [
        `import React from 'react';`,
        `import { connect } from 'react-redux';`,
        `import './styles.css';`,
        `const lodash = require('lodash');`,
      ].join('\n');
      expect(extractImports(content)).to.deep.equal([
        'react',
        'react-redux',
        './styles.css',
        'lodash',
      ]);
    });

    it('ignores single-line commented imports', () => {
      const content = [
        `// import React from 'react';`,
        `import { connect } from 'react-redux';`,
      ].join('\n');
      expect(extractImports(content)).to.deep.equal(['react-redux']);
    });

    it('handles scoped package imports', () => {
      const content = `import component from '@department-of-veterans-affairs/component-library';`;
      expect(extractImports(content)).to.deep.equal([
        '@department-of-veterans-affairs/component-library',
      ]);
    });

    it('handles relative path imports', () => {
      const content = [
        `import Foo from './components/Foo';`,
        `import Bar from '../utils/bar';`,
      ].join('\n');
      expect(extractImports(content)).to.deep.equal([
        './components/Foo',
        '../utils/bar',
      ]);
    });

    it('returns empty array for content with no imports', () => {
      const content = `const x = 42;\nconsole.log(x);`;
      expect(extractImports(content)).to.deep.equal([]);
    });
  });

  describe('findImportsLite (sync)', () => {
    let readFileSyncStub;
    let globSyncStub;
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      readFileSyncStub = sandbox.stub(fs, 'readFileSync');
      globSyncStub = sandbox.stub(glob, 'sync');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('returns a per-file map by default', () => {
      globSyncStub.returns(['src/app/index.js']);
      readFileSyncStub.returns(
        `import React from 'react';\nimport './styles.css';`,
      );

      const result = findImportsLite('src/app/**/*.*');
      expect(result).to.deep.equal({
        'src/app/index.js': ['react', './styles.css'],
      });
    });

    it('returns a flat deduplicated array when flatten=true', () => {
      globSyncStub.returns(['src/a.js', 'src/b.js']);
      readFileSyncStub
        .withArgs('src/a.js', 'utf8')
        .returns(`import React from 'react';`);
      readFileSyncStub
        .withArgs('src/b.js', 'utf8')
        .returns(`import React from 'react';\nimport lodash from 'lodash';`);

      const result = findImportsLite('src/**/*.*', { flatten: true });
      expect(result).to.include('react');
      expect(result).to.include('lodash');
      expect(result.filter(i => i === 'react')).to.have.length(1);
    });

    it('filters to package imports only', () => {
      globSyncStub.returns(['src/app.js']);
      readFileSyncStub.returns(
        [
          `import React from 'react';`,
          `import Foo from './Foo';`,
          `import Bar from '../Bar';`,
        ].join('\n'),
      );

      const result = findImportsLite('src/**/*.*', {
        packageImports: true,
        relativeImports: false,
        absoluteImports: false,
      });
      expect(result['src/app.js']).to.deep.equal(['react']);
    });

    it('filters to relative imports only', () => {
      globSyncStub.returns(['src/app.js']);
      readFileSyncStub.returns(
        [
          `import React from 'react';`,
          `import Foo from './Foo';`,
          `import Bar from '../Bar';`,
        ].join('\n'),
      );

      const result = findImportsLite('src/**/*.*', {
        packageImports: false,
        relativeImports: true,
        absoluteImports: false,
      });
      expect(result['src/app.js']).to.deep.equal(['./Foo', '../Bar']);
    });

    it('omits files with no matching imports from the map', () => {
      globSyncStub.returns(['src/a.js', 'src/b.js']);
      readFileSyncStub
        .withArgs('src/a.js', 'utf8')
        .returns(`import React from 'react';`);
      readFileSyncStub.withArgs('src/b.js', 'utf8').returns(`const x = 42;`);

      const result = findImportsLite('src/**/*.*');
      expect(result).to.have.property('src/a.js');
      expect(result).to.not.have.property('src/b.js');
    });

    it('skips unreadable files', () => {
      globSyncStub.returns(['src/good.js', 'src/bad.js']);
      readFileSyncStub
        .withArgs('src/good.js', 'utf8')
        .returns(`import React from 'react';`);
      readFileSyncStub
        .withArgs('src/bad.js', 'utf8')
        .throws(new Error('EACCES'));

      const result = findImportsLite('src/**/*.*');
      expect(result).to.have.property('src/good.js');
      expect(result).to.not.have.property('src/bad.js');
    });
  });

  describe('findImportsAsync', () => {
    it('returns a per-file map of imports from fixture files', async () => {
      const result = await findImportsAsync(`${FIXTURES_DIR}/**/*.*`);
      const appFile = path.join(FIXTURES_DIR, 'app.js');
      expect(result).to.have.property(appFile);
      expect(result[appFile]).to.include('react');
      expect(result[appFile]).to.include('./utils');
    });

    it('filters imports based on options', async () => {
      const result = await findImportsAsync(`${FIXTURES_DIR}/**/*.*`, {
        packageImports: false,
        relativeImports: true,
        absoluteImports: false,
      });
      const appFile = path.join(FIXTURES_DIR, 'app.js');
      expect(result[appFile]).to.include('./utils');
      expect(result[appFile]).to.not.include('react');
    });

    it('accepts array glob patterns', async () => {
      const result = await findImportsAsync([`${FIXTURES_DIR}/**/*.*`]);
      const appFile = path.join(FIXTURES_DIR, 'app.js');
      expect(result).to.have.property(appFile);
    });

    it('converts **/*.* to JS-specific extensions', async () => {
      const result = await findImportsAsync(`${FIXTURES_DIR}/**/*.*`);
      const cssFile = path.join(FIXTURES_DIR, 'styles.css');
      expect(result).to.not.have.property(cssFile);
    });
  });
});
