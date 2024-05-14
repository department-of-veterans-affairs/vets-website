import { expect } from 'chai';
import {
  toggleDisplayHidden,
  togglePanel,
  updateCurrentSection,
  UPDATE_CURRENT_SECTION,
  TOGGLE_PANEL_OPEN,
  TOGGLE_DISPLAY_HIDDEN,
} from '../../actions';

describe('actions', () => {
  describe('togglePanel', () => {
    it('should dispatch the correct action', () => {
      const megaMenu = { test: 'test' };

      expect(togglePanel(megaMenu)).to.deep.equal({
        type: TOGGLE_PANEL_OPEN,
        megaMenu,
      });
    });
  });

  describe('toggleDisplayHidden', () => {
    it('should dispatch the correct action', () => {
      const display = { hidden: true };

      expect(toggleDisplayHidden(display)).to.deep.equal({
        type: TOGGLE_DISPLAY_HIDDEN,
        display,
      });
    });
  });

  describe('updateCurrentSection', () => {
    it('should dispatch the correct action', () => {
      expect(updateCurrentSection('test')).to.deep.equal({
        type: UPDATE_CURRENT_SECTION,
        currentSection: 'test',
      });
    });
  });
});
