import { expect } from 'chai';
import sinon from 'sinon';

// eslint-disable-next-line import/no-commonjs
const getChangedApps = require('./get-changed-apps');

const createManifest = name => ({
  appName: name.toUpperCase(),
  entryFile: `./${name}-entry.jsx`,
  entryName: name,
  rootUrl: `/${name}`,
});

const createChangedAppsConfig = (apps = []) => {
  return { apps };
};

describe('getChangedAppsString', () => {
  let getManifestsStub;

  before(() => {
    // Stub getManifests to return mock data based on file path
    getManifestsStub = sinon.stub(getChangedApps, 'getManifests');

    // Set up default behavior - return manifest based on app folder name
    getManifestsStub.callsFake(filePath => {
      const rootAppFolderName = filePath.split('/')[2];

      const manifests = {
        app1: [createManifest('app1')],
        app2: [createManifest('app2')],
        app3: [createManifest('app3')],
        app4: [], // No manifest
        app5: [
          {
            appName: 'APP5',
            entryFile: './app5-entry.jsx',
            entryName: 'app5',
            // No rootUrl
          },
        ],
        groupedApps: [
          createManifest('groupedApp1'),
          createManifest('groupedApp2'),
        ],
      };

      return manifests[rootAppFolderName] || [];
    });
  });

  after(() => {
    getManifestsStub.restore();
  });

  context('when the entry output type is specified', () => {
    it('should return an empty string when the allow list is empty', () => {
      const config = createChangedAppsConfig();
      const changedFiles = [
        'src/applications/app1/some-file.js',
        'src/applications/app2/some-file.js',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'folder',
      );
      expect(appString).to.be.empty;
    });

    it('should return a space-delimited string of entry names when multiple apps on the allow list are modified', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = [
        'src/applications/app1/some-file.js',
        'src/applications/app2',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
      );
      expect(appString).to.equal('app1 app2');
    });

    it('should not duplicate entry names when multiple files in an app are modified', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'app1' }]);
      const changedFiles = [
        'src/applications/app1/some-file.js',
        'src/applications/app1/other-file.js',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
      );
      expect(appString).to.equal('app1');
    });

    it('should return a space-delimited string of entry names when files in a grouped app folder are changed', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'groupedApps' }]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
      );
      expect(appString).to.equal('groupedApp1 groupedApp2');
    });
  });

  context('when the folder output type is specified', () => {
    it('should return a space-delimited string of app folders', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app2'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'folder',
      );
      expect(appString).to.equal('src/applications/app1 src/applications/app2');
    });

    it('should return the root app path if the changed files are in a grouped app folder', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'groupedApps' }]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'folder',
      );
      expect(appString).to.equal('src/applications/groupedApps');
    });
  });

  context('when the slack-group output type is specified', () => {
    it('should return a space-delimited string of app owner Slack groups', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1', slackGroup: '@appTeam1' },
        { rootFolder: 'app2', slackGroup: '@appTeam2' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app2'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
      );
      expect(appString).to.equal('@appTeam1 @appTeam2');
    });

    it('should return an empty string when the app does not have a Slack group', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'app3' }]);
      const changedFiles = ['src/applications/app3'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
      );
      expect(appString).to.be.empty;
    });

    it('should return a Slack group when only one app has a specified Slack group', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1', slackGroup: '@appTeam1' },
        { rootFolder: 'app3' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app3'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
      );
      expect(appString).to.equal('@appTeam1');
    });

    it('should return a Slack group when files are changed in a grouped app folder', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'groupedApps', slackGroup: '@appTeamGrouped' },
      ]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
      );
      expect(appString).to.equal('@appTeamGrouped');
    });
  });

  context('when the url output type is specified', () => {
    it('should return a space-delimited string of app URLs', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app2'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'url',
      );
      expect(appString).to.equal('/app1 /app2');
    });

    it('should return an empty string when the app does not have a root url', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'app5' }]);
      const changedFiles = ['src/applications/app5'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'url',
      );
      expect(appString).to.be.empty;
    });

    it('should return an app URL string when only one app does not have a root url', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app5' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app5'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'url',
      );
      expect(appString).to.equal('/app1');
    });

    it('should return app URLs of all apps if the changed files are in a grouped app folder', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'groupedApps' }]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'url',
      );
      expect(appString).to.equal('/groupedApp1 /groupedApp2');
    });
  });

  context('when the delimiter is specified', () => {
    it('should return a string delimited by the delimiter', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = [
        'src/applications/app1/some-file.js',
        'src/applications/app2',
      ];
      const delimiter = ',';

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'entry',
        delimiter,
      );
      expect(appString).to.equal(`app1${delimiter}app2`);
    });
  });

  context('when an unknown output type is specified', () => {
    it('should throw an error', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app2'];

      expect(() => {
        getChangedApps.getChangedAppsString(changedFiles, config, 'unknown');
      }).to.throw('Invalid output type specified.');
    });
  });

  context('when apps outside the allow list are modified', () => {
    it('should return an empty string', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = ['src/applications/app3/some-file.js'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'folder',
      );
      expect(appString).to.be.empty;
    });
  });

  context('when a modified app does not have a manifest file', () => {
    it('should return an empty string', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app4' },
      ]);
      const changedFiles = ['src/applications/app4/some-file.js'];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'folder',
      );
      expect(appString).to.be.empty;
    });
  });

  context('when non-app code is modified', () => {
    it('should return an empty string', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = [
        'src/applications/app1',
        'src/applications/app2/some-file.js',
        'src/platform',
      ];

      const appString = getChangedApps.getChangedAppsString(
        changedFiles,
        config,
        'folder',
      );
      expect(appString).to.be.empty;
    });
  });
});

