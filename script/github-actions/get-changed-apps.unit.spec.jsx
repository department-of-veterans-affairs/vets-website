import path from 'path';
import { expect } from 'chai';

import {
  getChangedAppsString,
  isContinuousDeploymentEnabled,
} from './get-changed-apps';

const root = process.cwd();

const createManifest = name => {
  return JSON.stringify({
    appName: name.toUpperCase(),
    entryFile: `./${name}-entry.jsx`,
    entryName: name,
    rootUrl: `/${name}`,
  });
};

const createChangedAppsConfig = (apps = []) => {
  return { apps };
};

/**
 * Creates a mock file system structure for testing.
 * Returns a mock fs module that can be injected into the functions.
 */
const createMockFs = fileStructure => {
  // Normalize all paths to use the current working directory
  const normalizedStructure = {};
  Object.entries(fileStructure).forEach(([key, value]) => {
    const normalizedKey = key.startsWith('/') ? key : path.join(root, key);
    normalizedStructure[normalizedKey] = value;
  });

  // Helper to check if a path exists in the structure
  const pathExists = targetPath => {
    // Check exact match
    if (normalizedStructure[targetPath] !== undefined) return true;

    // Check if it's a parent directory of any file
    const normalizedTarget = targetPath.endsWith('/')
      ? targetPath
      : `${targetPath}/`;
    return Object.keys(normalizedStructure).some(
      p => p.startsWith(normalizedTarget) || p === targetPath,
    );
  };

  // Helper to get directory entries
  const getDirectoryEntries = dirPath => {
    const normalizedDir = dirPath.endsWith('/') ? dirPath : `${dirPath}/`;
    const entries = new Set();

    Object.keys(normalizedStructure).forEach(p => {
      if (p.startsWith(normalizedDir)) {
        const relativePath = p.slice(normalizedDir.length);
        const firstPart = relativePath.split('/')[0];
        if (firstPart) {
          entries.add(firstPart);
        }
      }
    });

    return Array.from(entries);
  };

  // Helper to check if path is a directory
  const isDirectory = targetPath => {
    const normalizedTarget = targetPath.endsWith('/')
      ? targetPath
      : `${targetPath}/`;
    return Object.keys(normalizedStructure).some(p =>
      p.startsWith(normalizedTarget),
    );
  };

  return {
    existsSync: targetPath => pathExists(targetPath),
    readFileSync: filePath => {
      if (normalizedStructure[filePath] !== undefined) {
        return normalizedStructure[filePath];
      }
      throw new Error(`ENOENT: no such file or directory, open '${filePath}'`);
    },
    readdirSync: (dirPath, options) => {
      const entries = getDirectoryEntries(dirPath);
      if (options && options.withFileTypes) {
        return entries.map(name => {
          const fullPath = path.join(dirPath, name);
          return {
            name,
            isDirectory: () => isDirectory(fullPath),
            isFile: () => !isDirectory(fullPath),
          };
        });
      }
      return entries;
    },
  };
};

