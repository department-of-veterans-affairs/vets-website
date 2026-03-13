import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import {
  fetchRelevantArtifacts,
  processDocument,
  processDocumentWithAutoResolve,
} from '../../../cave/workflow';

// Fast polling options so tests don't wait
const FAST = { intervalMs: 0, timeoutMs: 30000 };

describe('cave/workflow', () => {
  let sandbox;
  let apiRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(api, 'apiRequest');
  });

  afterEach(() => {
    sandbox.restore();
  });

  // ---------------------------------------------------------------------------
  // fetchRelevantArtifacts
  // ---------------------------------------------------------------------------

  describe('fetchRelevantArtifacts', () => {
    it('fetches the artifact summary and downloads each DD214 form', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({
          forms: [{ artifactType: 'DD214', mmsArtifactValidationId: 'kvp-1' }],
        })
        .onSecondCall()
        .resolves({ VETERAN_NAME: 'John Smith' });

      const result = await fetchRelevantArtifacts('doc-1');
      expect(result.dd214).to.have.length(1);
      expect(result.deathCertificates).to.have.length(0);
    });

    it('fetches DEATH artifact forms into deathCertificates', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({
          forms: [{ artifactType: 'death', mmsArtifactValidationId: 'kvp-2' }],
        })
        .onSecondCall()
        .resolves({ DECENDENT_FULL_NAME: 'Pat Veteran' });

      const result = await fetchRelevantArtifacts('doc-1');
      expect(result.dd214).to.have.length(0);
      expect(result.deathCertificates).to.have.length(1);
    });

    it('handles multiple forms of both types', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({
          forms: [
            { artifactType: 'DD214', mmsArtifactValidationId: 'kvp-1' },
            { artifactType: 'DD214', mmsArtifactValidationId: 'kvp-2' },
            { artifactType: 'death', mmsArtifactValidationId: 'kvp-3' },
          ],
        })
        .resolves({}); // subsequent download calls

      const result = await fetchRelevantArtifacts('doc-1');
      expect(result.dd214).to.have.length(2);
      expect(result.deathCertificates).to.have.length(1);
    });

    it('filters out null download results', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({
          forms: [{ artifactType: 'DD214', mmsArtifactValidationId: 'kvp-1' }],
        })
        .onSecondCall()
        .resolves(null);

      const result = await fetchRelevantArtifacts('doc-1');
      expect(result.dd214).to.have.length(0);
    });

    it('returns empty arrays when summary has no forms', async () => {
      apiRequestStub.resolves({ forms: [] });
      const result = await fetchRelevantArtifacts('doc-1');
      expect(result.dd214).to.deep.equal([]);
      expect(result.deathCertificates).to.deep.equal([]);
    });

    it('is case-insensitive for artifact type matching', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({
          forms: [{ artifactType: 'dd214', mmsArtifactValidationId: 'kvp-1' }],
        })
        .onSecondCall()
        .resolves({ VETERAN_NAME: 'John Smith' });

      const result = await fetchRelevantArtifacts('doc-1');
      expect(result.dd214).to.have.length(1);
    });
  });

  // ---------------------------------------------------------------------------
  // processDocument
  // ---------------------------------------------------------------------------

  describe('processDocument', () => {
    it('throws when contract has no id', async () => {
      let error;
      try {
        await processDocument({});
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.include('missing document id');
    });

    it('throws when contract is null', async () => {
      let error;
      try {
        await processDocument(null);
      } catch (e) {
        error = e;
      }
      expect(error).to.be.instanceOf(Error);
    });

    it('throws when document status is not "completed"', async () => {
      apiRequestStub.resolves({ scanStatus: 'failed' });
      let error;
      try {
        await processDocument({ id: 'doc-1' }, FAST);
      } catch (e) {
        error = e;
      }
      expect(error.message).to.include('did not complete successfully');
    });

    it('returns normalized sections on success', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({ scanStatus: 'completed' }) // pollDocumentStatus
        .onSecondCall()
        .resolves({ forms: [] }); // fetchArtifactSummary

      const result = await processDocument({ id: 'doc-1' }, FAST);
      expect(result).to.have.property('dd214');
      expect(result).to.have.property('deathCertificates');
      expect(result.dd214).to.deep.equal([]);
    });

    it('normalizes DD214 data in the returned sections', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({ scanStatus: 'completed' })
        .onSecondCall()
        .resolves({
          forms: [{ artifactType: 'DD214', mmsArtifactValidationId: 'kvp-1' }],
        })
        .onThirdCall()
        .resolves({
          VETERAN_NAME: 'John Q Smith',
          BRANCH_OF_SERVICE: 'Army',
          VETERAN_DOB: '03/15/1950',
        });

      const result = await processDocument({ id: 'doc-1' }, FAST);
      const entry = result.dd214[0];
      expect(entry.VETERAN_NAME).to.deep.equal({
        first: 'John',
        middle: 'Q',
        last: 'Smith',
        suffix: '',
      });
      expect(entry.BRANCH_OF_SERVICE).to.equal('army');
      expect(entry.VETERAN_DOB).to.equal('1950-03-15');
    });
  });

  // ---------------------------------------------------------------------------
  // processDocumentWithAutoResolve
  // ---------------------------------------------------------------------------

  describe('processDocumentWithAutoResolve', () => {
    it('returns idpArtifacts for the new file', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({ scanStatus: 'completed' })
        .onSecondCall()
        .resolves({ forms: [] });

      const result = await processDocumentWithAutoResolve(
        { id: 'doc-1' },
        {},
        [],
        FAST,
      );
      expect(result).to.have.property('dd214');
      expect(result).to.have.property('deathCertificates');
    });

    it('auto-fills null artifact fields from form data', async () => {
      apiRequestStub
        .onFirstCall()
        .resolves({ scanStatus: 'completed' })
        .onSecondCall()
        .resolves({
          forms: [{ artifactType: 'DD214', mmsArtifactValidationId: 'kvp-1' }],
        })
        .onThirdCall()
        .resolves({
          VETERAN_NAME: null,
          VETERAN_SSN: null,
          BRANCH_OF_SERVICE: null,
          DATE_ENTERED_ACTIVE_SERVICE: null,
          DATE_SEPARATED_FROM_SERVICE: null,
          VETERAN_DOB: null,
        });

      const formData = {
        serviceBranch: 'navy',
        activeServiceDateRange: { from: '1970-02-15', to: '1974-02-14' },
      };

      const result = await processDocumentWithAutoResolve(
        { id: 'doc-1' },
        formData,
        [],
        FAST,
      );
      // BRANCH_OF_SERVICE was null → should be filled from form's serviceBranch
      expect(result.dd214[0].BRANCH_OF_SERVICE).to.equal('navy');
    });
  });
});
