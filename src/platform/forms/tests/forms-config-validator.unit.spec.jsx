/* eslint-disable no-console */
import { expect } from 'chai';
import { VA_FORM_IDS } from 'platform/forms/constants';
import schemas from 'vets-json-schema/dist/schemas';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { isReactComponent } from 'platform/utilities/ui';
import path from 'path';
import find from 'find';
import trackMemoryUsage from '../../testing/unit/unit-test-track-memory-usage';

// Cache for validated configs to prevent duplicate validations
const validatedConfigs = new Map();

const formConfigFnParams = {
  'form-upload': '/forms/upload/21-0779',
  'representative-form-upload':
    '/representative/representative-form-upload/submit-va-form-21-686c',
};

const missingFromVetsJsonSchema = [
  VA_FORM_IDS.FORM_10_10D,
  VA_FORM_IDS.FORM_10_3542,
  VA_FORM_IDS.FORM_10_7959A,
  VA_FORM_IDS.FORM_10_7959C,
  VA_FORM_IDS.FORM_10_7959F_1,
  VA_FORM_IDS.FORM_10182,
  VA_FORM_IDS.FORM_1330M,
  VA_FORM_IDS.FORM_1330M2,
  VA_FORM_IDS.FORM_20_0995,
  VA_FORM_IDS.FORM_20_10206,
  VA_FORM_IDS.FORM_20_10207,
  VA_FORM_IDS.FORM_21_0779_UPLOAD,
  VA_FORM_IDS.FORM_21_0845,
  VA_FORM_IDS.FORM_21_0972,
  VA_FORM_IDS.FORM_21_10210,
  VA_FORM_IDS.FORM_21_4138,
  VA_FORM_IDS.FORM_21_509_UPLOAD,
  VA_FORM_IDS.FORM_21A,
  VA_FORM_IDS.FORM_21P_0516_1_UPLOAD,
  VA_FORM_IDS.FORM_21P_0518_1_UPLOAD,
  VA_FORM_IDS.FORM_21_686C_UPLOAD,
  VA_FORM_IDS.FORM_21P_0847,
  VA_FORM_IDS.FORM_27_8832,
  VA_FORM_IDS.FORM_40_0247,
  VA_FORM_IDS.FORM_COVID_VACCINE_TRIAL_UPDATE,
  VA_FORM_IDS.FORM_HC_QSTNR,
  VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  VA_FORM_IDS.FORM_MOCK_ALT_HEADER,
  VA_FORM_IDS.FORM_MOCK_APPEALS,
  VA_FORM_IDS.FORM_MOCK_HLR,
  VA_FORM_IDS.FORM_MOCK_MINIMAL_HEADER,
  VA_FORM_IDS.FORM_MOCK_PATTERNS_V3,
  VA_FORM_IDS.FORM_MOCK_SF_PATTERNS,
  VA_FORM_IDS.FORM_MOCK,
  VA_FORM_IDS.FORM_T_QSTNR,
  VA_FORM_IDS.FORM_WELCOME_VA_SETUP_REVIEW_INFORMATION,
  VA_FORM_IDS.FORM_XX_123,
  VA_FORM_IDS.FORM_28_1900_V2,
  VA_FORM_IDS.FORM_10_10D_EXTENDED,
  VA_FORM_IDS.FORM_40_XXXX,
  VA_FORM_IDS.FORM_21_4140,
  VA_FORM_IDS.FORM_21_2680,
  VA_FORM_IDS.FORM_21_8940,
  VA_FORM_IDS.FORM_21_4192,
  VA_FORM_IDS.FORM_21P_530A,
  VA_FORM_IDS.FORM_21P_0537,
  VA_FORM_IDS.FORM_21P_601,
  VA_FORM_IDS.FORM_MOCK_PREFILL,
  VA_FORM_IDS.FORM_22_0989,
];

const remapFormId = {
  [VA_FORM_IDS.FORM_10_10EZ]: '10-10EZ',
  [VA_FORM_IDS.FORM_21_526EZ]: '21-526EZ-ALLCLAIMS',
};

