import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import {
  fetchArtifactSummary,
  downloadArtifactData,
} from '../../../cave/artifacts';

describe('cave/artifacts', () => {
  let sandbox;
  let apiRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(api, 'apiRequest');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchArtifactSummary', () => {
    it('calls the output URL with type=artifact', async () => {
      apiRequestStub.resolves({ forms: [] });
      await fetchArtifactSummary('doc-123');
      const calledUrl = apiRequestStub.firstCall.args[0];
      expect(calledUrl).to.include('doc-123');
      expect(calledUrl).to.include('/output');
      expect(calledUrl).to.include('type=artifact');
    });

    it('returns the api response', async () => {
      const response = { forms: [{ artifactType: 'DD214' }] };
      apiRequestStub.resolves(response);
      const result = await fetchArtifactSummary('doc-123');
      expect(result).to.deep.equal(response);
    });
  });

  describe('downloadArtifactData', () => {
    it('calls the download URL with the correct kvpid', async () => {
      apiRequestStub.resolves({ VETERAN_NAME: 'John Smith' });
      await downloadArtifactData('doc-123', 'kvp-456');
      const calledUrl = apiRequestStub.firstCall.args[0];
      expect(calledUrl).to.include('doc-123');
      expect(calledUrl).to.include('/download');
      expect(calledUrl).to.include('kvpid=kvp-456');
    });

    it('passes the X-Key-Inflection: snake header', async () => {
      apiRequestStub.resolves({});
      await downloadArtifactData('doc-123', 'kvp-456');
      const options = apiRequestStub.firstCall.args[1];
      expect(options.headers['X-Key-Inflection']).to.equal('snake');
    });

    it('returns the api response', async () => {
      const response = { VETERAN_NAME: 'John Smith', VETERAN_SSN: '123456789' };
      apiRequestStub.resolves(response);
      const result = await downloadArtifactData('doc-123', 'kvp-456');
      expect(result).to.deep.equal(response);
    });
  });
});
