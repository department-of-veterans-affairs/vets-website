import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import { registerFonts, knownFonts } from '../registerFonts';

describe('registerFonts', () => {
  let doc;
  let fetchStub;
  let existsSyncStub;
  let writeFileSyncStub;

  beforeEach(() => {
    doc = { registerFont: sinon.stub() };
    fetchStub = sinon.stub(global, 'fetch');
    existsSyncStub = sinon.stub(fs, 'existsSync').throws(new Error('ENOENT'));
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
  });

  afterEach(() => {
    fetchStub.restore();
    existsSyncStub.restore();
    writeFileSyncStub.restore();
  });

  describe('knownFonts', () => {
    it('contains expected font entries', () => {
      expect(knownFonts).to.have.property('Bitter-Bold');
      expect(knownFonts).to.have.property('SourceSansPro-Regular');
      expect(knownFonts).to.have.property('RobotoMono-Regular');
    });
  });

  describe('registerFonts', () => {
    it('skips unknown fonts', async () => {
      await registerFonts(doc, ['NonExistentFont']);
      expect(doc.registerFont.called).to.be.false;
      expect(fetchStub.called).to.be.false;
    });
  });

  describe('downloadAndRegisterFont error context', () => {
    it('includes font name and URL when fetch rejects', async () => {
      const originalError = new Error('Failed to fetch');
      fetchStub.rejects(originalError);

      try {
        await registerFonts(doc, ['Bitter-Bold']);
        expect.fail('should have thrown');
      } catch (error) {
        expect(error.message).to.include(
          'Failed to download or register font Bitter-Bold',
        );
        expect(error.message).to.include('/generated/bitter-bold.ttf');
        expect(error.message).to.include('Failed to fetch');
        expect(error.cause).to.equal(originalError);
      }
    });

    it('includes font name and URL when arrayBuffer fails', async () => {
      const originalError = new Error('body stream error');
      fetchStub.resolves({
        arrayBuffer: sinon.stub().rejects(originalError),
      });

      try {
        await registerFonts(doc, ['SourceSansPro-Regular']);
        expect.fail('should have thrown');
      } catch (error) {
        expect(error.message).to.include(
          'Failed to download or register font SourceSansPro-Regular',
        );
        expect(error.message).to.include(
          '/generated/sourcesanspro-regular-webfont.ttf',
        );
        expect(error.message).to.include('body stream error');
        expect(error.cause).to.equal(originalError);
      }
    });

    it('downloads and registers font on success', async () => {
      const fakeBuffer = new ArrayBuffer(8);
      fetchStub.resolves({
        arrayBuffer: sinon.stub().resolves(fakeBuffer),
      });

      await registerFonts(doc, ['Bitter-Bold']);
      expect(doc.registerFont.calledOnce).to.be.true;
      expect(doc.registerFont.firstCall.args[0]).to.equal('Bitter-Bold');
    });
  });
});
