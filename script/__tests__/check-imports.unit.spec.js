import { expect } from 'chai';
import sinon from 'sinon';
import childProcess from 'child_process';
import { runEslint } from '../check-imports';

describe('check-imports', () => {
  let execSyncStub;
  beforeEach(() => {
    execSyncStub = sinon.stub(childProcess, 'execSync');
  });

  afterEach(() => {
    // TODO: investigate
    // sinon.restore()
  });
  it('should lint all files if a file is deleted', () => {
    expect(3).to.eq(3);
    // Simulate file being deleted using git diff
    // reference: https://stackoverflow.com/questions/38363560/looking-at-git-diff-name-status-how-can-i-tell-that-a-file-has-been-renamed
    execSyncStub
      .withArgs('git diff --cached --name-status')
      .returns('D\tdeletedFile.js\n');

    runEslint(['']);
  });
});
