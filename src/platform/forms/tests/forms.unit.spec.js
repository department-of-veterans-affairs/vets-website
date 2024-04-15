import { expect } from 'chai';
import { VA_FORM_IDS } from 'platform/forms/constants';
import schemas from 'vets-json-schema/dist/schemas';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { isReactComponent } from 'platform/utilities/ui';

const path = require('path');
const find = require('find');

// Remap the formId to match the name in vets-json-schema
const remapFormId = {
  [VA_FORM_IDS.FORM_10_10EZ]: '10-10EZ',
  [VA_FORM_IDS.FORM_21_526EZ]: '21-526EZ-ALLCLAIMS',
  [VA_FORM_IDS.FORM_22_1990S]: 'VRRAP',
};

// These form IDs have a config/form.js file but the formId is not found in vets-json-schema/dist/schemas
const missingFromVetsJsonSchema = [
  VA_FORM_IDS.FORM_10_7959C,
  VA_FORM_IDS.FORM_HC_QSTNR,
  VA_FORM_IDS.FORM_21_0845,
  VA_FORM_IDS.FORM_21_22,
  VA_FORM_IDS.FORM_10182,
  VA_FORM_IDS.FORM_21_22A,
  VA_FORM_IDS.FORM_COVID_VACCINE_TRIAL_UPDATE,
  VA_FORM_IDS.FORM_21_0966,
  VA_FORM_IDS.FORM_21_0972,
  VA_FORM_IDS.FORM_21_10210,
  VA_FORM_IDS.FORM_21P_0847,
  VA_FORM_IDS.FORM_XX_123,
  VA_FORM_IDS.FORM_MOCK,
  VA_FORM_IDS.FORM_20_0995,
  VA_FORM_IDS.FORM_20_10206,
  VA_FORM_IDS.FORM_20_10207,
  VA_FORM_IDS.FORM_40_0247,
  VA_FORM_IDS.FORM_MOCK_ALT_HEADER,
  VA_FORM_IDS.FORM_MOCK_SF_PATTERNS,
  VA_FORM_IDS.FORM_MOCK_PATTERNS_V3,
  VA_FORM_IDS.FORM_MOCK_APPEALS,
  VA_FORM_IDS.FORM_10_10D,
  VA_FORM_IDS.FORM_10_3542,
  VA_FORM_IDS.FORM_10_7959F_1,
];

const root = path.join(__dirname, '../../../');

const formConfigKeys = [
  'ariaDescribedBySubmit',
  'dev',
  'rootUrl',
  'formId',
  'version',
  'migrations',
  'chapters',
  'defaultDefinitions',
  'introduction',
  'signInHelpList',
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
  'CustomHeader',
  'customText',
  'submissionError',
  'saveInProgress',
  'hideUnauthedStartLink',
  'wizardStorageKey',
  'showReviewErrors',
  'reviewErrors',
  'useCustomScrollAndFocus',
  'v3SegmentedProgressBar',
  'formOptions',
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

const validComponentProperty = (
  formConfig,
  name,
  required = true,
  warning = null,
) => {
  const property = formConfig[name];
  if (required || property) {
    const msg = warning || `${name} is not a React component`;
    expect(isReactComponent(property), msg).to.be.true;
  }
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
  let { formId } = formConfig;
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
      validComponentProperty(
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

const validCustomText = ({ customText }) => {
  validObjectProperty({ customText }, 'customText', false);
  if (customText) {
    expect(
      Object.values(customText).every(value => typeof value === 'string'),
    ).to.equal(true, 'customText has a property value that is not a string');
  }
};

const validSaveInProgressConfig = formConfig => {
  // TODO: Change this to not _require_ saveInProgress
  validObjectProperty(formConfig, 'saveInProgress');
  const messages = formConfig.saveInProgress?.messages;
  if (messages) {
    validStringProperty(messages, 'inProgress', false);
    validStringProperty(messages, 'expired', false);
    validStringProperty(messages, 'saved', false);
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
          validStringProperty(formConfig, 'ariaDescribedBySubmit', false);
          validObjectProperty(formConfig, 'dev', false);
          validFormConfigKeys(formConfig);
          validFormId(formConfig);
          validStringProperty(formConfig, 'rootUrl', true);
          validNumberProperty(formConfig, 'version');
          validMigrations(formConfig);
          validObjectProperty(formConfig, 'chapters');
          validObjectProperty(formConfig, 'defaultDefinitions');
          validComponentProperty(formConfig, 'introduction', false);
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
          validComponentProperty(formConfig, 'confirmation');
          validObjectProperty(formConfig, 'preSubmitInfo', false);
          validComponentProperty(formConfig, 'footerContent', false);
          validFunctionProperty(formConfig, 'getHelp', false);
          validFunctionProperty(formConfig, 'errorText', false);
          validBooleanProperty(formConfig, 'verifyRequiredPrefill', false);
          validDowntime(formConfig);
          validFunctionProperty(formConfig, 'onFormLoaded', false);
          validComponentProperty(formConfig, 'formSavedPage', false);
          validAdditionalRoutes(formConfig);
          validFunctionProperty(formConfig, 'signInHelpList', false);
          validCustomText(formConfig);
          validFunctionProperty(formConfig, 'submissionError', false);
          validComponentProperty(formConfig, 'CustomHeader', false);
          validSaveInProgressConfig(formConfig);
          // This return true is needed for the to.eventually.be.ok a few lines down
          // If any of the expects in the above functions fail,
          // the test for the configFilePath fails as expected
          return true;
        }),
      ).to.eventually.be.ok;
    });
  });
});
