import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch } from 'platform/testing/unit/helpers';
import * as SubmitModule from '../../config/submit';
import * as SubmitHelpers from '../../config/submit-helpers';

describe('Income and asset submit', () => {
  describe('submit', () => {
    const mockFormConfig = {
      formId: '21P-0969',
      trackingPrefix: '21p-0969',
    };

    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });

    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const form = {
        data: {},
      };

      return SubmitModule.submit(form, mockFormConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });

    afterEach(() => {
      delete window.URL;
    });
  });

  describe('transform', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy(SubmitHelpers, 'remapOtherVeteranFields');
    });

    afterEach(() => {
      spy.restore();
    });
    describe('remap `otherVeteran` fields', () => {
      it('calls remapOtherVeteranFields when not logged in', () => {
        const form = {
          data: {
            isLoggedIn: false,
          },
        };

        SubmitModule.transform(form);
        expect(spy.calledOnce).to.be.true;
      });

      it('calls remapOtherVeteranFields when isLoggedIn is undefined', () => {
        const form = {
          data: {},
        };

        SubmitModule.transform(form);
        expect(spy.calledOnce).to.be.true;
      });

      it('calls remapOtherVeteranFields when logged in and claimantType is not VETERAN', () => {
        const form = {
          data: {
            isLoggedIn: true,
            claimantType: 'SPOUSE',
          },
        };

        SubmitModule.transform(form);
        expect(spy.calledOnce).to.be.true;
      });

      it('does not call remapOtherVeteranFields when logged in and claimantType is VETERAN', () => {
        const form = {
          data: {
            isLoggedIn: true,
            claimantType: 'VETERAN',
          },
        };

        SubmitModule.transform(form);
        expect(spy.called).to.be.false;
      });
    });
  });

  describe('prepareFormData', () => {
    it('collects all submitted documents into the files array', () => {
      const inputData = {
        trusts: [
          {
            uploadedDocuments: [
              { name: 'trust1.pdf', confirmationCode: 'code1' },
              { name: 'trust2.pdf', confirmationCode: 'code2' },
            ],
          },
        ],
        ownedAssets: [
          {
            uploadedDocuments: {
              name: 'asset1.pdf',
              confirmationCode: 'code3',
            },
          },
        ],
        files: [{ name: 'existing.pdf', confirmationCode: 'code0' }],
      };

      const preparedData = SubmitModule.prepareFormData(inputData);
      const fileNames = preparedData.files.map(f => f.name);

      expect(fileNames.length).to.equal(4);
      expect(fileNames).to.include.members([
        'existing.pdf',
        'trust1.pdf',
        'trust2.pdf',
        'asset1.pdf',
      ]);
    });

    it('handles empty uploadedDocuments fields gracefully', () => {
      const inputData = {
        trusts: [
          {
            otherField: 'no files here',
          },
          {
            uploadedDocuments: [], // Not required, but should be handled gracefully
          },
          {
            uploadedDocuments: [
              { name: 'trust1.pdf', confirmationCode: 'code1' },
              { name: 'trust2.pdf', confirmationCode: 'code2' },
            ],
          },
        ],
        ownedAssets: [
          {
            otherField: 'still no files', // no uploadedDocuments field
          },
          {
            uploadedDocuments: [], // This is the behavior we see with the forms system
          },
          {
            uploadedDocuments: {
              name: 'asset1.pdf',
              confirmationCode: 'code3',
            },
          },
        ],
        files: [{ name: 'existing.pdf', confirmationCode: 'code0' }],
      };

      const preparedData = SubmitModule.prepareFormData(inputData);
      const fileNames = preparedData.files.map(f => f.name);

      expect(fileNames.length).to.equal(4);
      expect(fileNames).to.include.members([
        'existing.pdf',
        'trust1.pdf',
        'trust2.pdf',
        'asset1.pdf',
      ]);
    });
  });

  describe('submission pipeline ordering', () => {
    it('passes the output of prepareFormData into serializePreparedFormData', () => {
      const inputForm = { data: { foo: 'bar' } };

      // Expected behavior of prepareFormData
      const prepared = SubmitModule.prepareFormData(inputForm.data);

      // Expected behavior of serializePreparedFormData
      const serialized = SubmitModule.serializePreparedFormData(prepared);

      const wrappedOutput = SubmitModule.transform(inputForm);
      const parsed = JSON.parse(wrappedOutput);

      // Ensure the serialized output is exactly what transform() placed in the envelope
      expect(parsed.incomeAndAssetsClaim.form).to.equal(serialized);
    });

    it('outputs an envelope containing serialized "form" string', () => {
      const form = { data: { hello: 'world' } };

      const result = SubmitModule.transform(form);
      const parsed = JSON.parse(result);

      expect(parsed).to.have.property('incomeAndAssetsClaim');
      expect(parsed.incomeAndAssetsClaim).to.have.property('form');

      // Should be a JSON string
      expect(typeof parsed.incomeAndAssetsClaim.form).to.equal('string');
    });

    it('applies replacer and produces predictable final JSON', () => {
      const form = { data: { sample: 'value' } };

      const result = SubmitModule.transform(form);
      const parsed = JSON.parse(result);

      const expectedPrepared = SubmitModule.prepareFormData(form.data);
      const expectedSerialized = SubmitModule.serializePreparedFormData(
        expectedPrepared,
      );

      expect(parsed.incomeAndAssetsClaim.form).to.equal(expectedSerialized);
    });
  });
});
