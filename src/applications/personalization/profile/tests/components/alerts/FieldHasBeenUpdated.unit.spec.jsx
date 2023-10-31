import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { FieldHasBeenUpdated } from '../../../components/alerts/FieldHasBeenUpdated';

describe('<FieldHasBeenUpdated />', () => {
  it('renders the alert with the correct message when fieldInfo is present in location state', () => {
    const testState = {
      fieldInfo: {
        title: 'Test Field',
      },
    };

    const { getByText } = render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: testState }]}>
        <Route>
          <FieldHasBeenUpdated
            history={{
              replaceState: sinon.spy(),
            }}
          />
        </Route>
      </MemoryRouter>,
    );

    expect(getByText('We saved your test field to your profile.')).to.exist;
  });

  it('renders the alert with the fallback text message when fieldInfo title is not present in location state', () => {
    const testState = {
      fieldInfo: {
        title: null,
      },
    };

    const { getByText } = render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: testState }]}>
        <Route>
          <FieldHasBeenUpdated
            history={{
              replaceState: sinon.spy(),
            }}
          />
        </Route>
      </MemoryRouter>,
    );

    expect(getByText('We saved your information to your profile.')).to.exist;
  });

  it('does not render the alert when fieldInfo is not present in location state', () => {
    const { queryByText } = render(
      <MemoryRouter>
        <Route>
          <FieldHasBeenUpdated
            history={{
              replaceState: sinon.spy(),
            }}
          />
        </Route>
      </MemoryRouter>,
    );

    expect(queryByText('We saved your')).to.be.null;
  });

  it('clears the location state after the alert is shown', () => {
    // mock the window
    const history = {
      replaceState: sinon.spy(),
    };

    const testState = {
      fieldInfo: {
        title: 'Test Field',
      },
    };

    const { getByText } = render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: testState }]}>
        <Route>
          <FieldHasBeenUpdated history={history} />
        </Route>
      </MemoryRouter>,
    );

    expect(getByText('We saved your test field to your profile.')).to.exist;

    expect(history.replaceState.called).to.be.true;
    expect(history.replaceState.args[0][0]).to.be.null;
  });
});
