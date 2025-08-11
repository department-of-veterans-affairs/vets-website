import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  deleteToxicExposureModalTitle,
  deleteToxicExposureModalDescription,
  deleteToxicExposureModalContent,
  deletedToxicExposureAlertConfirmationContent,
} from '../../content/toxicExposureChoiceContent';

describe('Toxic Exposure Choice Content', () => {
  describe('Modal content', () => {
    it('should have correct modal title', () => {
      expect(deleteToxicExposureModalTitle).to.equal(
        'Remove condition related to toxic exposure?',
      );
    });

    it('should have correct modal description', () => {
      expect(deleteToxicExposureModalDescription).to.equal(
        "If you choose to remove flat feet as a condition related to toxic exposure, we'll delete information about:",
      );
    });

    it('should render modal content with correct sections', () => {
      const { container } = render(deleteToxicExposureModalContent);

      // Check that all expected sections are listed
      expect(container.textContent).to.contain(
        'Gulf War service locations and dates (1990 and 2001)',
      );
      expect(container.textContent).to.contain(
        'Agent Orange exposure locations and dates',
      );
      expect(container.textContent).to.contain(
        'Other toxic exposure details and dates',
      );

      // Verify it's a list structure
      expect(container.querySelector('ul')).to.exist;
      expect(container.querySelectorAll('li')).to.have.length(3);
      expect(container.querySelectorAll('strong')).to.have.length(0);
    });
  });

  describe('Alert confirmation content', () => {
    it('should render confirmation alert with correct content', () => {
      const { container } = render(
        deletedToxicExposureAlertConfirmationContent,
      );

      // Get text content from each paragraph separately
      const paragraphs = container.querySelectorAll('p');

      // Use a simpler text matching approach
      const text1 = paragraphs[0].textContent.trim();
      const text2 = paragraphs[1].textContent.trim();

      expect(text1).to.include(
        'removed toxic exposure conditions from your claim',
      );
      expect(text2).to.include(
        'Review your conditions and supporting documents to remove any information',
      );

      // Check styling
      expect(paragraphs).to.have.length(2);
      expect(paragraphs[0]).to.have.class('vads-u-margin-y--0');
      expect(paragraphs[1]).to.have.class('vads-u-margin-y--0');
    });
  });
});
