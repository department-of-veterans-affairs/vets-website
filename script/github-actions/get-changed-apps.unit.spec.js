import { expect } from 'chai';
import mockFs from 'mock-fs';

import { getChangedAppsString } from './get-changed-apps';

describe('getChangedAppsString', () => {
  const createManifest = name => {
    return JSON.stringify({
      appName: name.toUpperCase(),
      entryFile: `./${name}-entry.jsx`,
      entryName: name,
      rootUrl: `/${name}`,
    });
  };

  before(() => {
    mockFs({
      'src/applications/app1': {
        'manifest.json': createManifest('app1'),
        'some-file.js': '',
        'other-file.js': '',
      },
      'src/applications/app2': {
        'manifest.json': createManifest('app2'),
        'some-file.js': '',
      },
      'src/applications/app3': {
        'manifest.json': createManifest('app3'),
        'some-file.js': '',
      },
      'src/applications/app4': {
        'some-file.js': '',
      },
    });
  });

  it('should return an empty string when the allow list is empty', () => {
    const config = { allow: [] };
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app2/some-file.js',
    ];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return an empty string when apps outside the allow list are modified', () => {
    const config = { allow: ['app1', 'app2'] };
    const changedFiles = ['src/applications/app3/some-file.js'];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return an empty string when a modified app does not have a manifest file', () => {
    const config = { allow: ['app1', 'app2'] };
    const changedFiles = ['src/applications/app4/some-file.js'];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return an empty string when non-app code is modified', () => {
    const config = { allow: ['app1', 'app2'] };
    const changedFiles = [
      'src/applications/app1',
      'src/applications/app2/some-file.js',
      'src/platform',
    ];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return a comma-delimited string of entry names when multiple apps on the allow list are modified', () => {
    const config = { allow: ['app1', 'app2'] };
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app2',
    ];

    const appString = getChangedAppsString(changedFiles, config);
    expect(appString).to.equal('app1,app2');
  });

  it('should return a comma-delimited string of app folders when the folder output type is specified', () => {
    const config = { allow: ['app1', 'app2'] };
    const changedFiles = ['src/applications/app1', 'src/applications/app2'];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.equal('src/applications/app1,src/applications/app2');
  });

  it('should return a comma-delimited string of app URLs when the url output type is specified', () => {
    const config = { allow: ['app1', 'app2'] };
    const changedFiles = ['src/applications/app1', 'src/applications/app2'];

    const appString = getChangedAppsString(changedFiles, config, 'url');
    expect(appString).to.equal('/app1,/app2');
  });

  it('should not duplicate entry names when multiple files in an app are modified', () => {
    const config = { allow: ['app1'] };
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app1/other-file.js',
    ];

    const appString = getChangedAppsString(changedFiles, config);
    expect(appString).to.equal('app1');
  });

  after(() => mockFs.restore());
});
