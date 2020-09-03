import { expect } from 'chai';
import { VA_FORM_IDS } from 'platform/forms/constants';
import schemas from 'vets-json-schema/dist/schemas';
import { sessionStorageSetup } from 'platform/testing/utilities';

const path = require('path');
const find = require('find');

// Remap the formId to match the name in vets-json-schema
const remapFormId = {
  [VA_FORM_IDS.FORM_10_10EZ]: '10-10EZ',
  [VA_FORM_IDS.FORM_21_526EZ]: '21-526EZ-ALLCLAIMS',
};

// These form IDs have a config/form.js file but the formId is not found in vets-json-schema/dist/schemas
const missingFromVetsJsonSchema = [
  VA_FORM_IDS.FORM_HC_QSTNR,
  VA_FORM_IDS.FORM_COVID_RESEARCH_VOLUNTEER,
  VA_FORM_IDS.FORM_21_22,
];

const root = path.join(__dirname, '../../../');

const validProperty = (formConfig, name, type, required = true) => {
  const property = formConfig[name];
  if (required || property) {
    return expect(property).to.be.a(type, `${name} is not a ${type}`);
  }
  return true;
};

const validObjectProperty = (formConfig, name, required = true) => {
  return validProperty(formConfig, name, 'object', required);
};

const validFunctionProperty = (formConfig, name, required = true) => {
  return validProperty(formConfig, name, 'function', required);
};

const validBooleanProperty = (formConfig, name, required = true) => {
  return validProperty(formConfig, name, 'boolean', required);
};

const validStringProperty = (formConfig, name, required = true) => {
  return validProperty(formConfig, name, 'string', required);
};

const validNumberProperty = (formConfig, name, required = true) => {
  return validProperty(formConfig, name, 'number', required);
};

const validFormId = formConfig => {
  let formId = formConfig.formId;
  if (Object.keys(remapFormId).includes(formId)) {
    formId = remapFormId[formId];
  }

  if (!missingFromVetsJsonSchema.includes(formId)) {
    return (
      validStringProperty(formConfig, 'formId') &&
      expect(Object.keys(schemas)).to.include(
        formId,
        `the formId "${formId}" does not match a formId property in vets-json-schema/dist/schemas`,
      )
    );
  }
  return validStringProperty(formConfig, 'formId');
};

const validMigrations = formConfig => {
  const { migrations } = formConfig;
  if (migrations || formConfig.version > 0) {
    return (
      expect(migrations.length).to.equal(
        formConfig.version,
        'migrations length does not match version number',
      ) &&
      expect(migrations).to.be.an('array', 'migrations is not an array') &&
      expect(
        migrations.every(migration => typeof migration === 'function'),
      ).to.equal(true, 'migrations is not an array of functions')
    );
  }
  return true;
};

const validTitle = ({ title }) => {
  const formTitle =
    typeof title === 'function' ? title({ formData: {} }) : title;
  return expect(formTitle).to.be.a('string', 'title does not return a string');
};

describe('form:', () => {
  sessionStorageSetup();

  // Find all config/form.js or config/form.jsx files within src/applications
  const configFiles = find.fileSync(
    /config\/form\.js.?$/,
    path.join(root, './applications'),
  );

  Object.values(configFiles).forEach(configFilePath => {
    it(`${configFilePath.replace(root, '')}:`, () => {
      return expect(
        // Dynamically import the module and perform tests on its default export
        import(configFilePath).then(({ default: formConfig }) => {
          return (
            validFormId(formConfig) &&
            validNumberProperty(formConfig, 'version') &&
            validMigrations(formConfig) &&
            validObjectProperty(formConfig, 'chapters') &&
            validObjectProperty(formConfig, 'defaultDefinitions') &&
            validFunctionProperty(formConfig, 'introduction', false) &&
            validBooleanProperty(formConfig, 'prefillEnabled', false) &&
            validFunctionProperty(formConfig, 'prefillTransformer', false) &&
            validStringProperty(formConfig, 'trackingPrefix') &&
            validTitle(formConfig) &&
            validStringProperty(formConfig, 'subTitle', false) &&
            validStringProperty(formConfig, 'urlPrefix', false) &&
            validStringProperty(formConfig, 'submitUrl', false) &&
            validFunctionProperty(formConfig, 'submit', false) &&
            validObjectProperty(formConfig, 'saveFormMessages', false) &&
            validFunctionProperty(formConfig, 'transformForSubmit', false) &&
            validFunctionProperty(formConfig, 'confirmation') &&
            validObjectProperty(formConfig, 'preSubmitInfo', false) &&
            validFunctionProperty(formConfig, 'footerContent', false) &&
            validFunctionProperty(formConfig, 'getHelp', false) &&
            validFunctionProperty(formConfig, 'errorText', false)
          );
        }),
      ).to.eventually.be.ok;
    });
  });
});
