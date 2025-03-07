import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  clockIcon,
  getFileSize,
  setFocus,
  starIcon,
  successIcon,
} from '../../utils/helpers';

describe('Utility Functions', () => {
  describe('getFileSize', () => {
    it('should return file size in bytes', () => {
      expect(getFileSize(500)).to.equal('500 B');
    });

    it('should return file size in kilobytes', () => {
      expect(getFileSize(1500)).to.equal('1 KB');
    });

    it('should return file size in megabytes', () => {
      expect(getFileSize(1500000)).to.equal('1.5 MB');
    });
  });

  describe('setFocus', () => {
    it('should set focus on an element with a given selector', () => {
      const element = document.createElement('div');
      element.setAttribute('id', 'test-element');
      document.body.appendChild(element);

      setFocus('#test-element');
      expect(document.activeElement).to.equal(element);
    });

    it('should add tabIndex and set focus on an element', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      setFocus(element, true);
      expect(element.getAttribute('tabIndex')).to.equal('-1');
      expect(document.activeElement).to.equal(element);
    });
  });

  describe('Icons', () => {
    it('should render successIcon correctly', () => {
      const { container } = render(successIcon);
      expect(container.querySelector('.vads-u-color--green')).to.exist;
      expect(container.querySelector('va-icon[icon="check_circle"]')).to.exist;
    });

    it('should render newIcon correctly', () => {
      const { container } = render(starIcon);
      expect(container.querySelector('.vads-u-color--primary')).to.exist;
      expect(container.querySelector('va-icon[icon="star"]')).to.exist;
    });

    it('should render inProgressOrReopenedIcon correctly', () => {
      const { container } = render(clockIcon);
      expect(container.querySelector('.vads-u-color--grey')).to.exist;
      expect(container.querySelector('va-icon[icon="schedule"]')).to.exist;
    });
  });
});
