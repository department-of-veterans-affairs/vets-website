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
      form: (state = initialState.form || { data: {} }) => state,
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

    const { getByText, queryByText } = renderWithStore({});

    expect(addMaxContributionsStub.calledOnce).to.be.true;
    expect(addMaxContributionsStub.firstCall.args[0]).to.deep.equal([]);
    expect(getByText(/Total number of maximum eligible students reported:/i)).to
      .exist;
    expect(
      getByText(
        /You reported a maximum of 0 eligible students for participation\./i,
      ),
    ).to.exist;
    expect(
      queryByText(
        /You have selected unlimited for the maximum number of eligible students\./i,
      ),
    ).to.be.null;
  });

  it('shows total from addMaxContributions when there are no unlimited options', () => {
    addMaxContributionsStub.returns(10);

    const yellowRibbonProgramRequest = [
      { maximumStudentsOption: 'limited', maximumStudents: 5 },
      { maximumStudentsOption: 'limited', maximumStudents: 5 },
    ];

    const { getByText, queryByText } = renderWithStore({
      yellowRibbonProgramRequest,
    });

    expect(addMaxContributionsStub.calledOnce).to.be.true;
    expect(addMaxContributionsStub.firstCall.args[0]).to.deep.equal(
      yellowRibbonProgramRequest,
    );

    expect(getByText(/Total number of maximum eligible students reported:/i)).to
      .exist;

    expect(
      getByText(
        /You reported a maximum of 10 eligible students for participation\./i,
      ),
    ).to.exist;

    expect(
      queryByText(
        /You have selected unlimited for the maximum number of eligible students\./i,
      ),
    ).to.be.null;
  });

  it('shows both paragraphs when some entries are unlimited but not all', () => {
    addMaxContributionsStub.returns(15);

    const yellowRibbonProgramRequest = [
      { maximumStudentsOption: 'limited', maximumStudents: 10 },
      { maximumStudentsOption: 'unlimited' },
    ];

    const { getByText } = renderWithStore({ yellowRibbonProgramRequest });

    expect(getByText(/Total number of maximum eligible students reported:/i)).to
      .exist;

    expect(
      getByText(
        /You reported a maximum of 15 eligible students for participation, and/i,
      ),
    ).to.exist;

    expect(
      getByText(
        /You have selected unlimited for the maximum number of eligible students\./i,
      ),
    ).to.exist;
  });

  it('shows only the unlimited paragraph when all entries are unlimited', () => {
    addMaxContributionsStub.returns(20);

    const yellowRibbonProgramRequest = [
      { maximumStudentsOption: 'unlimited' },
      { maximumStudentsOption: 'unlimited' },
    ];

    const { getByText, queryByText } = renderWithStore({
      yellowRibbonProgramRequest,
    });

    expect(getByText(/Total number of maximum eligible students reported:/i)).to
      .exist;

    expect(
      getByText(
        /You have selected unlimited for the maximum number of eligible students\./i,
      ),
    ).to.exist;
    expect(queryByText(/You reported a maximum of/i)).to.be.null;
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
