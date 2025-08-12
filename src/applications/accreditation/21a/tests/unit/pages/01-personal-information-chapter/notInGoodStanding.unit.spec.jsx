import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import NotInGoodStanding from '../../../../components/01-personal-information-chapter/NotInGoodStanding';

describe('NotInGoodStanding', () => {
  it('renders the alert headline, message, and navigation buttons', () => {
    const { getByText, container } = render(
      <NotInGoodStanding goToPath={() => {}} />,
    );

    expect(
      getByText(
        'You must be in good standing with the bar to become accredited.',
      ),
    ).to.exist;
    expect(
      getByText(
        /In order to be accredited by VA as an attorney, an individual must be a member in good standing of the bar of the highest court of a state or territory of the United States\./,
        { exact: false },
      ),
    ).to.exist;

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).to.be.greaterThan(0);
  });

  context('navigation button functionality', () => {
    it('should call goToPath with "/law-license" when back button is clicked', () => {
      const mockGoToPath = () => {};
      const { container } = render(
        <NotInGoodStanding goToPath={mockGoToPath} />,
      );

      const backButton = container.querySelector('button.usa-button-secondary');
      expect(backButton).to.exist;

      // Mock the goToPath function to track calls
      let calledPath = null;
      const trackedGoToPath = path => {
        calledPath = path;
      };

      // Re-render with tracked function
      const { container: newContainer } = render(
        <NotInGoodStanding goToPath={trackedGoToPath} />,
      );

      const newBackButton = newContainer.querySelector(
        'button.usa-button-secondary',
      );
      fireEvent.click(newBackButton);

      expect(calledPath).to.equal('/law-license');
    });

    it('should call goToPath with "/name-date-of-birth" when continue button is clicked', () => {
      const mockGoToPath = () => {};
      const { container } = render(
        <NotInGoodStanding goToPath={mockGoToPath} />,
      );

      const continueButton = container.querySelector(
        'button.usa-button-primary',
      );
      expect(continueButton).to.exist;

      // Mock the goToPath function to track calls
      let calledPath = null;
      const trackedGoToPath = path => {
        calledPath = path;
      };

      // Re-render with tracked function
      const { container: newContainer } = render(
        <NotInGoodStanding goToPath={trackedGoToPath} />,
      );

      const newContinueButton = newContainer.querySelector(
        'button.usa-button-primary',
      );
      fireEvent.click(newContinueButton);

      expect(calledPath).to.equal('/name-date-of-birth');
    });

    it('should have back button with correct text and styling', () => {
      const { container } = render(<NotInGoodStanding goToPath={() => {}} />);

      const backButton = container.querySelector('button.usa-button-secondary');
      expect(backButton).to.exist;
      expect(backButton.textContent).to.include('Back');
      expect(backButton.className).to.include('usa-button-secondary');
    });

    it('should have continue button with correct text and styling', () => {
      const { container } = render(<NotInGoodStanding goToPath={() => {}} />);

      const continueButton = container.querySelector(
        'button.usa-button-primary',
      );
      expect(continueButton).to.exist;
      expect(continueButton.textContent).to.include('Continue');
      expect(continueButton.className).to.include('usa-button-primary');
    });

    it('should handle undefined goToPath prop gracefully', () => {
      expect(() => render(<NotInGoodStanding />)).to.not.throw();
    });

    it('should handle null goToPath prop gracefully', () => {
      expect(() =>
        render(<NotInGoodStanding goToPath={null} />),
      ).to.not.throw();
    });

    it('should handle function goToPath prop', () => {
      const mockFunction = () => {};
      expect(() =>
        render(<NotInGoodStanding goToPath={mockFunction} />),
      ).to.not.throw();
    });
  });
});