const formConfigKeys = [
  'additionalRoutes',
  'allowDuplicatePaths',
  'ariaDescribedBySubmit',
  'backLinkText',
  'chapters',
  'confirmation',
  'CustomReviewTopContent',
  'customValidationErrors',
  'customText',
  'CustomTopContent',
  'customValidationErrors',
  'defaultDefinitions',
  'dev',
  'disableSave',
  'downtime',
  'dynamicPaths',
  'errorText',
  'footerContent',
  'formId',
  'formOptions',
  'formSavedPage',
  'getHelp',
  'hideFormTitle',
  'hideFormTitleConfirmation',
  'hideReviewChapters',
  'hideUnauthedStartLink',
  'intentToFileUrl',
  'introduction',
  'migrations',
  'onFormLoaded',
  'prefillEnabled',
  'prefillTransformer',
  'preSubmitInfo',
  'reviewEditFocusOnHeaders',
  'reviewErrors',
  'rootUrl',
  'savedFormMessages',
  'saveInProgress',
  'scrollAndFocusTarget',
  'showReviewErrors',
  'showSaveLinkAfterButtons',
  'signInHelpList',
  'stepLabels',
  'submissionError',
  'submit',
  'submitErrorText',
  'submitUrl',
  'subTitle',
  'title',
  'trackingPrefix',
  'transformForSubmit',
  'urlPrefix',
  'useCustomScrollAndFocus',
  'useTopBackLink',
  'v3SegmentedProgressBar',
  'verifyRequiredPrefill',
  'version',
  'wizardStorageKey',
];

// Validation utilities object to reduce repeated function creation
const validators = {
  property: (obj, name, type, required = true, warning = null) => {
    const cacheKey = `${name}-${type}-${required}`;
    if (validatedConfigs.has(cacheKey)) return validatedConfigs.get(cacheKey);

    const property = obj[name];
    if (required || property) {
      const msg = warning || `${name} is not a ${type}`;
      expect(property).to.be.a(type, msg);
    }

    validatedConfigs.set(cacheKey, true);
    return true;
  },

  object: (obj, name, required = true, warning = null) =>
    validators.property(obj, name, 'object', required, warning),

  function: (obj, name, required = true, warning = null) =>
    validators.property(obj, name, 'function', required, warning),

  string: (obj, name, required = true, warning = null) =>
    validators.property(obj, name, 'string', required, warning),

  number: (obj, name, required = true, warning = null) =>
    validators.property(obj, name, 'number', required, warning),

  boolean: (obj, name, required = true, warning = null) =>
    validators.property(obj, name, 'boolean', required, warning),

  array: (obj, name, required = true, warning = null) =>
    validators.property(obj, name, 'array', required, warning),

  component: (obj, name, required = true, warning = null) => {
    const property = obj[name];
    if (required || property) {
      const msg = warning || `${name} is not a React component`;
      expect(isReactComponent(property), msg).to.be.true;
    }
  },
};

/**
 * Validation functions that use the validators object methods
 */
const validateFormConfig = {
  keys: formConfig => {
    const unknownKeys = Object.keys(formConfig).filter(
      key => !formConfigKeys.includes(key),
    );
    if (unknownKeys.length > 0) {
      const warning =
        `${formConfig.formId} has unknown properties: ${unknownKeys.join(
          ', ',
        )}. \n` +
        'Please check property names or update documentation and tests for new properties.';
      expect(unknownKeys, warning).to.have.lengthOf(0);
    }
  },

  formId: formConfig => {
    let { formId } = formConfig;
    formId = remapFormId[formId] || formId;

    validators.string(formConfig, 'formId');

    if (missingFromVetsJsonSchema.includes(formId)) {
      expect(Object.keys(schemas)).to.not.include(
        formId,
        `${formId} is in missingFromVetsJsonSchema but has a schema`,
      );
    } else {
      expect(Object.keys(schemas)).to.include(
        formId,
        `${formId} missing from vets-json-schema/dist/schemas`,
      );
    }
  },

  migrations: formConfig => {
    const { migrations, version } = formConfig;
    if (migrations || version > 0) {
      expect(migrations?.length).to.equal(
        version,
        `Version ${version} requires ${version} migrations, found ${
          migrations?.length
        }`,
      );
      validators.array({ migrations }, 'migrations');
      expect(migrations.every(m => typeof m === 'function')).to.be.true;
    }
  },

  downtime: ({ downtime }) => {
    if (downtime) {
      validators.object({ downtime }, 'downtime', false);
      validators.boolean(downtime, 'requireForPrefill', false);
      validators.function(downtime, 'message', false);
      validators.array(downtime, 'dependencies');

      const invalidDeps = downtime.dependencies.filter(
        dep => !Object.values(externalServices).includes(dep),
      );
      expect(invalidDeps).to.have.lengthOf(
        0,
        `Invalid dependencies: ${invalidDeps.join(', ')}`,
      );
    }
  },

  title: formConfig => {
    const title =
      typeof formConfig.title === 'function'
        ? formConfig.title({ formData: {} })
        : formConfig.title;
    expect(title).to.be.a('string');
  },

  customText: ({ customText }) => {
    if (customText) {
      validators.object({ customText }, 'customText', false);
      const nonStringValues = Object.entries(customText)
        .filter(([_, value]) => typeof value !== 'string')
        .map(([key]) => key);
      expect(nonStringValues).to.have.lengthOf(
        0,
        `Non-string values in customText: ${nonStringValues.join(', ')}`,
      );
    }
  },
};

