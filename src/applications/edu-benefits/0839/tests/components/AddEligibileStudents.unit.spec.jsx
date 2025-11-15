import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sinon from 'sinon';
import * as helpers from '../../helpers';
import AddEligibileStudents from '../../components/AddEligibileStudents';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      form: (
        state = initialState.form || {
          data: {},
        },
      ) => state,
    },
    preloadedState: initialState,
  });
};

describe('AddEligibileStudents component', () => {
  let store;
  let addMaxContributionsStub;

  const renderWithStore = formData => {
    store = createMockStore({
      form: {
        data: formData,
      },
    });

    return render(
      <Provider store={store}>
        <AddEligibileStudents />
      </Provider>,
    );
  };

  beforeEach(() => {
    addMaxContributionsStub = sinon.stub(helpers, 'addMaxContributions');
  });

  afterEach(() => {
    if (addMaxContributionsStub) {
      addMaxContributionsStub.restore();
    }
  });

  it('calls addMaxContributions with an empty array when yellowRibbonProgramRequest is undefined', () => {
    addMaxContributionsStub.returns(0);

    const { getByText } = renderWithStore({});

    expect(addMaxContributionsStub.calledOnce).to.be.true;
    expect(addMaxContributionsStub.firstCall.args[0]).to.deep.equal([]);

    const heading = getByText(
      /Total number of maximum eligible students reported:/i,
    );
    expect(heading.textContent).to.equal(
      'Total number of maximum eligible students reported: 0',
    );
  });

  it('shows total from addMaxContributions when there are no unlimited options', () => {
    addMaxContributionsStub.returns(10);

    const yellowRibbonProgramRequest = [
      { maximumStudentsOption: 'limited', maximumStudents: 5 },
      { maximumStudentsOption: 'limited', maximumStudents: 5 },
    ];

    const { getByText } = renderWithStore({ yellowRibbonProgramRequest });

    expect(addMaxContributionsStub.calledOnce).to.be.true;
    expect(addMaxContributionsStub.firstCall.args[0]).to.deep.equal(
      yellowRibbonProgramRequest,
    );

    const heading = getByText(
      /Total number of maximum eligible students reported:/i,
    );
    expect(heading.textContent).to.equal(
      'Total number of maximum eligible students reported: 10',
    );
    expect(heading.textContent.includes('or unlimited')).to.be.false;
  });

  it('shows "{maxContributions} or unlimited" when some entries are unlimited but not all', () => {
    addMaxContributionsStub.returns(15);

    const yellowRibbonProgramRequest = [
      { maximumStudentsOption: 'limited', maximumStudents: 10 },
      { maximumStudentsOption: 'unlimited' },
    ];

    const { getByText } = renderWithStore({ yellowRibbonProgramRequest });

    const heading = getByText(
      /Total number of maximum eligible students reported:/i,
    );
    expect(heading.textContent).to.equal(
      'Total number of maximum eligible students reported: 15 or unlimited',
    );
  });

  it('shows "Unlimited" when all entries are unlimited', () => {
    addMaxContributionsStub.returns(20);

    const yellowRibbonProgramRequest = [
      { maximumStudentsOption: 'unlimited' },
      { maximumStudentsOption: 'unlimited' },
    ];

    const { getByText } = renderWithStore({ yellowRibbonProgramRequest });

    const heading = getByText(
      /Total number of maximum eligible students reported:/i,
    );
    expect(heading.textContent).to.equal(
      'Total number of maximum eligible students reported: Unlimited',
    );
    expect(heading.textContent.includes('or unlimited')).to.be.false;
  });

  it('applies the eligible-students-container CSS class to the outer div', () => {
    addMaxContributionsStub.returns(0);

    const { container } = renderWithStore({});
    const containerDiv = container.querySelector(
      '.eligible-students-container',
    );

    expect(containerDiv).to.exist;
  });
});
