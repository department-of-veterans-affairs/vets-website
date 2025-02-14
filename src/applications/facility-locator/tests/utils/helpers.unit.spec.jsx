import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { buildMarker } from '../../utils/helpers';

describe('utils', () => {
  describe('buildMarker', () => {
    it('should correctly build the marker element for the current position', () => {
      const marker = buildMarker('currentPos', null, null, true);

      expect(marker).to.be.an.instanceOf(HTMLElement);
      expect(marker.tagName).to.equal('DIV');
      expect(marker.className).to.equal('current-pos-pin');
    });

    it('should correctly build the marker element for a location', () => {
      const loc = {
        id: 0,
        distance: 12.8749483,
        attributes: {
          facilityType: 'vet_center',
        },
      };

      const pinSpy = sinon.spy();
      const values = {
        attrs: {
          letter: 2,
        },
        loc,
      };

      const marker = buildMarker('location', values, pinSpy, true);

      expect(marker).to.be.an.instanceOf(HTMLElement);
      expect(marker.tagName).to.equal('SPAN');
      expect(marker.className).to.equal('i-pin-card-map pin-2');
      expect(marker.style.cursor).to.equal('pointer');
      expect(marker.textContent).to.equal('2');

      fireEvent.click(marker);
      expect(pinSpy.getCall(0).args[0]).to.deep.equal({
        ...loc,
        attributes: {
          ...loc.attributes,
          distance: loc.distance,
        },
        markerText: 2,
      });
    });
  });
});