// Modify validateForm to count validations
const validateForm = async (formSlug, formConfigParam) => {
  let config = formConfigParam;
  if (typeof config === 'function') {
    const key = formSlug.split('/')[0] || 'unknown';
    const options = formConfigFnParams[key];
    config = options ? config(options) : config();
  }

  const coreValidations = [
    validateFormConfig.keys(config),
    validateFormConfig.formId(config),
    validateFormConfig.migrations(config),
    validateFormConfig.title(config),
    validateFormConfig.downtime(config),
    validateFormConfig.customText(config),
  ];

  const requiredProps = {
    rootUrl: 'string',
    version: 'number',
    chapters: 'object',
    defaultDefinitions: 'object',
    trackingPrefix: 'string',
    confirmation: 'component',
  };

  const propValidations = Object.entries(requiredProps).map(([prop, type]) =>
    validators[type](config, prop),
  );

  // Optional property validations
  const optionalProps = {
    ariaDescribedBySubmit: 'string',
    dev: 'object',
    disableSave: 'boolean',
    introduction: 'component',
    prefillEnabled: 'boolean',
    prefillTransformer: 'function',
    urlPrefix: 'string',
    submitUrl: 'string',
    submit: 'function',
    transformForSubmit: 'function',
    preSubmitInfo: 'object',
    footerContent: 'component',
    getHelp: 'function',
    errorText: 'function',
    verifyRequiredPrefill: 'boolean',
    onFormLoaded: 'function',
    formSavedPage: 'component',
    signInHelpList: 'function',
    submissionError: 'function',
    CustomTopContent: 'component',
    useTopBackLink: 'boolean',
  };

  const optionalValidations = Object.entries(optionalProps)
    .filter(([prop]) => config[prop] !== undefined)
    .map(([prop, type]) => validators[type](config, prop, false));

  await Promise.all([
    ...coreValidations,
    ...propValidations,
    ...optionalValidations,
  ]);
  return true;
};

// Main test suite section
describe('Form Configuration Tests', function() {
  const tracker = trackMemoryUsage('Form Configuration Tests - BATCHED');
  this.timeout(30000);

  before(() => {
    tracker.startTracking();
  });

  after(() => {
    tracker.endTracking();
  });

  // Pre-compute file paths before tests
  const root = path.join(__dirname, '../../../');
  const configFiles = find.fileSync(
    /config\/form\.js.?$/,
    path.join(root, './applications'),
  );

  // Group tests for parallel execution
  const BATCH_SIZE = 12; // Adjust based on system capabilities

  const runBatchTest = (configPath, rootDir) => {
    const formSlug = configPath
      .split('/')
      .slice(-3, -1)
      .join('/');

    it(`validates ${formSlug}`, async () => {
      if (validatedConfigs.has(configPath)) {
        return validatedConfigs.get(configPath);
      }

      try {
        const { default: formConfig } = await import(configPath);
        const result = await validateForm(formSlug, formConfig);
        validatedConfigs.set(configPath, result);
        return result;
      } catch (error) {
        throw new Error(`${configPath.replace(rootDir, '')}: ${error.message}`);
      }
    });
  };

  for (let i = 0; i < configFiles.length; i += BATCH_SIZE) {
    const batch = configFiles.slice(i, i + BATCH_SIZE);
    describe(`Batch ${Math.floor(i / BATCH_SIZE) + 1}`, () => {
      batch.forEach(configPath => runBatchTest(configPath, root));
    });
  }
});
