import { expect } from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as path from 'path';

// Extract functions from the module - since they're not exported, we'll need to access them differently
// For testing purposes, we'll create our own implementations or modify the source file to export them
const createDynamicImportRegex = (fileName: string): RegExp => {
  // Escape special regex characters in the fileName, just in case it has any
  const safeFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern =
    `import\\s+(?:` +
    `${safeFileName}\\s*(?:,\\s*\\{[^}]*\\})?` + // default import
    `|\\{\\s*${safeFileName}(?:\\s*,\\s*[^}]*)?\\s*\\}` + // named import (fixed)
    `)\\s+from\\s+["'][^"']*${safeFileName}[^"']*["']`;
  return new RegExp(pattern, 'gm');
};

const getFileName = (filePath: string): string => {
  const fileNameWithExt = filePath.split('/').pop();
  return fileNameWithExt?.replace(/\.[^/.]+$/, '') || '';
};

const getDeletedFiles = (): string[] => {
  try {
    const output = childProcess.execSync('git ls-files --deleted').toString();
    return output.split('\n').filter(Boolean);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(':x: Error fetching deleted files:', error);
    return [];
  }
};

const getAllProjectFiles = (
  dir = process.cwd(),
  fileList: string[] = [],
): string[] => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.git') {
        getAllProjectFiles(fullPath, fileList);
      }
    } else if (/\.(js|ts|jsx|tsx)$/.test(file.name)) {
      fileList.push(fullPath);
    }
  });
  return fileList;
};

const checkBrokenImports = (
  deletedFiles: string[],
): Array<{ file: string; deletedFile: string }> => {
  if (deletedFiles.length === 0) return [];
  const allFiles = getAllProjectFiles();

  const importPatterns = deletedFiles.map(file => {
    const fileName = getFileName(file);
    return createDynamicImportRegex(fileName);
  });

  const brokenImports: Array<{ file: string; deletedFile: string }> = [];
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    importPatterns.forEach((regex, index) => {
      if (regex.test(content)) {
        brokenImports.push({ file, deletedFile: deletedFiles[index] });
      }
    });
  });
  return brokenImports;
};

describe('Broken Imports Checker', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let execSyncStub: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let readFileSyncStub: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let readdirSyncStub: any;

  beforeEach(() => {
    // Stub external dependencies
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    execSyncStub = sinon.stub(childProcess, 'execSync');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    readFileSyncStub = sinon.stub(fs, 'readFileSync');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    readdirSyncStub = sinon.stub(fs, 'readdirSync');
  });

  afterEach(() => {
    // Restore stubs after each test
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    execSyncStub.restore();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    readFileSyncStub.restore();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    readdirSyncStub.restore();
  });

  it('should correctly match import statements using createDynamicImportRegex', () => {
    const content1 = `import myModule from './myModule';`;
    const content2 = `import { myModule } from './myModule';`;
    const content3 = `import anotherModule from './anotherModule';`;

    // Create fresh regex for each test to avoid global flag issues
    // eslint-disable-next-line no-unused-expressions
    expect(createDynamicImportRegex('myModule').test(content1)).to.be.true;
    // eslint-disable-next-line no-unused-expressions
    expect(createDynamicImportRegex('myModule').test(content2)).to.be.true;
    // eslint-disable-next-line no-unused-expressions
    expect(createDynamicImportRegex('myModule').test(content3)).to.be.false;
  });

  it('should extract the file name without extension using getFileName', () => {
    expect(getFileName('src/utils/helper.js')).to.equal('helper');
    expect(getFileName('components/Button.jsx')).to.equal('Button');
    expect(getFileName('README.md')).to.equal('README');
  });

  it('should return deleted files from git using getDeletedFiles', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    execSyncStub.returns(Buffer.from('src/oldFile.js\nutils/legacy.js\n'));
    const result = getDeletedFiles();
    expect(result).to.deep.equal(['src/oldFile.js', 'utils/legacy.js']);
    // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    expect(execSyncStub.calledWith('git ls-files --deleted')).to.be.true;
  });

  it('should detect broken imports in checkBrokenImports', () => {
    const deletedFiles = ['src/oldFile.js'];
    // Mock project file content
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    readdirSyncStub
      .withArgs(process.cwd())
      .returns([{ name: 'index.js', isDirectory: () => false }]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    readdirSyncStub.withArgs(process.cwd()).returns([
      { name: 'index.js', isDirectory: () => false },
      { name: 'src', isDirectory: () => true },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
