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

    const qualificationHeading = queryByRole('heading', { level: 4 });
    expect(qualificationHeading).to.be.null;
  });

  it('should show qualification section when dependents exist', () => {
    const { getAllByRole } = renderWithStore({
      dependents: {
        awarded: [
          {
            fullName: { first: 'John', last: 'Doe' },
            relationshipToVeteran: 'Child',
            labeledAge: '25 years old',
          },
        ],
      },
    });

    const qualificationHeadings = getAllByRole('heading', { level: 4 });
    // Should have 2 h4 headings: 1 dependent name + "Check if someone is missing on your VA benefits"
    expect(qualificationHeadings.length).to.equal(2);
  });

  it('should render correct number of dependent cards', () => {
    const mockDependents = [
      {
        fullName: { first: 'Maya', last: 'Patel' },
        relationshipToVeteran: 'Spouse',
        labeledAge: '47 years old',
      },
      {
        fullName: { first: 'Naomi', last: 'Garcia' },
        relationshipToVeteran: 'Child',
        labeledAge: '21 years old',
      },
    ];

    const { getAllByRole } = renderWithStore({
      dependents: { awarded: mockDependents },
    });

    // Should have 3 h4 headings: 2 dependent names + "Check if someone is missing on your VA benefits"
    expect(getAllByRole('heading', { level: 4 }).length).to.equal(3);
  });

  it('should render dependent information correctly', () => {
    const { getByText } = renderWithStore({
      dependents: {
        awarded: [
          {
            fullName: { first: 'Maya', last: 'Patel' },
            relationshipToVeteran: 'Spouse',
            labeledAge: '47 years old',
          },
        ],
      },
    });

    const name = getByText('Maya Patel');
    const relationship = getByText('Spouse,');
    const age = getByText('47 years old');

    expect(name).to.not.be.null;
    expect(relationship).to.not.be.null;
    expect(age).to.not.be.null;
  });

  it('should handle missing name fields gracefully', () => {
    const { getByText } = renderWithStore({
      dependents: {
        awarded: [
          {
            fullName: { first: 'OnlyFirst' },
            relationshipToVeteran: 'Child',
            labeledAge: '18 years old',
          },
          {
            fullName: { last: 'OnlyLast' },
            relationshipToVeteran: 'Spouse',
            labeledAge: '45 years old',
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
    expect(container.querySelector('va-alert[status="error"]')).to.not.exist;
    expect(setFormDataSpy.called).to.be.true;
    expect(setFormDataSpy.args[0][0]).to.deep.equal({
      vaDependentsV3: true,
      dependents: { awarded: [] },
      'view:addOrRemoveDependents': { add: true },
      'view:dependentsApiError': false,
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
    expect(container.querySelector('va-alert[status="info"]')).to.not.exist;
    expect(setFormDataSpy.called).to.be.true;
    expect(setFormDataSpy.args[0][0]).to.deep.equal({
      vaDependentsV3: true,
      dependents: { awarded: [] },
      'view:addOrRemoveDependents': { add: true },
      'view:dependentsApiError': true,
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
