import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import ReviewDependents from '../../components/ReviewDependents';

const mockStore = configureStore([]);

const renderWithStore = (data = {}, error = null, setFormData = () => {}) => {
  const store = mockStore({
    dependents: {
      error,
    },
  });

  return render(
    <Provider store={store}>
      <ReviewDependents data={data} setFormData={setFormData} />
    </Provider>,
  );
};

describe('ReviewDependents', () => {
  it('should render the main heading', () => {
    const { getByRole } = renderWithStore({});
    const heading = getByRole('heading', { level: 3 });
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
    const { queryByRole } = renderWithStore({
      dependents: { awarded: [] },
    });

    const qualificationHeading = queryByRole('heading', { level: 5 });
    expect(qualificationHeading).to.be.null;
  });

  it('should show qualification section when dependents exist', () => {
    const { getByRole } = renderWithStore({
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

    const qualificationHeading = getByRole('heading', { level: 5 });
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

    const { getAllByRole } = renderWithStore({
      dependents: { awarded: mockDependents },
    });

    // Count h4 headings that represent dependent names
    const dependentHeadings = getAllByRole('heading', { level: 4 }).filter(
      heading =>
        heading.textContent === 'Maya Patel' ||
        heading.textContent === 'Naomi Garcia' ||
        heading.textContent ===
          'Check if someone is missing on your VA benefits',
    );

    // Should have 2 dependent name headings (plus 1 additional h4 for missing benefits)
    const dependentNames = dependentHeadings.filter(
      heading =>
        heading.textContent !==
        'Check if someone is missing on your VA benefits',
    );
    expect(dependentNames.length).to.equal(2);
  });

  it('should render dependent information correctly', () => {
    const { getByText } = renderWithStore({
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

    const name = getByText('Maya Patel');
    const details = getByText('Spouse | 47 years old');

    expect(name).to.not.be.null;
    expect(details).to.not.be.null;
  });

  it('should handle missing name fields gracefully', () => {
    const { getByText } = renderWithStore({
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

    const firstCardName = getByText('OnlyFirst');
    const secondCardName = getByText('OnlyLast');

    expect(firstCardName).to.not.be.null;
    expect(secondCardName).to.not.be.null;
  });

  it('should set view:addOrRemoveDependents add value to true if no dependents are loaded', () => {
    const setFormDataSpy = sinon.spy();
    const error = null;
    const { container } = renderWithStore(
      {
        vaDependentsV3: true,
        dependents: { awarded: [] },
      },
      error,
      setFormDataSpy,
    );

    expect(container.querySelector('va-alert[status="info"]')).to.exist;
    expect(setFormDataSpy.called).to.be.true;
    expect(setFormDataSpy.args[0][0]).to.deep.equal({
      vaDependentsV3: true,
      dependents: { awarded: [] },
      'view:addOrRemoveDependents': { add: true },
    });
  });

  it('should set view:addOrRemoveDependents add value to true if no dependents are loaded', () => {
    const setFormDataSpy = sinon.spy();
    const error = 'DOH';
    const { container } = renderWithStore(
      {
        vaDependentsV3: true,
        dependents: { awarded: [] },
      },
      error,
      setFormDataSpy,
    );

    expect(container.querySelector('va-alert[status="error"]')).to.exist;
    expect(setFormDataSpy.called).to.be.true;
    expect(setFormDataSpy.args[0][0]).to.deep.equal({
      vaDependentsV3: true,
      dependents: { awarded: [] },
      'view:addOrRemoveDependents': { add: true },
    });
  });

  it('should not set view:addOrRemoveDependents add value if v3 feature toggle is off', () => {
    const setFormDataSpy = sinon.spy();
    const error = 'DOH';
    const { container } = renderWithStore(
      {
        vaDependentsV3: false,
        dependents: { awarded: [] },
      },
      error,
      setFormDataSpy,
    );

    expect(container.querySelector('va-alert[status="error"]')).to.exist;
    expect(setFormDataSpy.called).to.be.false;
  });

  it('should handle undefined form data gracefully', () => {
    const { getByRole, container } = renderWithStore();

    const heading = getByRole('heading', { level: 3 });
    expect(heading).to.not.be.null;

    const errorAlert = container.querySelector('va-alert[status="error"]');
    expect(errorAlert).to.not.be.null;
  });
});
