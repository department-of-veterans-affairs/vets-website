import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { FieldHasBeenUpdated } from '../../../components/alerts/FieldHasBeenUpdated';

describe('<FieldHasBeenUpdated />', () => {
  let historyMock;

  afterEach(() => {
    historyMock = null;
  });

  function renderWithRouter(state) {
    historyMock = {
      replaceState: sinon.spy(),
    };
    return render(
      <MemoryRouter initialEntries={[{ pathname: '/', state }]}>
        <Route>
          <FieldHasBeenUpdated history={historyMock} />
        </Route>
      </MemoryRouter>,
    );
  }

  it('renders the alert with the correct message when fieldInfo is present in location state', () => {
    const { getByText } = renderWithRouter({
      fieldInfo: { title: 'Test Field' },
    });

    expect(getByText('We saved your test field to your profile.')).to.exist;
  });

  it('renders the alert with the fallback text message when fieldInfo title is not present in location state', () => {
    const { getByText } = renderWithRouter({ fieldInfo: { title: null } });

    expect(getByText('We saved your information to your profile.')).to.exist;
  });

  it('does not render the alert when fieldInfo is not present in location state', () => {
    const { queryByText } = renderWithRouter();

    expect(queryByText('We saved your')).to.be.null;
  });

  it('clears the location state after the alert is shown', async () => {
    renderWithRouter({ fieldInfo: { title: 'Test Field' } });

    await waitFor(() => {
      expect(historyMock.replaceState.called).to.be.true;
    });
    expect(historyMock.replaceState.args[0][0]).to.be.null;
  });
});
