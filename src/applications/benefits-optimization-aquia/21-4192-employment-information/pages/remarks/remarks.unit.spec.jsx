/**
 * @module tests/pages/remarks.unit.spec
 * @description Unit tests for RemarksPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { RemarksPage } from './remarks';

describe('RemarksPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Remarks');
    });

    it('should render remarks textarea field', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-textarea[label="Remarks"]')).to.exist;
    });

    it('should render continue button', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });

    it('should render back button', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display Star Trek mission remarks', () => {
      const data = {
        remarks: {
          remarks:
            'Captain Kirk was instrumental in the successful completion of the five-year mission to explore strange new worlds.',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea).to.exist;
      expect(textarea.getAttribute('value')).to.include('Captain Kirk');
      expect(textarea.getAttribute('value')).to.include('five-year mission');
    });

    it('should display Vulcan philosophy remarks', () => {
      const data = {
        remarks: {
          remarks:
            'The needs of the many outweigh the needs of the few. - Spock',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('value')).to.include('needs of the many');
    });

    it('should display empty remarks', () => {
      const data = {
        remarks: {
          remarks: '',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('value')).to.equal('');
    });

    it('should handle missing remarks data', () => {
      const data = {
        remarks: {},
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Data Handling Edge Cases', () => {
    it('should handle null data prop', () => {
      const { container } = render(
        <RemarksPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-textarea')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <RemarksPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-textarea')).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <RemarksPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-textarea')).to.exist;
    });

    it('should handle empty data object', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-textarea')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        remarks: {
          remarks: 'To boldly go where no one has gone before.',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });

    it('should show update button in review mode', () => {
      const data = {
        remarks: {
          remarks: 'Live long and prosper.',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const updateButton = container.querySelector('va-button[text="Save"]');
      expect(updateButton).to.exist;
    });
  });

  describe('Field Constraints', () => {
    it('should set rows for textarea', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('rows')).to.equal('8');
    });

    it('should set maxlength for textarea', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('maxlength')).to.equal('2000');
    });

    it('should not mark remarks as required', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.hasAttribute('required')).to.be.false;
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(<RemarksPage goForward={mockGoForward} />);

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        remarks: {
          remarks: 'Make it so.',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Long Remarks Content', () => {
    it('should display long remarks within character limit', () => {
      const longRemark = 'A'.repeat(2000);
      const data = {
        remarks: {
          remarks: longRemark,
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('value')).to.have.lengthOf(2000);
    });

    it('should display multiline remarks', () => {
      const data = {
        remarks: {
          remarks:
            'Space: the final frontier.\nThese are the voyages of the starship Enterprise.\nIts continuing mission: to explore strange new worlds.',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('value')).to.include(
        'Space: the final frontier',
      );
    });
  });

  describe('Star Trek Themed Remarks', () => {
    it('should display Prime Directive remark', () => {
      const data = {
        remarks: {
          remarks:
            'Adhered to Starfleet General Order 1 (Prime Directive) throughout the mission, respecting the natural development of pre-warp civilizations.',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('value')).to.include('Prime Directive');
    });

    it('should display commendation remark', () => {
      const data = {
        remarks: {
          remarks:
            'Officer demonstrated exceptional leadership during first contact with the Horta species, resolving conflict through understanding and diplomacy.',
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('value')).to.include(
        'exceptional leadership',
      );
    });

    it('should display medical remarks', () => {
      const data = {
        remarks: {
          remarks:
            "Treated for Vulcan nerve pinch recovery. Note: Patient is human and remarkably resilient. - Dr. Leonard 'Bones' McCoy",
        },
      };

      const { container } = render(
        <RemarksPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const textarea = container.querySelector('va-textarea[label="Remarks"]');
      expect(textarea.getAttribute('value')).to.include('Dr. Leonard');
    });
  });

  describe('Heading Structure', () => {
    it('should have h3 heading for Remarks', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const heading = container.querySelector('h3');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Remarks');
    });

    it('should have correct heading class', () => {
      const { container } = render(
        <RemarksPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const heading = container.querySelector('h3.vads-u-margin-top--0');
      expect(heading).to.exist;
    });
  });
});
