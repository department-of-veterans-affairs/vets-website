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

const formIdTest = formId => {
  if (!missingFromVetsJsonSchema.includes(formId)) {
    return expect(Object.keys(schemas)).to.include(
      formId,
      `the formId "${formId}" does not match a formId property in vets-json-schema/dist/schemas`,
    );
  }
  return true;
};

const migrationsTest = formConfig => {
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

describe('form:', () => {
  sessionStorageSetup();
  const configFiles = find.fileSync(
    /config\/form\.js$/,
    path.join(root, './applications'),
  );

  Object.values(configFiles).forEach(configFilePath => {
    const configFileRepoPath = configFilePath.replace(root, '');
    it(`${configFileRepoPath}:`, () => {
      return expect(
        import(configFilePath).then(({ default: formConfig }) => {
          let formId = formConfig.formId;
          if (Object.keys(remapFormId).includes(formId)) {
            formId = remapFormId[formId];
          }

          return formIdTest(formId) && migrationsTest(formConfig);
        }),
      ).to.eventually.be.ok;
    });
  });
});

// configs.forEach(form => {
//   describe(`${form.formId}:`, () => {
//     describe('migrations:', () => {
//       const { migrations } = form;
//       if (migrations || form.version > 0) {
//         it('should have a length equal to the version number', () => {
//           expect(migrations.length).to.equal(form.version);
//         });
//         it('should be typeof array', () => {
//           expect(migrations).to.be.an('array');
//         });
//         it('should be array of functions', () => {
//           expect(
//             migrations.every(migration => typeof migration === 'function'),
//           ).to.be.true;
//         });
//       }
//     });
//
//     it('should have chapters object', () => {
//       expect(form.chapters).to.be.an('object');
//     });
//
//     it('should have defaultDefinitions object', () => {
//       expect(form.defaultDefinitions).to.be.an('object');
//     });
//
//     if (form.introduction) {
//       it('should have introduction function', () => {
//         expect(form.introduction).to.be.a('function');
//       });
//     }
//
//     if (form.prefillEnabled) {
//       it('should have prefillEnabled boolean', () => {
//         expect(form.prefillEnabled).to.be.a('boolean');
//       });
//     }
//
//     if (form.prefillTransformer) {
//       it('should have prefillTransformer function', () => {
//         expect(form.prefillTransformer).to.be.a('function');
//       });
//     }
//
//     it('should have trackingPrefix', () => {
//       expect(form.trackingPrefix).to.be.a('string');
//     });
//
//     it('should have title', () => {
//       const title =
//         typeof form.title === 'function'
//           ? form.title({ formData: {} })
//           : form.title;
//       expect(title).to.be.a('string');
//     });
//
//     if (form.subTitle) {
//       it('should have subTitle', () => {
//         expect(form.subTitle).to.be.a('string');
//       });
//     }
//
//     it('should have urlPrefix', () => {
//       expect(form.urlPrefix).to.be.a('string');
//     });
//
//     if (form.submitUrl) {
//       it('should have submitUrl', () => {
//         expect(form.submitUrl).to.be.a('string');
//       });
//     }
//
//     if (form.submit) {
//       it('should have submit', () => {
//         expect(form.submit).to.be.a('function');
//       });
//     }
//
//     if (form.savedFormMessages) {
//       it('should have savedFormMessages', () => {
//         expect(form.savedFormMessages).to.be.a('object');
//       });
//     }
//
//     if (form.transformForSubmit) {
//       it('should have transformForSubmit', () => {
//         expect(form.transformForSubmit).to.be.a('function');
//       });
//     }
//
//     it('should have confirmation', () => {
//       expect(form.confirmation).to.be.a('function');
//     });
//
//     if (form.preSubmitInfo) {
//       it('should have preSubmitInfo', () => {
//         expect(form.preSubmitInfo).to.be.a('object');
//       });
//     }
//
//     if (form.footerContent) {
//       it('should have footerContent', () => {
//         expect(form.footerContent).to.be.a('function');
//       });
//     }
//
//     if (form.getHelp) {
//       it('should have getHelp', () => {
//         expect(form.getHelp).to.be.a('function');
//       });
//     }
//
//     if (form.errorText) {
//       it('should have errorText', () => {
//         expect(form.errorText).to.be.a('function');
//       });
//     }
//   });
// });
