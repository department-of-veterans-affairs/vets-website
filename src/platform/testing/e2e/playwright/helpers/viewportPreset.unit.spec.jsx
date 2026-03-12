const { expect } = require('chai');
const sinon = require('sinon');

const { presets, setViewportPreset } = require('./viewportPreset');

describe('Playwright viewportPreset helpers', () => {
  describe('presets', () => {
    const expectedPresets = [
      'va-top-mobile-1',
      'va-top-mobile-2',
      'va-top-mobile-3',
      'va-top-mobile-4',
      'va-top-mobile-5',
      'va-top-tablet-1',
      'va-top-tablet-2',
      'va-top-tablet-3',
      'va-top-tablet-4',
      'va-top-tablet-5',
      'va-top-desktop-1',
      'va-top-desktop-2',
      'va-top-desktop-3',
      'va-top-desktop-4',
      'va-top-desktop-5',
    ];

    it('has all 15 presets', () => {
      expect(Object.keys(presets)).to.have.lengthOf(15);
    });

    expectedPresets.forEach(name => {
      it(`includes ${name} with width and height`, () => {
        expect(presets[name])
          .to.have.property('width')
          .that.is.a('number');
        expect(presets[name])
          .to.have.property('height')
          .that.is.a('number');
      });
    });

    it('matches Cypress preset dimensions', () => {
      // Spot-check key dimensions from Cypress viewportPreset.js
      expect(presets['va-top-mobile-1']).to.deep.equal({
        width: 390,
        height: 844,
      });
      expect(presets['va-top-tablet-1']).to.deep.equal({
        width: 768,
        height: 1024,
      });
      expect(presets['va-top-desktop-1']).to.deep.equal({
        width: 1920,
        height: 1080,
      });
    });
  });

  describe('setViewportPreset', () => {
    let mockPage;

    beforeEach(() => {
      mockPage = {
        setViewportSize: sinon.stub().resolves(),
      };
    });

    it('sets viewport in portrait orientation by default', async () => {
      await setViewportPreset(mockPage, 'va-top-mobile-1');

      expect(mockPage.setViewportSize.calledOnce).to.be.true;
      expect(mockPage.setViewportSize.calledWith({ width: 390, height: 844 }))
        .to.be.true;
    });

    it('swaps width and height for landscape orientation', async () => {
      await setViewportPreset(mockPage, 'va-top-mobile-1', 'landscape');

      expect(mockPage.setViewportSize.calledOnce).to.be.true;
      expect(mockPage.setViewportSize.calledWith({ width: 844, height: 390 }))
        .to.be.true;
    });

    it('throws for unknown preset', async () => {
      try {
        await setViewportPreset(mockPage, 'nonexistent-preset');
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e.message).to.include('Unknown viewport preset');
        expect(e.message).to.include('nonexistent-preset');
      }
    });

    it('lists valid presets in error message', async () => {
      try {
        await setViewportPreset(mockPage, 'bad');
        expect.fail('Should have thrown');
      } catch (e) {
        expect(e.message).to.include('va-top-mobile-1');
        expect(e.message).to.include('va-top-desktop-5');
      }
    });
  });
});
