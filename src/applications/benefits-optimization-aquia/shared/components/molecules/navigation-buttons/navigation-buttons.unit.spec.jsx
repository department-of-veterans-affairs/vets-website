import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { NavigationButtons } from './navigation-buttons';

describe('NavigationButtons', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      onContinue: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('renders both buttons by default', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton).to.exist;
      expect(continueButton).to.exist;
    });

    it('displays default button text', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton.textContent).to.equal('Back');
      expect(continueButton.textContent).to.equal('Continue');
    });

    it('displays custom continue text', () => {
      const props = {
        ...defaultProps,
        continueText: 'Submit Application',
      };
      const { container } = render(<NavigationButtons {...props} />);

      const continueButton = container.querySelector('va-button[continue]');
      expect(continueButton.textContent).to.equal('Submit Application');
    });

    it('displays custom back text', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
        backText: 'Previous',
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      expect(backButton.textContent).to.equal('Previous');
    });

    it('hides back button when showBack is false', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
        showBack: false,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton).to.not.exist;
      expect(continueButton).to.exist;
    });

    it('hides back button when onBack is not provided', () => {
      const { container } = render(<NavigationButtons {...defaultProps} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton).to.not.exist;
      expect(continueButton).to.exist;
    });

    it('shows back button when both showBack and onBack are provided', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
        showBack: true,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      expect(backButton).to.exist;
    });

    it('always shows continue button', () => {
      const { container } = render(<NavigationButtons {...defaultProps} />);
      const continueButton = container.querySelector('va-button[continue]');
      expect(continueButton).to.exist;
    });
  });

  describe('interactions', () => {
    it('calls onContinue when continue button is clicked', () => {
      const onContinue = sinon.spy();
      const props = { ...defaultProps, onContinue };
      const { container } = render(<NavigationButtons {...props} />);

      const continueButton = container.querySelector('va-button[continue]');
      continueButton.click();

      expect(onContinue.calledOnce).to.be.true;
    });

    it('calls onBack when back button is clicked', () => {
      const onBack = sinon.spy();
      const props = {
        ...defaultProps,
        onBack,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      backButton.click();

      expect(onBack.calledOnce).to.be.true;
    });

    it('does not throw when continue button clicked without handler', () => {
      const props = {
        ...defaultProps,
        onContinue: undefined,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const continueButton = container.querySelector('va-button[continue]');
      expect(() => continueButton.click()).to.not.throw();
    });

    it('does not throw when back button clicked without handler', () => {
      const props = {
        ...defaultProps,
        onBack: undefined,
        showBack: true,
      };
      const { container } = render(<NavigationButtons {...props} />);

      // Back button should not render without onBack
      const backButton = container.querySelector('va-button[back]');
      expect(backButton).to.not.exist;
    });
  });

  describe('layout', () => {
    it('applies proper layout classes', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
      };
      const { container } = render(<NavigationButtons {...props} />);

      const wrapper = container.querySelector('.vads-u-margin-top--4');
      expect(wrapper).to.exist;
      expect(wrapper).to.have.class('vads-l-row');
    });

    it('places back button in left column', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
      };
      const { container } = render(<NavigationButtons {...props} />);

      const leftColumn = container.querySelector('.vads-l-col--6');
      const backButton = leftColumn.querySelector('va-button[back]');

      expect(leftColumn).to.exist;
      expect(backButton).to.exist;
    });

    it('places continue button in right column with right alignment', () => {
      const { container } = render(<NavigationButtons {...defaultProps} />);

      const rightColumn = container.querySelector('.vads-u-text-align--right');
      const continueButton = rightColumn.querySelector('va-button[continue]');

      expect(rightColumn).to.exist;
      expect(rightColumn).to.have.class('vads-l-col--6');
      expect(continueButton).to.exist;
    });

    it('maintains column structure even when back button is hidden', () => {
      const props = {
        ...defaultProps,
        showBack: false,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const columns = container.querySelectorAll('.vads-l-col--6');
      expect(columns).to.have.lengthOf(2);

      // First column should be empty
      const leftColumn = columns[0];
      const backButton = leftColumn.querySelector('va-button[back]');
      expect(backButton).to.not.exist;

      // Second column should have continue button
      const rightColumn = columns[1];
      const continueButton = rightColumn.querySelector('va-button[continue]');
      expect(continueButton).to.exist;
    });
  });

  describe('button attributes', () => {
    it('sets back attribute on back button', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      expect(backButton).to.have.attribute('back');
    });

    it('sets continue attribute on continue button', () => {
      const { container } = render(<NavigationButtons {...defaultProps} />);

      const continueButton = container.querySelector('va-button[continue]');
      expect(continueButton).to.have.attribute('continue');
    });
  });

  describe('edge cases', () => {
    it('handles empty string for button text', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
        continueText: '',
        backText: '',
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      // Component uses default text when empty strings are provided
      expect(backButton.textContent).to.equal('Back');
      expect(continueButton.textContent).to.equal('Continue');
    });

    it('handles very long button text', () => {
      const longText =
        'This is a very long button text that might cause layout issues';
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
        continueText: longText,
        backText: longText,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton.textContent).to.equal(longText);
      expect(continueButton.textContent).to.equal(longText);
    });

    it('handles null values for optional props', () => {
      const props = {
        ...defaultProps,
        onBack: null,
        showBack: null,
        continueText: null,
        backText: null,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const continueButton = container.querySelector('va-button[continue]');
      expect(continueButton).to.exist;
      // Default values should be used
      expect(continueButton.textContent).to.equal('Continue');
    });

    it('handles undefined values for optional props', () => {
      const props = {
        ...defaultProps,
        onBack: undefined,
        showBack: undefined,
        continueText: undefined,
        backText: undefined,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const continueButton = container.querySelector('va-button[continue]');
      expect(continueButton).to.exist;
      // Default values should be used
      expect(continueButton.textContent).to.equal('Continue');
    });
  });

  describe('accessibility', () => {
    it('provides semantic button elements', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
      };
      const { container } = render(<NavigationButtons {...props} />);

      const buttons = container.querySelectorAll('va-button');
      expect(buttons).to.have.lengthOf(2);

      buttons.forEach(button => {
        expect(button.tagName.toLowerCase()).to.equal('va-button');
      });
    });

    it('maintains logical tab order', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
      };
      const { container } = render(<NavigationButtons {...props} />);

      // Back button should come first in DOM order
      const buttons = container.querySelectorAll('va-button');
      expect(buttons[0]).to.have.attribute('back');
      expect(buttons[1]).to.have.attribute('continue');
    });

    it('provides clear button purpose through text', () => {
      const props = {
        ...defaultProps,
        onBack: sinon.spy(),
        continueText: 'Save and Continue',
        backText: 'Return to Previous Step',
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton.textContent).to.equal('Return to Previous Step');
      expect(continueButton.textContent).to.equal('Save and Continue');
    });
  });

  describe('common use cases', () => {
    it('works as first page navigation (no back button)', () => {
      const onContinue = sinon.spy();
      const props = {
        onContinue,
        showBack: false,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton).to.not.exist;
      expect(continueButton).to.exist;

      continueButton.click();
      expect(onContinue.calledOnce).to.be.true;
    });

    it('works as middle page navigation (both buttons)', () => {
      const onBack = sinon.spy();
      const onContinue = sinon.spy();
      const props = {
        onBack,
        onContinue,
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const continueButton = container.querySelector('va-button[continue]');

      expect(backButton).to.exist;
      expect(continueButton).to.exist;

      backButton.click();
      expect(onBack.calledOnce).to.be.true;

      continueButton.click();
      expect(onContinue.calledOnce).to.be.true;
    });

    it('works as final page navigation (submit button)', () => {
      const onBack = sinon.spy();
      const onSubmit = sinon.spy();
      const props = {
        onBack,
        onContinue: onSubmit,
        continueText: 'Submit Application',
      };
      const { container } = render(<NavigationButtons {...props} />);

      const backButton = container.querySelector('va-button[back]');
      const submitButton = container.querySelector('va-button[continue]');

      expect(backButton).to.exist;
      expect(submitButton).to.exist;
      expect(submitButton.textContent).to.equal('Submit Application');

      submitButton.click();
      expect(onSubmit.calledOnce).to.be.true;
    });
  });
});
