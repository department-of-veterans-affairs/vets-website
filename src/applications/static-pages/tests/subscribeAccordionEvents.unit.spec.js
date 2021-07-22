import { expect } from 'chai';
import { getSectionLabel } from '../subscribeAccordionEvents';

describe('subscribeAccordionEvents', () => {
  describe('getSectionLabel', () => {
    it('should return the data-label for the given node if it is a section', () => {
      const testNode = {
        nodeName: 'section',
        tagName: 'section',
        dataset: {
          label: 'Test Label',
        },
      };

      expect(getSectionLabel(testNode)).to.equal('Test Label');
    });

    it('should return the data-label for the most immediate parent', () => {
      const testNode = {
        nodeName: 'button',
        tagName: 'button',
        parentNode: {
          nodeName: 'button',
          tagName: 'button',
          parentNode: {
            nodeName: 'section',
            tagName: 'section',
            dataset: { label: 'Parent Label' },
          },
        },
        dataset: { label: 'Child Label' },
      };

      expect(getSectionLabel(testNode)).to.equal('Parent Label');
    });
  });
});
