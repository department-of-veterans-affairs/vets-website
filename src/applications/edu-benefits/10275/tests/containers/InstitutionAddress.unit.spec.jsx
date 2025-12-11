import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import InstitutionAddress from '../../containers/InstitutionAddress';

const mockStore = configureStore([]);

describe('InstitutionAddress component', () => {
  it('renders the formatted address and help text when address exists', () => {
    const store = mockStore({
      form: {
        data: {
          institutionDetails: {
            institutionAddress: {
              street: '18952 East Fisher Road',
              street2: 'Bldg 4',
              street3: 'Suite 200',
              city: 'St Marys City',
              state: 'MD',
              postalCode: '20686',
              country: 'USA',
            },
          },
        },
      },
    });

    const { getByText, queryByText, container } = render(
      <Provider store={store}>
        <InstitutionAddress />
      </Provider>,
    );
    expect(getByText(/18952 East Fisher Road/i, { exact: false })).to.exist;
    expect(getByText(/Bldg 4/i, { exact: false })).to.exist;
    expect(getByText(/Suite 200/i, { exact: false })).to.exist;
    expect(
      getByText(/St Marys City,\s*MD\s*20686/i, {
        exact: false,
      }),
    ).to.exist;
    expect(getByText(/USA/i, { exact: false })).to.exist;

    const infoEl = container.querySelector(
      'va-additional-info[trigger="What to do if this name or address looks incorrect"]',
    );
    expect(infoEl).to.exist;
    expect(queryByText('--')).to.be.null;
  });
  it('renders “--” placeholder when address object is completely missing (undefined)', () => {
    const store = mockStore({
      form: {
        data: {
          institutionDetails: {
            // address intentionally left undefined
          },
        },
      },
    });

    const { getByText, queryByText } = render(
      <Provider store={store}>
        <InstitutionAddress />
      </Provider>,
    );

    expect(getByText('--')).to.exist;
    expect(queryByText(/East Fisher Road/i)).to.be.null;
    expect(queryByText(/What to do if this name or address looks incorrect/i))
      .to.be.null;
  });

  it('renders “--” placeholder when no address is available', () => {
    const store = mockStore({
      form: {
        data: {
          institutionDetails: { institutionAddress: {} },
        },
      },
    });

    const { getByText, queryByText } = render(
      <Provider store={store}>
        <InstitutionAddress />
      </Provider>,
    );
    expect(getByText('--')).to.exist;
    expect(queryByText('18952 East Fisher Road')).to.be.null;
    expect(queryByText(/What to do if this name or address looks incorrect/i))
      .to.be.null;
  });
});
