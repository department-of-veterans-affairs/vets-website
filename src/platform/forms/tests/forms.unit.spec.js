import { expect } from 'chai';
import { VA_FORM_IDS } from 'platform/forms/constants';
import schemas from 'vets-json-schema/dist/schemas';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

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
  VA_FORM_IDS.FORM_21_22,
];

const root = path.join(__dirname, '../../../');

const formConfigKeys = [
  'formId',
  'version',
  'migrations',
  'chapters',
  'defaultDefinitions',
  'introduction',
  'prefillEnabled',
  'prefillTransformer',
  'trackingPrefix',
  'title',
  'subTitle',
  'urlPrefix',
  'submitUrl',
  'submit',
  'savedFormMessages',
  'transformForSubmit',
  'confirmation',
  'preSubmitInfo',
  'footerContent',
  'getHelp',
  'errorText',
  'verifyRequiredPrefill',
  'downtime',
  'intentToFileUrl',
  'onFormLoaded',
  'formSavedPage',
  'additionalRoutes',
  'submitErrorText',
  'authorize',
  'getAuthorizationState',
  'authorizationMessage',
  'customText',
  'submissionError',
];

const validProperty = (
  formConfig,
  name,
  type,
  required = true,
  warning = null,
) => {
  const property = formConfig[name];
  if (required || property) {
    const msg = warning || `${name} is not a ${type}`;
    expect(property).to.be.a(type, msg);
  }
};

const validObjectProperty = (
  formConfig,
  name,
  required = true,
  warning = null,
) => {
  validProperty(formConfig, name, 'object', required, warning);
};

const validFunctionProperty = (
  formConfig,
  name,
  required = true,
  warning = null,
) => {
  validProperty(formConfig, name, 'function', required, warning);
};

const validBooleanProperty = (
  formConfig,
  name,
  required = true,
  warning = null,
) => {
  validProperty(formConfig, name, 'boolean', required, warning);
};

const validStringProperty = (
  formConfig,
  name,
  required = true,
  warning = null,
) => {
  validProperty(formConfig, name, 'string', required, warning);
};

const validNumberProperty = (
  formConfig,
  name,
  required = true,
  warning = null,
) => {
  validProperty(formConfig, name, 'number', required, warning);
};

const validArrayProperty = (
  formConfig,
  name,
  required = true,
  warning = null,
) => {
  validProperty(formConfig, name, 'array', required, warning);
};

const validFormConfigKeys = formConfig => {
  Object.keys(formConfig).forEach(key => {
    const warning =
      `${formConfig.formId} has an unknown property "${key}". ` +
      '\nPlease check that the property name is correct.' +
      '\nIf this is a new property please update https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/config-options/' +
      ' and add a test to src/platform/forms/tests/forms.unit.spec.js for this property.\n';
    expect(formConfigKeys).to.include(key, warning);
  });
};

const validFormId = formConfig => {
  let formId = formConfig.formId;
  if (Object.keys(remapFormId).includes(formId)) {
    formId = remapFormId[formId];
  }

  validStringProperty(formConfig, 'formId');
  const schemaFormIds = Object.keys(schemas);
  if (missingFromVetsJsonSchema.includes(formId)) {
    expect(schemaFormIds).to.not.include(
      formId,
      `${formId} is in missingFromVetsJsonSchema but has a corresponding vets-json-schema, please remove from missingFromVetsJsonSchema`,
    );
  } else {
    expect(schemaFormIds).to.include(
      formId,
      `the formId "${formId}" does not match an entry in vets-json-schema/dist/schemas. Add the ID to missingFromVetsJsonSchema or add the corresponding schema to the vets-json-schema repo.`,
    );
  }
};

const validMigrations = formConfig => {
  const { migrations } = formConfig;
  if (migrations || formConfig.version > 0) {
    expect(migrations.length).to.equal(
      formConfig.version,
      `Expected a migration for each version change. The form is at version ${
        formConfig.version
      }, but found ${migrations.length} migrations.`,
    );
    validArrayProperty({ migrations }, 'migrations');
    expect(
      migrations.every(migration => typeof migration === 'function'),
    ).to.equal(true, 'migrations contains an element that is not a function');
  }
};

const validFormTitle = ({ title }) => {
  const formTitle =
    typeof title === 'function' ? title({ formData: {} }) : title;
  expect(formTitle).to.be.a('string', 'title does not return a string');
};

