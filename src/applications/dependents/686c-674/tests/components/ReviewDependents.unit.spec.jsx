import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { ReviewDependents } from '../../components/ReviewDependents';

const mockStore = configureStore([]);

const renderWithStore = (state = {}) => {
  const store = mockStore({
    form: { data: state },
  });

  return render(
    <Provider store={store}>
      <ReviewDependents />
    </Provider>,
  );
};

describe('ReviewDependents', () => {
  it('should render the main heading', () => {
    const { container } = renderWithStore({});
    const heading = container.querySelector('h3');

    expect(heading).to.not.be.null;
    expect(heading.textContent).to.equal('Review your VA dependents');
  });

  it('should render the add dependent instructions', () => {
    const { container } = renderWithStore({});
    const instructionsText = [...container.querySelectorAll('p')].find(p =>
      p.textContent.includes('Add a dependent if these changes occurred:'),
    );

    expect(instructionsText).to.not.be.null;

    const listItems = [...container.querySelectorAll('li')].map(
      li => li.textContent,
    );

    expect(listItems.some(text => text.includes('You got married'))).to.be.true;
    expect(
      listItems.some(text =>
        text.includes('You gave birth or adopted a child'),
      ),
    ).to.be.true;
    expect(
      listItems.some(text =>
        text.includes('Your child over age 18 is enrolled in school full-time'),
      ),
    ).to.be.true;
  });

  it('should display error alert when dependents.awarded is not an array', () => {
    const { container } = renderWithStore({
      dependents: { awarded: null },
    });

    const errorAlert = container.querySelector('va-alert[status="error"]');
    const headline = errorAlert.querySelector('[slot="headline"]');

    expect(errorAlert).to.not.be.null;
    expect(headline.textContent).to.equal(
      "We can't access your dependent records right now",
    );

    const alertText = errorAlert.textContent;
    expect(alertText).to.include(
      "We're sorry. Something went wrong on our end.",
    );
    expect(alertText).to.include('800-827-1000');
    expect(alertText).to.include('TTY: 711');
  });

  it('should display info alert when dependents.awarded is an empty array', () => {
    const { container } = renderWithStore({
      dependents: { awarded: [] },
    });

    const infoAlert = container.querySelector('va-alert[status="info"]');

    expect(infoAlert).to.not.be.null;
    expect(infoAlert.textContent).to.include(
      "We don't have any dependents on file for your VA benefits.",
    );
  });

  it('should not display dependent qualification section when no dependents', () => {
    const { container } = renderWithStore({
      dependents: { awarded: [] },
    });

    const qualificationHeading = container.querySelector('h5');
    expect(qualificationHeading).to.be.null;
  });

  it('should display dependent qualification section when dependents exist', () => {
    const { container } = renderWithStore({
      dependents: {
        awarded: [
          {
            fullName: { first: 'John', last: 'Doe' },
            relationshipToVeteran: 'Child',
            age: '25 years old',
          },
        ],
      },
    });

    const qualificationHeading = container.querySelector('h5');
    expect(qualificationHeading).to.not.be.null;
    expect(qualificationHeading.textContent).to.equal(
      'Check if your current dependents still qualify',
    );

    const removalInstructions = [...container.querySelectorAll('p')].find(p =>
      p.textContent.includes(
        'Remove dependents if these life changes occurred:',
      ),
    );
    expect(removalInstructions).to.not.be.null;

    const listItems = [...container.querySelectorAll('li')].map(
      li => li.textContent,
    );

    expect(
      listItems.some(text =>
        text.includes('You got divorced or became widowed'),
      ),
    ).to.be.true;
    expect(listItems.some(text => text.includes('Your child died'))).to.be.true;
    expect(
      listItems.some(text =>
        text.includes('Your child over age 18 left full-time school'),
      ),
    ).to.be.true;
    expect(
      listItems.some(text =>
        text.includes('Your child (either a minor or a student) got married'),
      ),
    ).to.be.true;
    expect(listItems.some(text => text.includes('Your parent died'))).to.be
      .true;
  });

  it('should display overpayment warning when dependents exist', () => {
    const { container } = renderWithStore({
      dependents: {
        awarded: [
          {
            fullName: { first: 'Jane', last: 'Smith' },
            relationshipToVeteran: 'Spouse',
            age: '30 years old',
          },
        ],
      },
    });

    const warningText = [...container.querySelectorAll('p')].find(p =>
      p.textContent.includes(
        'Not reporting changes could lead to a benefit overpayment',
      ),
    );

    expect(warningText).to.not.be.null;
    expect(warningText.textContent).to.include(
      "You'd have to repay that money.",
    );
  });

  it('should render dependent cards with correct information', () => {
    const mockDependents = [
      {
        fullName: { first: 'Maya', last: 'Patel' },
        relationshipToVeteran: 'Spouse',
        age: '47 years old',
      },
      {
        fullName: { first: 'Naomi', last: 'Garcia' },
        relationshipToVeteran: 'Child',
        age: '21 years old',
      },
    ];

    const { container } = renderWithStore({
      dependents: { awarded: mockDependents },
    });

    const dependentCards = container.querySelectorAll(
      'div[style*="border: 1px solid #ccc"]',
    );
    expect(dependentCards.length).to.equal(2);

    const firstCard = dependentCards[0];
    const firstName = firstCard.querySelector('h4');
    const firstDetails = firstCard.querySelector('p');

    expect(firstName.textContent).to.equal('Maya Patel');
    expect(firstDetails.textContent).to.equal('Spouse | 47 years old');

    const secondCard = dependentCards[1];
    const secondName = secondCard.querySelector('h4');
    const secondDetails = secondCard.querySelector('p');

    expect(secondName.textContent).to.equal('Naomi Garcia');
    expect(secondDetails.textContent).to.equal('Child | 21 years old');
  });

  it('should handle missing name fields gracefully', () => {
    const { container } = renderWithStore({
      dependents: {
        awarded: [
          {
            fullName: { first: 'OnlyFirst' },
            relationshipToVeteran: 'Child',
            age: '18 years old',
          },
          {
            fullName: { last: 'OnlyLast' },
            relationshipToVeteran: 'Spouse',
            age: '45 years old',
          },
        ],
      },
    });

    const dependentCards = container.querySelectorAll(
      'div[style*="border: 1px solid #ccc"]',
    );
    const firstCardName = dependentCards[0].querySelector('h4');
    const secondCardName = dependentCards[1].querySelector('h4');

    expect(firstCardName.textContent).to.equal('OnlyFirst');
    expect(secondCardName.textContent).to.equal('OnlyLast');
  });

  it('should handle undefined form data gracefully', () => {
    const { container } = renderWithStore();

    const heading = container.querySelector('h3');
    expect(heading).to.not.be.null;
    expect(heading.textContent).to.equal('Review your VA dependents');

    const errorAlert = container.querySelector('va-alert[status="error"]');
    expect(errorAlert).to.not.be.null;
  });
});
