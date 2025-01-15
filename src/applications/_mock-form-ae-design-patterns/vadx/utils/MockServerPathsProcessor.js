export class MockServerPathsProcessor {
  constructor(manifests, mockServerPaths) {
    this.manifests = manifests;
    this.mockServerPaths = mockServerPaths;
  }

  /**
   * Extracts the application name from a path
   * @private
   * @param {string} path - Path to extract app name from
   * @returns {string|null} Application name or null if not found
   */
  _extractAppName(path) {
    const match = path.match(/src\/applications\/([^/]+)/);
    return match ? match[1] : null;
  }

  /**
   * Creates a basic mock path entry with default values
   * @private
   * @param {string} mockPath - The mock server path
   * @returns {object} Basic mock path entry
   */
  static createBasicMockPathEntry(mockPath) {
    // we will use this as the fallback for appName
    const fileLocation = mockPath
      .split('/')
      .slice(0, -1)
      .join('/');

    return {
      mockPath,
      appName: fileLocation,
      entryName: 'app entryName not found',
      rootUrl: 'not found',
      mockFileName: mockPath.split('/').pop(),
      applicationPath: 'not found',
      name: null,
      description: null,
    };
  }

  /**
   * Get all mock API paths with their associated manifest information
   * @returns {Array} Array of objects containing mock path and manifest info
   */
  getMockPathsWithManifestInfo() {
    // collect all mockApiResponses from manifests
    const manifestMockPaths = this.manifests
      .filter(manifest => manifest.mockApiResponses)
      .flatMap(manifest =>
        manifest.mockApiResponses.map(mockResponse => ({
          mockPath: mockResponse.path,
          appName: manifest.appName,
          entryName: manifest.entryName,
          rootUrl: manifest.rootUrl || 'not found',
          mockFileName: mockResponse.path.split('/').pop(),
          applicationPath: manifest.path,
          name: mockResponse.name,
          description: mockResponse.description,
        })),
      );

    const pathMap = new Map();

    // Add manifest-defined mock paths first as they take precedence
    manifestMockPaths.forEach(entry => {
      pathMap.set(entry.mockPath, entry);
    });

    // process mockServerPaths and add any that aren't already included
    this.mockServerPaths.forEach(mockPath => {
      // skip if we already have this path from manifest mockApiResponses
      if (pathMap.has(mockPath)) return;

      const appName = this._extractAppName(mockPath);

      // Find corresponding manifest if possible
      const manifest = appName
        ? this.manifests.find(m => {
            const manifestAppName = this._extractAppName(m.path);
            return manifestAppName === appName;
          })
        : null;

      if (manifest) {
        pathMap.set(mockPath, {
          mockPath,
          appName: manifest.appName,
          entryName: manifest.entryName,
          rootUrl: manifest.rootUrl || 'not found',
          mockFileName: mockPath.split('/').pop(),
          applicationPath: manifest.path,
          name: null,
          description: null,
        });
      } else {
        pathMap.set(
          mockPath,
          MockServerPathsProcessor.createBasicMockPathEntry(mockPath),
        );
      }
    });

    // Convert map back to array
    return Array.from(pathMap.values());
  }

  /**
   * Get a summary of found vs not found paths
   * @returns {object} Summary statistics
   */
  getPathsSummary() {
    const paths = this.getMockPathsWithManifestInfo();
    return paths.reduce(
      (acc, path) => {
        if (path.appName === 'not found') {
          acc.withoutManifest += 1;
        } else {
          acc.withManifest += 1;
        }
        if (path.name) {
          acc.withExplicitConfig += 1;
        }
        acc.total += 1;
        return acc;
      },
      {
        withManifest: 0,
        withoutManifest: 0,
        withExplicitConfig: 0,
        total: 0,
      },
    );
  }
}