describe('isContinuousDeploymentEnabled', () => {
  let getManifestsStub;

  before(() => {
    getManifestsStub = sinon.stub(getChangedApps, 'getManifests');

    getManifestsStub.callsFake(filePath => {
      const rootAppFolderName = filePath.split('/')[2];

      const manifests = {
        app1: [createManifest('app1')],
        app2: [createManifest('app2')],
      };

      return manifests[rootAppFolderName] || [];
    });
  });

  after(() => {
    getManifestsStub.restore();
  });

  it('should return true when an app does not specify continuous deployment option', () => {
    const config = createChangedAppsConfig([{ rootFolder: 'app1' }]);
    const changedFiles = ['src/applications/app1/some-file.js'];

    const continuousDeployment = getChangedApps.isContinuousDeploymentEnabled(
      changedFiles,
      config,
    );
    expect(continuousDeployment).to.be.true;
  });

  it('should return false when an app sets continuous deployment to false', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1', continuousDeployment: false },
    ]);
    const changedFiles = ['src/applications/app1/some-file.js'];

    const continuousDeployment = getChangedApps.isContinuousDeploymentEnabled(
      changedFiles,
      config,
    );
    expect(continuousDeployment).to.be.false;
  });

  it('should return false when at least one app sets continuous deployment to false', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1', continuousDeployment: false },
      { rootFolder: 'app2' },
    ]);
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app2/some-file.js',
    ];

    const continuousDeployment = getChangedApps.isContinuousDeploymentEnabled(
      changedFiles,
      config,
    );
    expect(continuousDeployment).to.be.false;
  });

  it('should return true when no apps set continuous deployment to false', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1' },
      { rootFolder: 'app2', continuousDeployment: true },
    ]);
    const changedFiles = [
      'src/applications/app1/some-file.js',
      'src/applications/app2/some-file.js',
    ];

    const continuousDeployment = getChangedApps.isContinuousDeploymentEnabled(
      changedFiles,
      config,
    );
    expect(continuousDeployment).to.be.true;
  });

  it('should throw an when an app has an invalid data type in `continuousDeployment`', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1', continuousDeployment: 'on' },
    ]);
    const changedFiles = ['src/applications/app1/some-file.js'];

    expect(() => {
      getChangedApps.isContinuousDeploymentEnabled(changedFiles, config);
    }).to.throw(Error);
  });

  it('should return false when there are no changed file paths', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1', continuousDeployment: true },
    ]);
    const changedFiles = [];

    const continuousDeployment = getChangedApps.isContinuousDeploymentEnabled(
      changedFiles,
      config,
    );
    expect(continuousDeployment).to.be.false;
  });
});
