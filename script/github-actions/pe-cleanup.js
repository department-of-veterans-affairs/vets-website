const fs = require('fs');
const core = require('@actions/core');
const yaml = require('js-yaml');

/* eslint-disable no-console */

const daysSinceUpdate = dateUpdated => {
  const diff = new Date() - new Date(dateUpdated);
  // return diff / (1000 * 60 * 60 * 24);
  console.log(diff);
  return 8;
};

const deleteFiles = valuesFiles => {
  core.exportVariable('FILES_TO_DELETE', true);
  const envFileContents = yaml.load(
    fs.readFileSync(
      './manifests/apps/preview-environment/dev/argocd-apps/values.yaml',
    ),
  ).environments;
  valuesFiles.forEach(file => {
    const envFileMatch = envFileContents.filter(
      environment => environment.name === file.replace(/\.[^/.]+$/, ''),
    );
    if (file !== 'template-values.yaml') {
      try {
        if (envFileMatch.length > 0) {
          envFileContents.splice(0, envFileContents.indexOf(envFileMatch[0]));
        }
        fs.unlinkSync(
          `./manifests/apps/preview-environment/dev/pe-envs/${file}`,
        );
        console.log(`${file} removed`);
        const newEnvYaml = yaml.dump(envFileContents, {
          skipInvalid: true,
          lineWidth: -1,
          indent: 0,
        });
        fs.writeFileSync(
          './manifests/apps/preview-environment/dev/argocd-apps/values.yaml',
          newEnvYaml,
        );
      } catch (error) {
        console.log(error);
      }
    }
  });
};

if (process.env.TRIGGERING_EVENT === 'delete') {
  const valuesFiles = fs
    .readdirSync('./manifests/apps/preview-environment/dev/environment-values/')
    .filter(file =>
      file.includes(
        `${process.env.CURRENT_REPOSITORY}-${process.env.DELETED_BRANCH}`,
      ),
    );
  if (valuesFiles.length > 0) {
    deleteFiles(valuesFiles);
  } else {
    core.exportVariable('FILES_TO_DELETE', false);
  }
}

if (
  process.env.TRIGGERING_EVENT === 'schedule' ||
  process.env.TRIGGERING_EVENT === 'push'
) {
  const valuesFiles = fs
    .readdirSync('./manifests/apps/preview-environment/dev/pe-envs/')
    .filter(file => {
      const fileContents = yaml.load(
        fs.readFileSync(
          `./manifests/apps/preview-environment/dev/pe-envs/${file}`,
          'utf8',
        ),
      ).podAnnotations.last_updated;
      return !fileContents || daysSinceUpdate(fileContents) >= 7;
    });
  if (valuesFiles.length > 0) {
    deleteFiles(valuesFiles);
  } else {
    core.exportVariable('FILES_TO_DELETE', false);
  }
}
