// Dependencies
const fs = require('fs');

const deriveRobots = (isProduction = false) => {
  let robots = 'User-agent: *\nDisallow: /';

  // Use our main robots.txt only when on production.
  if (isProduction) {
    fs.readFile(`${__dirname}/../../assets/robots.txt`, (error, content) => {
      if (error) {
        // eslint-disable-next-line
        console.error('Failed to read production robots.txt', error);
        return;
      }
      robots = content;
    });
    return robots;
  }

  // Disallow all crawlers on non-production environments.
  return robots;
};

const updateRobots = BUILD_OPTIONS => {
  // Derive our robots.txt content.
  const robotsContent = deriveRobots(BUILD_OPTIONS.buildtype === 'production');

  // Write to the build/{buildtype}/robots.txt the robots content.
  fs.writeFile(
    `${__dirname}/../../../../build/${BUILD_OPTIONS.buildtype}/robots.txt`,
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
      console.log('Robots.txt updated successfully!');
    },
  );
};

const defaultPostBuild = BUILD_OPTIONS => {
  // Log that we're starting post build.
  // eslint-disable-next-line
  console.log('Starting post build...');

  // Update our robots.txt depending on the environment.
  updateRobots(BUILD_OPTIONS);

  // Log that we finished the post build.
  // eslint-disable-next-line
  console.log('Post build finished!');
};

module.exports = defaultPostBuild;
