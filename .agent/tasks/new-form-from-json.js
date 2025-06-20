const yeoman = require('yeoman-environment');
const fs = require('fs');

(async () => {
  const options = JSON.parse(fs.readFileSync('.agent/tmp/new_form.json', 'utf8'));

  const env = yeoman.createEnv();
  await env.lookup(); // No callback anymore

  env.run('@department-of-veterans-affairs/vets-website', options);
})();