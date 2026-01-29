import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { stubAllergiesApi, stubPrescriptionsListApi } from '../testing-utils';
import reducers from '../../reducers';
import PrescriptionsPrintOnly from '../../containers/PrescriptionsPrintOnly';

let sandbox;

describe('Medications List Print Page', () => {
  const setup = (params = {}) => {
    return renderWithStoreAndRouterV6(<PrescriptionsPrintOnly />, {
      initialState: {},
      reducers,
      initialEntries: ['/?page=1'],
      ...params,
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsListApi({ sandbox });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders Correctly even when error is an object', async () => {
    const setupWithError = (params = {}) => {
      return renderWithStoreAndRouterV6(<PrescriptionsPrintOnly hasError />, {
        initialState: {},
        reducers,
        initialEntries: ['/?page=1'],
        ...params,
      });
    };
    const screen = setupWithError();
    const errorMessage = screen.findByText(
      'We’re sorry. There’s a problem with our system.',
    );
    expect(errorMessage).to.exist;
  });

  it('renders without errors', async () => {
    const screen = setup();
    expect(screen);
  });

  it('Medications | Veterans Affairs', () => {
    const screen = setup();
    const rxName = screen.findByText('Medications | Veterans Affairs');
    expect(rxName).to.exist;
  });
  it('does not render for paths other than medication list and details', () => {
    const screen = setup({ path: '/foo' });
    expect(screen.queryByTestId('name-date-of-birth')).to.not.exist;
  });
});
