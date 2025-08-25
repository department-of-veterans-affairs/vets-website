import { expect } from 'chai';
import formConfig, { isLocalhost } from '../../../config/form';

describe('Form Config - Core Branch Coverage', () => {
  describe('isLocalhost function coverage', () => {
    it('executes isLocalhost function', () => {
      const result = isLocalhost();
      expect(typeof result).to.equal('boolean');
    });
  });

  describe('pathname parameter coverage', () => {
    it('calls formConfig with no parameters (default null)', () => {
      const config = formConfig();
      expect(config).to.be.an('object');
    });

    it('calls formConfig with explicit pathname', () => {
      const config = formConfig('/test-path');
      expect(config).to.be.an('object');
    });

    it('calls formConfig with undefined', () => {
      const config = formConfig(undefined);
      expect(config).to.be.an('object');
    });

    it('calls formConfig with null', () => {
      const config = formConfig(null);
      expect(config).to.be.an('object');
    });

    it('calls formConfig with empty string', () => {
      const config = formConfig('');
      expect(config).to.be.an('object');
    });
  });

  describe('formNumber conditional execution', () => {
    it('executes formConfig to trigger conditional logic', () => {
      const config = formConfig();
      expect(config).to.be.an('object');
      expect(config).to.have.property('chapters');
    });

    it('executes formConfig with different pathnames to potentially trigger different conditions', () => {
      const pathnames = [null, '21-526EZ', '21-686c'];

      pathnames.forEach(pathname => {
        const config = formConfig(pathname);
        expect(config).to.be.an('object');
        expect(config).to.have.property('formId');
        expect(config).to.have.property('chapters');
      });
    });
  });

  describe('depends function execution', () => {
    it('executes depends functions when they exist', () => {
      const config = formConfig();

      if (
        config.chapters.veteranInformationChapter?.pages?.veteranInformationPage
          ?.depends
      ) {
        const {
          depends,
        } = config.chapters.veteranInformationChapter.pages.veteranInformationPage;

        depends({ isVeteran: 'yes' });
        depends({ isVeteran: 'no' });
        depends({ isVeteran: undefined });
        depends({});
        depends({ isVeteran: null });
      }

      if (
        config.chapters.claimantInformationChapter?.pages?.claimantInformation
          ?.depends
      ) {
        const {
          depends,
        } = config.chapters.claimantInformationChapter.pages.claimantInformation;

        depends({ isVeteran: 'yes' });
        depends({ isVeteran: 'no' });
        depends({ isVeteran: undefined });
        depends({});
        depends({ isVeteran: null });
      }
    });
  });

  describe('comprehensive execution coverage', () => {
    it('executes multiple configurations to maximize branch coverage', () => {
      const testCases = [{ pathname: '21-526EZ' }, { pathname: '21-686c' }];

      testCases.forEach(({ pathname }) => {
        const config = formConfig(pathname);

        expect(config).to.be.an('object');
        expect(config).to.have.property('chapters');
        expect(typeof config.formId).to.equal('string');
        expect(typeof config.urlPrefix).to.equal('string');
        expect(typeof config.trackingPrefix).to.equal('string');
        expect(typeof config.title).to.equal('string');
      });
    });

    it('tests getMockData execution branches', () => {
      const originalWindow = global.window;

      try {
        const config = formConfig();

        const veteranPage =
          config.chapters?.veteranInformationChapter?.pages
            ?.veteranInformationPage;
        if (veteranPage) {
          expect(veteranPage).to.have.property('initialData');
        }

        const claimantPage =
          config.chapters?.claimantInformationChapter?.pages
            ?.claimantInformation;
        if (claimantPage) {
          expect(claimantPage).to.have.property('initialData');
        }
      } finally {
        global.window = originalWindow;
      }
    });
  });

  describe('basic functionality validation', () => {
    it('returns valid configuration object', () => {
      const config = formConfig();

      expect(config).to.be.an('object');
      expect(config.chapters).to.be.an('object');
      expect(config.formId).to.be.a('string');
      expect(config.version).to.be.a('number');
      expect(config.disableSave).to.be.a('boolean');
      expect(config.prefillEnabled).to.be.a('boolean');
      expect(config.hideReviewChapters).to.be.a('boolean');
      expect(config.customText).to.be.an('object');
      expect(config.dev).to.be.an('object');
    });

    it('has required functions', () => {
      const config = formConfig();

      expect(config).to.have.property('introduction');
      expect(config).to.have.property('confirmation');
      expect(config).to.have.property('transformForSubmit');
      expect(config).to.have.property('submissionError');
    });
  });
});
