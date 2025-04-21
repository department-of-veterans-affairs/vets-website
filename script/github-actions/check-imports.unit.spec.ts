const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');
// Import the functions to test
const {
  createDynamicImportRegex,
  getFileName,
  getDeletedFiles,
  checkBrokenImports,
  getAllProjectFiles,
} = require('./brokenImports');
describe('Broken Imports Checker', () => {
  let execSyncStub, readFileSyncStub, readdirSyncStub;
  beforeEach(() => {
    // Stub external dependencies
    execSyncStub = sinon.stub(child_process, 'execSync');
    readFileSyncStub = sinon.stub(fs, 'readFileSync');
    readdirSyncStub = sinon.stub(fs, 'readdirSync');
  });
  afterEach(() => {
    // Restore stubs after each test
    sinon.restore();
  });
  it('should correctly match import statements using createDynamicImportRegex', () => {
    const regex = createDynamicImportRegex('myModule');
    const content1 = `import myModule from './myModule';`;
    const content2 = `import { myModule } from './utils/myModule';`;
    const content3 = `import anotherModule from './anotherModule';`;
    expect(regex.test(content1)).to.be.true;
    expect(regex.test(content2)).to.be.true;
    expect(regex.test(content3)).to.be.false;
  });
  it('should extract the file name without extension using getFileName', () => {
    expect(getFileName('src/utils/helper.js')).to.equal('helper');
    expect(getFileName('components/Button.jsx')).to.equal('Button');
    expect(getFileName('README.md')).to.equal('README');
  });
  it('should return deleted files from git using getDeletedFiles', () => {
    execSyncStub.returns('src/oldFile.js\nutils/legacy.js\n');
    const result = getDeletedFiles();
    expect(result).to.deep.equal(['src/oldFile.js', 'utils/legacy.js']);
    expect(execSyncStub.calledWith('git ls-files --deleted')).to.be.true;
  });
  it('should detect broken imports in checkBrokenImports', () => {
    const deletedFiles = ['src/oldFile.js'];
    // Mock project file content
    readdirSyncStub
      .withArgs(process.cwd())
      .returns([{ name: 'index.js', isDirectory: () => false }]);
    readFileSyncStub.returns(`import oldFile from './src/oldFile';`);
    const result = checkBrokenImports(deletedFiles);
    expect(result).to.deep.equal([
      {
        file: path.join(process.cwd(), 'index.js'),
        deletedFile: 'src/oldFile.js',
      },
    ]);
  });
  it('should recursively retrieve project files using getAllProjectFiles', () => {
    // Mock file structure
    readdirSyncStub
      .withArgs(process.cwd())
      .returns([
        { name: 'index.js', isDirectory: () => false },
        { name: 'src', isDirectory: () => true },
      ]);
    readdirSyncStub
      .withArgs(path.join(process.cwd(), 'src'))
      .returns([{ name: 'app.js', isDirectory: () => false }]);
    const result = getAllProjectFiles();
    expect(result).to.deep.equal([
      path.join(process.cwd(), 'index.js'),
      path.join(process.cwd(), 'src', 'app.js'),
    ]);
  });
});