describe('getChangedAppsString', () => {
  const mockFs = createMockFs({
    'src/applications/app1/manifest.json': createManifest('app1'),
    'src/applications/app1/some-file.js': '',
    'src/applications/app1/other-file.js': '',
    'src/applications/app2/manifest.json': createManifest('app2'),
    'src/applications/app2/some-file.js': '',
    'src/applications/app3/manifest.json': createManifest('app3'),
    'src/applications/app3/some-file.js': '',
    'src/applications/app4/some-file.js': '',
    'src/applications/app5/manifest.json': JSON.stringify({
      appName: 'APP5',
      entryFile: './app5-entry.jsx',
      entryName: 'app5',
    }),
    'src/applications/app5/some-file.js': '',
    'src/applications/groupedApps/grouped-app-1/manifest.json': createManifest(
      'groupedApp1',
    ),
    'src/applications/groupedApps/grouped-app-1/some-file.js': '',
    'src/applications/groupedApps/grouped-app-2/manifest.json': createManifest(
      'groupedApp2',
    ),
    'src/applications/groupedApps/grouped-app-2/some-file.js': '',
    'src/applications/groupedApps/grouped-apps-utils.js': '',
  });

  context('when the entry output type is specified', () => {
    it('should return an empty string when the allow list is empty', () => {
      const config = createChangedAppsConfig();
      const changedFiles = [
        'src/applications/app1/some-file.js',
        'src/applications/app2/some-file.js',
      ];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'folder',
        ' ',
        mockFs,
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'entry',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('app1 app2');
    });

    it('should not duplicate entry names when multiple files in an app are modified', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'app1' }]);
      const changedFiles = [
        'src/applications/app1/some-file.js',
        'src/applications/app1/other-file.js',
      ];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'entry',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('app1');
    });

    it('should return a space-delimited string of entry names when files in a grouped app folder are changed', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'groupedApps' }]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'entry',
        ' ',
        mockFs,
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'folder',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('src/applications/app1 src/applications/app2');
    });

    it('should return the root app path if the changed files are in a grouped app folder', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'groupedApps' }]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'folder',
        ' ',
        mockFs,
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('@appTeam1 @appTeam2');
    });

    it('should return an empty string when the app does not have a Slack group', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'app3' }]);
      const changedFiles = ['src/applications/app3'];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
        ' ',
        mockFs,
      );
      expect(appString).to.be.empty;
    });

    it('should return a Slack group when only one app has a specified Slack group', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1', slackGroup: '@appTeam1' },
        { rootFolder: 'app3' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app3'];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
        ' ',
        mockFs,
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'slack-group',
        ' ',
        mockFs,
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'url',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('/app1 /app2');
    });

    it('should return an empty string when the app does not have a root url', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'app5' }]);
      const changedFiles = ['src/applications/app5'];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'url',
        ' ',
        mockFs,
      );
      expect(appString).to.be.empty;
    });

    it('should return an app URL string when only one app does not have a root url', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app5' },
      ]);
      const changedFiles = ['src/applications/app1', 'src/applications/app5'];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'url',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('/app1');
    });

    it('should return app URLs of all apps if the changed files are in a grouped app folder', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'groupedApps' }]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'url',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('/groupedApp1 /groupedApp2');
    });
  });

  context('when the concurrency-group output type is specified', () => {
    it('should return a single root folder name for a single app', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'app1' }]);
      const changedFiles = ['src/applications/app1/some-file.js'];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'concurrency-group',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('app1');
    });

    it('should return sorted root folder names for multiple apps', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app2' },
        { rootFolder: 'app1' },
      ]);
      const changedFiles = ['src/applications/app2', 'src/applications/app1'];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'concurrency-group',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('app1 app2');
    });

    it('should return the root folder name when files are changed in a grouped app folder', () => {
      const config = createChangedAppsConfig([{ rootFolder: 'groupedApps' }]);
      const changedFiles = [
        'src/applications/groupedApps/grouped-app-1/some-file.js',
      ];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'concurrency-group',
        ' ',
        mockFs,
      );
      expect(appString).to.equal('groupedApps');
    });

    it('should return hyphen-delimited sorted root folder names when using hyphen delimiter', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app2' },
        { rootFolder: 'app1' },
        { rootFolder: 'app3' },
      ]);
      const changedFiles = [
        'src/applications/app3',
        'src/applications/app1',
        'src/applications/app2',
      ];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'concurrency-group',
        '-',
        mockFs,
      );
      expect(appString).to.equal('app1-app2-app3');
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'entry',
        delimiter,
        mockFs,
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
        getChangedAppsString(changedFiles, config, 'unknown', ' ', mockFs);
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'folder',
        ' ',
        mockFs,
      );
      expect(appString).to.be.empty;
    });
  });

  context('when a modified app does not have a manifest file', () => {
    it('should return an empty string', () => {
      const config = createChangedAppsConfig([
        { rootFolder: 'app1' },
        { rootFolder: 'app2' },
      ]);
      const changedFiles = ['src/applications/app4/some-file.js'];

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'folder',
        ' ',
        mockFs,
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

      const appString = getChangedAppsString(
        changedFiles,
        config,
        'folder',
        ' ',
        mockFs,
      );
      expect(appString).to.be.empty;
    });
  });
});

describe('isContinuousDeploymentEnabled', () => {
  const mockFs = createMockFs({
    'src/applications/app1/manifest.json': createManifest('app1'),
    'src/applications/app1/some-file.js': '',
    'src/applications/app1/other-file.js': '',
    'src/applications/app2/manifest.json': createManifest('app2'),
    'src/applications/app2/some-file.js': '',
    'src/applications/app2/other-file.js': '',
  });

  it('should return true when an app does not specify continuous deployment option', () => {
    const config = createChangedAppsConfig([{ rootFolder: 'app1' }]);
    const changedFiles = ['src/applications/app1/some-file.js'];

    const continuousDeployment = isContinuousDeploymentEnabled(
      changedFiles,
      config,
      mockFs,
    );
    expect(continuousDeployment).to.be.true;
  });

  it('should return false when an app sets continuous deployment to false', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1', continuousDeployment: false },
    ]);
    const changedFiles = ['src/applications/app1/some-file.js'];

    const continuousDeployment = isContinuousDeploymentEnabled(
      changedFiles,
      config,
      mockFs,
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

    const continuousDeployment = isContinuousDeploymentEnabled(
      changedFiles,
      config,
      mockFs,
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

    const continuousDeployment = isContinuousDeploymentEnabled(
      changedFiles,
      config,
      mockFs,
    );
    expect(continuousDeployment).to.be.true;
  });

  it('should throw an when an app has an invalid data type in `continuousDeployment`', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1', continuousDeployment: 'on' },
    ]);
    const changedFiles = ['src/applications/app1/some-file.js'];

    expect(() => {
      isContinuousDeploymentEnabled(changedFiles, config, mockFs);
    }).to.throw(Error);
  });

  it('should return false when there are no changed file paths', () => {
    const config = createChangedAppsConfig([
      { rootFolder: 'app1', continuousDeployment: true },
    ]);
    const changedFiles = [];

    const continuousDeployment = isContinuousDeploymentEnabled(
      changedFiles,
      config,
      mockFs,
    );
    expect(continuousDeployment).to.be.false;
  });
});
