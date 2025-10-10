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
    expect(heading.textContent).to.equal('Review your VA dependents');
  });

  it('should display error alert when dependents data is unavailable', () => {
    const { container } = renderWithStore({
      dependents: { awarded: null },
    });

    const errorAlert = container.querySelector('va-alert[status="error"]');
    expect(errorAlert).to.not.be.null;
  });

  it('should display info alert when no dependents exist', () => {
    const { container } = renderWithStore({
      dependents: { awarded: [] },
    });

    const infoAlert = container.querySelector('va-alert[status="info"]');
    expect(infoAlert).to.not.be.null;
  });

  it('should not show qualification section when no dependents', () => {
    const { container } = renderWithStore({
      dependents: { awarded: [] },
    });

    const qualificationHeading = container.querySelector('h5');
    expect(qualificationHeading).to.be.null;
  });

  it('should show qualification section when dependents exist', () => {
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
  });

  it('should render correct number of dependent cards', () => {
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

    const dependentCards = container.querySelectorAll('.dependent-card');
    expect(dependentCards.length).to.equal(2);
  });

  it('should render dependent information correctly', () => {
    const { container } = renderWithStore({
      dependents: {
        awarded: [
          {
            fullName: { first: 'Maya', last: 'Patel' },
            relationshipToVeteran: 'Spouse',
            age: '47 years old',
          },
        ],
      },
    });

    const dependentCard = container.querySelector('.dependent-card');
    const name = dependentCard.querySelector('h4');
    const details = dependentCard.querySelector('p');

    expect(name.textContent).to.equal('Maya Patel');
    expect(details.textContent).to.equal('Spouse | 47 years old');
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

    const dependentCards = container.querySelectorAll('.dependent-card');
    const firstCardName = dependentCards[0].querySelector('h4');
    const secondCardName = dependentCards[1].querySelector('h4');

    expect(firstCardName.textContent).to.equal('OnlyFirst');
    expect(secondCardName.textContent).to.equal('OnlyLast');
  });

  it('should handle undefined form data gracefully', () => {
    const { container } = renderWithStore();

    const heading = container.querySelector('h3');
    expect(heading).to.not.be.null;

    const errorAlert = container.querySelector('va-alert[status="error"]');
    expect(errorAlert).to.not.be.null;
  });
});
