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
      'src/applications/app5': {
        'manifest.json': JSON.stringify({
          appName: 'APP5',
          entryFile: './app5-entry.jsx',
          entryName: 'app5',
        }),
        'some-file.js': '',
      },
      'src/applications/groupedApps': {
        'grouped-app-1': {
          'manifest.json': createManifest('groupedApp1'),
          'some-file.js': '',
        },
        'grouped-app-2': {
          'manifest.json': createManifest('groupedApp2'),
          'some-file.js': '',
        },
        'grouped-apps-utils.js': '',
      },
    });
  });

  it('should return an empty string when the allow list is empty', () => {
    const config = { allow: { entryNames: [], groupedAppsFolders: [] } };
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app2/some-file.js',
    ];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return an empty string when apps outside the allow list are modified', () => {
    const config = {
      allow: { entryNames: ['app1', 'app2'], groupedAppsFolders: [] },
    };
    const changedFiles = ['src/applications/app3/some-file.js'];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return an empty string when a modified app does not have a manifest file', () => {
    const config = {
      allow: { entryNames: ['app1', 'app2'], groupedAppsFolders: [] },
    };
    const changedFiles = ['src/applications/app4/some-file.js'];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return an empty string when non-app code is modified', () => {
    const config = {
      allow: { entryNames: ['app1', 'app2'], groupedAppsFolders: [] },
    };
    const changedFiles = [
      'src/applications/app1',
      'src/applications/app2/some-file.js',
      'src/platform',
    ];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.be.empty;
  });

  it('should return a comma-delimited string of entry names when multiple apps on the allow list are modified', () => {
    const config = {
      allow: { entryNames: ['app1', 'app2'], groupedAppsFolders: [] },
    };
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app2',
    ];

    const appString = getChangedAppsString(changedFiles, config);
    expect(appString).to.equal('app1,app2');
  });

  it('should return a comma-delimited string of app folders when the folder output type is specified', () => {
    const config = {
      allow: { entryNames: ['app1', 'app2'], groupedAppsFolders: [] },
    };
    const changedFiles = ['src/applications/app1', 'src/applications/app2'];

    const appString = getChangedAppsString(changedFiles, config, 'folder');
    expect(appString).to.equal('src/applications/app1,src/applications/app2');
  });

  it('should return a comma-delimited string of app URLs when the url output type is specified', () => {
    const config = {
      allow: { entryNames: ['app1', 'app2'], groupedAppsFolders: [] },
    };
    const changedFiles = ['src/applications/app1', 'src/applications/app2'];

    const appString = getChangedAppsString(changedFiles, config, 'url');
    expect(appString).to.equal('/app1,/app2');
  });

  it('should not duplicate entry names when multiple files in an app are modified', () => {
    const config = { allow: { entryNames: ['app1'], groupedAppsFolders: [] } };
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app1/other-file.js',
    ];

    const appString = getChangedAppsString(changedFiles, config);
    expect(appString).to.equal('app1');
  });

  it('should throw an error when an unknown output type is specified', () => {
    const config = {
      allow: { entryNames: ['app1', 'app2'], groupedAppsFolders: [] },
    };
    const changedFiles = ['src/applications/app1', 'src/applications/app2'];

    expect(() => {
      getChangedAppsString(changedFiles, config, 'unknown');
    }).to.throw('Invalid output type specified.');
  });

  it('should return an empty string when the url output type is specified and the app does not have a root url', () => {
    const config = { allow: { entryNames: ['app5'], groupedAppsFolders: [] } };
    const changedFiles = ['src/applications/app5'];

    const appString = getChangedAppsString(changedFiles, config, 'url');
    expect(appString).to.be.empty;
  });

  it('should return an app URL string when the url output type is specified and only one app does not have a root url', () => {
    const config = {
      allow: { entryNames: ['app1', 'app5'], groupedAppsFolders: [] },
    };
    const changedFiles = ['src/applications/app1', 'src/applications/app5'];

    const appString = getChangedAppsString(changedFiles, config, 'url');
    expect(appString).to.equal('/app1');
  });

  it('should return a comma-delimited string of entry names when files in a grouped app folder are changed', () => {
    const config = {
      allow: {
        entryNames: [],
        groupedAppsFolders: ['src/applications/groupedApps'],
      },
    };
    const changedFiles = [
      'src/applications/groupedApps/grouped-app-1/some-file.js',
    ];

    const appString = getChangedAppsString(changedFiles, config);
    expect(appString).to.equal('groupedApp1,groupedApp2');
  });

  after(() => mockFs.restore());
});
