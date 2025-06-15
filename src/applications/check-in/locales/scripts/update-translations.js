const fs = require('fs');
const path = require('path');

(async () => {
  const languages = ['en', 'es', 'tl'];

  const files = fs.readdirSync(path.resolve(__dirname, './input-files'));

  files.forEach(file => {
    const fileName = path.basename(file, '.json');

    if (languages.includes(fileName)) {
      try {
        const translations = JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, `./input-files/${file}`),
            'utf8',
          ),
        );

        const originalTranslations = JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, `../${fileName}/translation.json`),
            'utf8',
          ),
        );

        const updatedTranslations = { ...originalTranslations };

        Object.keys(translations).forEach(key => {
          updatedTranslations[key] = translations[key];
        });

        const sortedTranslations = Object.keys(updatedTranslations)
          .sort()
          .reduce((acc, key) => {
            acc[key] = updatedTranslations[key];
            return acc;
          }, {});

        fs.writeFileSync(
          path.resolve(__dirname, `../${fileName}/translation.json`),
          JSON.stringify(sortedTranslations, null, 2),
        );

        // eslint-disable-next-line no-console
        console.log(`Updated translations for ${fileName}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  });
})();
