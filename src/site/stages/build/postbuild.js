// Dependencies
const fs = require('fs');
// Relative imports
const robots = require('../../assets/robots.txt');

const deriveRobots = (isProduction = false) => {
  // Use our robots.txt only when on production.
  if (isProduction) {
    return robots;
  }

  // Disallow all crawlers on non-production environments.
  return 'User-agent: *\nDisallow: /';
};

const updateRobots = BUILD_OPTIONS => {
  // Derive our robots.txt content.
  const robotsContent = deriveRobots(BUILD_OPTIONS.buildtype === 'production');

  // Write to the build/{buildtype}/robots.txt the robots content.
  fs.writeFile(
    `../../../../build/${BUILD_OPTIONS.buildtype}/robots.txt`,
    robotsContent,
    error => {
      // Log if we failed to write to robots.txt.
      if (error) {
        // eslint-disable-next-line
        console.error('Failed to update robots.txt:', error);
        return;
      }

      // Log that robots.txt was updated.
      // eslint-disable-next-line
      console.log(`Robots.txt updated successfully with:`, robotsContent);
    },
  );
};

const defaultPostBuild = BUILD_OPTIONS => {
  updateRobots(BUILD_OPTIONS);
};

module.exports = defaultPostBuild;
