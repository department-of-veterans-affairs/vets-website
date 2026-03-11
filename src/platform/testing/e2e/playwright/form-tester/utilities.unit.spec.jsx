const { expect } = require('chai');
const sinon = require('sinon');

const {
  createArrayPageObjects,
  createTestConfig,
  inProgressMock,
  resolvePageHooks,
  fieldKeyToDataPath,
  setupInProgressReturnUrl,
  makeMinimalPNG,
  makeMinimalJPG,
  makeMinimalPDF,
  makeEncryptedPDF,
  makeMinimalTxtFile,
  makeInvalidUtf8File,
  makeNotAcceptedFile,
} = require('./utilities');

describe('Playwright form-tester utilities', () => {
  describe('createArrayPageObjects', () => {
    it('extracts array pages from chapters', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              page1: { arrayPath: 'dependents', path: '/dependents/:index' },
              page2: { title: 'Not an array page' },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      expect(result).to.have.lengthOf(1);
      expect(result[0].arrayPath).to.equal('dependents');
      expect(result[0].regex).to.be.instanceOf(RegExp);
      expect(result[0].regex.test('/dependents/0')).to.be.true;
      expect(result[0].regex.test('/dependents/42')).to.be.true;
    });

    it('returns empty array when no chapters', () => {
      expect(createArrayPageObjects({})).to.deep.equal([]);
    });

    it('handles multiple array pages across chapters', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              p1: { arrayPath: 'employers', path: '/employers/:index' },
            },
          },
          ch2: {
            pages: {
              p2: { arrayPath: 'children', path: '/children/:index' },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      expect(result).to.have.lengthOf(2);
      expect(result[0].arrayPath).to.equal('employers');
      expect(result[1].arrayPath).to.equal('children');
    });

    it('regex captures the index digit group', () => {
      const formConfig = {
        chapters: {
          ch1: {
            pages: {
              p1: {
                arrayPath: 'items',
                path: '/items/:index/details',
              },
            },
          },
        },
      };

      const result = createArrayPageObjects(formConfig);
      const match = '/items/3/details'.match(result[0].regex);
      expect(match).to.not.be.null;
      expect(match[1]).to.equal('3');
    });
  });

  describe('createTestConfig', () => {
    it('merges manifest, formConfig, and user config', () => {
      const manifest = { appName: 'Test App', rootUrl: '/test' };
      const formConfig = {
        chapters: {
          ch: {
            pages: {
              p: { arrayPath: 'items', path: '/items/:index' },
            },
          },
        },
      };
      const config = { customProp: true };

      const result = createTestConfig(config, manifest, formConfig);
      expect(result.appName).to.equal('Test App');
      expect(result.rootUrl).to.equal('/test');
      expect(result.arrayPages).to.have.lengthOf(1);
      expect(result.customProp).to.be.true;
    });

    it('user config overrides defaults', () => {
      const result = createTestConfig(
        { appName: 'Override' },
        { appName: 'Original', rootUrl: '/test' },
      );
      expect(result.appName).to.equal('Override');
    });
  });

  describe('inProgressMock', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      clock.restore();
    });

    it('returns form data and metadata', () => {
      const result = inProgressMock({
        prefill: { name: 'Test' },
        returnUrl: '/page-2',
        version: 3,
      });

      expect(result.formData).to.deep.equal({ name: 'Test' });
      expect(result.metadata.version).to.equal(3);
      expect(result.metadata.returnUrl).to.equal('/page-2');
      expect(result.metadata.inProgressFormId).to.equal(460);
      expect(result.metadata.submission.status).to.be.false;
    });

    it('defaults to empty prefill', () => {
      const result = inProgressMock();
      expect(result.formData).to.deep.equal({});
    });

    it('sets expiration 30 days from now', () => {
      const result = inProgressMock();
      const now = new Date('2025-01-15T12:00:00Z');
      const thirtyDaysFromNow = Math.floor(
        new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).getTime() / 1000,
      );
      expect(result.metadata.expiresAt).to.equal(thirtyDaysFromNow);
    });
  });

  describe('resolvePageHooks', () => {
    it('resolves relative paths against rootUrl', () => {
      const hooks = { 'page-2': () => {}, 'page-3': () => {} };
      const result = resolvePageHooks(hooks, '/my-form');
      const keys = Object.keys(result);
      expect(keys).to.include('/my-form/page-2');
      expect(keys).to.include('/my-form/page-3');
    });

    it('preserves absolute paths', () => {
      const hooks = { '/absolute/path': () => {} };
      const result = resolvePageHooks(hooks, '/root');
      expect(Object.keys(result)).to.include('/absolute/path');
    });
  });

  describe('fieldKeyToDataPath', () => {
    it('strips root_ prefix and converts underscores to dots', () => {
      expect(fieldKeyToDataPath('root_veteran_fullName_first')).to.equal(
        'veteran.fullName.first',
      );
    });

    it('converts array indices', () => {
      expect(fieldKeyToDataPath('root_employers_0_name')).to.equal(
        'employers[0].name',
      );
    });

    it('handles single field', () => {
      expect(fieldKeyToDataPath('root_ssn')).to.equal('ssn');
    });
  });

  describe('file creators', () => {
    describe('makeMinimalPNG', () => {
      it('returns a Buffer', () => {
        const result = makeMinimalPNG();
        expect(Buffer.isBuffer(result)).to.be.true;
      });

      it('starts with PNG magic bytes', () => {
        const result = makeMinimalPNG();
        // PNG signature: 0x89 0x50 0x4E 0x47
        expect(result[0]).to.equal(0x89);
        expect(result[1]).to.equal(0x50); // P
        expect(result[2]).to.equal(0x4e); // N
        expect(result[3]).to.equal(0x47); // G
      });
    });

    describe('makeMinimalJPG', () => {
      it('returns a Buffer', () => {
        const result = makeMinimalJPG();
        expect(Buffer.isBuffer(result)).to.be.true;
      });

      it('starts with JPEG magic bytes', () => {
        const result = makeMinimalJPG();
        // JPEG signature: 0xFF 0xD8 0xFF
        expect(result[0]).to.equal(0xff);
        expect(result[1]).to.equal(0xd8);
        expect(result[2]).to.equal(0xff);
      });
    });

    describe('makeMinimalPDF', () => {
      it('returns a Buffer', () => {
        const result = makeMinimalPDF();
        expect(Buffer.isBuffer(result)).to.be.true;
      });

      it('starts with PDF header', () => {
        const result = makeMinimalPDF();
        const header = result.subarray(0, 5).toString('ascii');
        expect(header).to.equal('%PDF-');
      });
    });

    describe('makeEncryptedPDF', () => {
      it('returns a Buffer', () => {
        const result = makeEncryptedPDF();
        expect(Buffer.isBuffer(result)).to.be.true;
      });

      it('starts with PDF header', () => {
        const result = makeEncryptedPDF();
        const header = result.subarray(0, 5).toString('ascii');
        expect(header).to.equal('%PDF-');
      });

      it('contains /Encrypt marker', () => {
        const result = makeEncryptedPDF();
        const content = result.toString('ascii');
        expect(content).to.include('/Encrypt');
      });
    });

    describe('makeMinimalTxtFile', () => {
      it('returns a Buffer of default 10 bytes', () => {
        const result = makeMinimalTxtFile();
        expect(Buffer.isBuffer(result)).to.be.true;
        expect(result).to.have.lengthOf(10);
        expect(result.toString()).to.equal('aaaaaaaaaa');
      });

      it('respects custom byte count', () => {
        const result = makeMinimalTxtFile(5);
        expect(result).to.have.lengthOf(5);
      });
    });

    describe('makeInvalidUtf8File', () => {
      it('returns a Buffer with invalid UTF-8 bytes', () => {
        const result = makeInvalidUtf8File();
        expect(Buffer.isBuffer(result)).to.be.true;
        expect(result[0]).to.equal(0xff);
        expect(result[1]).to.equal(0xfe);
        expect(result[2]).to.equal(0xfd);
      });

      it('has 12 bytes', () => {
        expect(makeInvalidUtf8File()).to.have.lengthOf(12);
      });
    });

    describe('makeNotAcceptedFile', () => {
      it('returns a Buffer with content "test"', () => {
        const result = makeNotAcceptedFile();
        expect(Buffer.isBuffer(result)).to.be.true;
        expect(result.toString()).to.equal('test');
      });
    });
  });

  describe('setupInProgressReturnUrl', () => {
    it('throws when formId is missing', async () => {
      const page = { route: sinon.stub() };
      try {
        await setupInProgressReturnUrl(page, { formConfig: {} });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.include('formId is required');
      }
    });

    it('registers /v0/user and /v0/in_progress_forms routes', async () => {
      const routeArgs = [];
      const page = {
        route: sinon.stub().callsFake((pattern, _handler) => {
          routeArgs.push(pattern);
          return Promise.resolve();
        }),
      };
      const loginFn = sinon.stub().resolves();

      await setupInProgressReturnUrl(page, {
        formConfig: { formId: '21-0781', version: 2 },
        returnUrl: '/step-2',
        prefill: { name: 'Test' },
        loginFn,
      });

      expect(routeArgs).to.include('**/v0/user');
      expect(routeArgs).to.include('**/v0/in_progress_forms/21-0781');
    });

    it('calls loginFn with page and merged userData', async () => {
      const page = { route: sinon.stub().resolves() };
      const loginFn = sinon.stub().resolves();

      await setupInProgressReturnUrl(page, {
        formConfig: { formId: '10-10EZ' },
        user: { data: { attributes: { firstName: 'Jane' } } },
        loginFn,
      });

      expect(loginFn.calledOnce).to.be.true;
      const [, userData] = loginFn.firstCall.args;
      expect(userData.data.attributes.firstName).to.equal('Jane');
      expect(userData.data.attributes.inProgressForms).to.be.an('array');
      expect(userData.data.attributes.inProgressForms[0].form).to.equal(
        '10-10EZ',
      );
    });

    it('builds userData structure when user is empty', async () => {
      const page = { route: sinon.stub().resolves() };
      const loginFn = sinon.stub().resolves();

      await setupInProgressReturnUrl(page, {
        formConfig: { formId: '21-686c' },
        loginFn,
      });

      const [, userData] = loginFn.firstCall.args;
      expect(userData.data.attributes.inProgressForms).to.have.lengthOf(1);
    });

    it('includes returnUrl and prefill in SIP mock', async () => {
      const page = { route: sinon.stub().resolves() };
      const loginFn = sinon.stub().resolves();

      await setupInProgressReturnUrl(page, {
        formConfig: { formId: '10-10EZ', version: 1 },
        returnUrl: '/personal-info',
        prefill: { ssn: '123456789' },
        loginFn,
      });

      // The SIP route handler was registered — verify via route call
      expect(page.route.calledTwice).to.be.true;

      // Verify the /v0/in_progress_forms route handler fulfills correctly
      const sipCall = page.route
        .getCalls()
        .find(c => c.args[0] === '**/v0/in_progress_forms/10-10EZ');
      expect(sipCall).to.exist;

      // Simulate calling the route handler to verify response shape
      const mockRoute = {
        fulfill: sinon.stub(),
      };
      await sipCall.args[1](mockRoute);
      const { json } = mockRoute.fulfill.firstCall.args[0];
      expect(json.formData).to.deep.equal({ ssn: '123456789' });
      expect(json.metadata.returnUrl).to.equal('/personal-info');
      expect(json.metadata.version).to.equal(1);
    });
  });
});