const validDowntime = ({ downtime }) => {
  validObjectProperty({ downtime }, 'downtime', false);
  if (downtime) {
    validBooleanProperty(downtime, 'requireForPrefill', false);
    validFunctionProperty(downtime, 'message', false);
    const { dependencies } = downtime;
    validArrayProperty(
      downtime,
      'dependencies',
      true,
      'downtime.dependencies is not an array',
    );
    dependencies.forEach(dependency => {
      expect(Object.values(externalServices)).to.include(
        dependency,
        `${dependency} is not a valid dependency. Please see src/platform/monitoring/DowntimeNotification/config/externalServices.js for a list of dependencies`,
      );
    });
  }
};

const validAdditionalRoutes = ({ additionalRoutes }) => {
  validArrayProperty({ additionalRoutes }, 'additionalRoutes', false);
  if (additionalRoutes) {
    additionalRoutes.forEach((route, index) => {
      validStringProperty(
        route,
        'path',
        true,
        `additionalRoutes[${index}].path is not a string`,
      );
      validFunctionProperty(
        route,
        'component',
        true,
        `additionalRoutes[${index}].component is not a function`,
      );
      validStringProperty(
        route,
        'pageKey',
        true,
        `additionalRoutes[${index}].component is not a string`,
      );
      validFunctionProperty(
        route,
        'depends',
        true,
        `additionalRoutes[${index}].depends is not a function`,
      );
    });
  }
};

const validAuthorization = formConfig => {
  validFunctionProperty(formConfig, 'authorize', false);
  const { authorize } = formConfig;
  if (authorize) {
    validFunctionProperty(formConfig, 'authorizationMessage');
    validFunctionProperty(formConfig, 'getAuthorizationState');
  }
};

const validCustomText = ({ customText }) => {
  validObjectProperty({ customText }, 'customText', false);
  if (customText) {
    expect(
      Object.values(customText).every(value => typeof value === 'string'),
    ).to.equal(true, 'customText has a property value that is not a string');
  }
};

describe('form:', () => {
  // Find all config/form.js or config/form.jsx files within src/applications
  const configFiles = find.fileSync(
    /config\/form\.js.?$/,
    path.join(root, './applications'),
  );

  Object.values(configFiles).forEach(configFilePath => {
    it(`${configFilePath.replace(root, '')}:`, () => {
      // This return is needed in order for failing expects within the promise to actually trigger a failure of the test
      return expect(
        // Dynamically import the module and perform tests on its default export
        import(configFilePath).then(({ default: formConfig }) => {
          validFormConfigKeys(formConfig);
          validFormId(formConfig);
          validNumberProperty(formConfig, 'version');
          validMigrations(formConfig);
          validObjectProperty(formConfig, 'chapters');
          validObjectProperty(formConfig, 'defaultDefinitions');
          validFunctionProperty(formConfig, 'introduction', false);
          validBooleanProperty(formConfig, 'prefillEnabled', false);
          validFunctionProperty(formConfig, 'prefillTransformer', false);
          validStringProperty(formConfig, 'trackingPrefix');
          validFormTitle(formConfig);
          validStringProperty(formConfig, 'subTitle', false);
          validStringProperty(formConfig, 'urlPrefix', false);
          validStringProperty(formConfig, 'submitUrl', false);
          validFunctionProperty(formConfig, 'submit', false);
          validObjectProperty(formConfig, 'savedFormMessages', false);
          validFunctionProperty(formConfig, 'transformForSubmit', false);
          validFunctionProperty(formConfig, 'confirmation');
          validObjectProperty(formConfig, 'preSubmitInfo', false);
          validFunctionProperty(formConfig, 'footerContent', false);
          validFunctionProperty(formConfig, 'getHelp', false);
          validFunctionProperty(formConfig, 'errorText', false);
          validBooleanProperty(formConfig, 'verifyRequiredPrefill', false);
          validDowntime(formConfig);
          validFunctionProperty(formConfig, 'onFormLoaded', false);
          validFunctionProperty(formConfig, 'formSavedPage', false);
          validAdditionalRoutes(formConfig);
          validAuthorization(formConfig);
          validCustomText(formConfig);
          validFunctionProperty(formConfig, 'submissionError', false);
          // This return true is needed for the to.eventually.be.ok a few lines down
          // If any of the expects in the above functions fail,
          // the test for the configFilePath fails as expected
          return true;
        }),
      ).to.eventually.be.ok;
    });
  });
});
