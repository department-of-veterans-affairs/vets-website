import { isTab, setFocus, setPageFocus } from '../../utils/page';

describe('Page utils:', () => {
  describe('isTab', () => {
    it('should detect tab urls', () => {
      expect(isTab('testing/details')).toBe(true);
      expect(isTab('testing/files')).toBe(true);
      expect(isTab('testing/status')).toBe(true);
      expect(isTab('testing/turn-in-evidence')).toBe(false);
    });
  });
  describe('setFocus', () => {
    it('should focus on element', () => {
      const mainDiv = document.createElement('div');
      mainDiv.setAttribute('id', 'main');
      document.body.appendChild(mainDiv);
      setFocus('#main');
      expect(document.activeElement.id).toBe('main');
      expect(mainDiv.tabIndex).toBe(-1);
      document.body.removeChild(mainDiv);
    });
  });
  describe('setPageFocus', () => {
    it('should focus on selector', () => {
      const div = document.createElement('div');
      div.classList.add('testing');
      document.body.appendChild(div);
      setPageFocus('.testing');
      expect(document.activeElement.classList.contains('testing')).toBe(true);
      expect(div.tabIndex).toBe(-1);
      document.body.removeChild(div);
    });
  });
});
