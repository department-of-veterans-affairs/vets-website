import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import * as webComponents from 'platform/utilities/ui/webComponents';
import Calcs from '../../pages/calcs';
import * as helpers from '../../helpers';

const mockStore = configureStore();

describe('<Calcs />', () => {
  let querySelectorStub;
  let getFTECalcsStub;

  const mockData = {
    programs: [
      {
        supported: true,
        nonSupported: false,
        total: 10,
        supportedFTEPercent: 100,
      },
      {
        supported: true,
        nonSupported: true,
        total: 20,
        supportedFTEPercent: 50,
      },
    ],
  };

  beforeEach(() => {
    querySelectorStub = sinon.stub(
      webComponents,
      'querySelectorWithShadowRoot',
    );
    getFTECalcsStub = sinon.stub(helpers, 'getFTECalcs').returns({
      total: 8,
      supportedFTEPercent: '62.5%',
    });
  });

  afterEach(() => {
    querySelectorStub.restore();
    getFTECalcsStub.restore();
  });

  it('should render correctly with given props', () => {
    const store = mockStore({ form: { data: mockData } });
    const { getByTestId } = render(
      <Provider store={store}>
        <Calcs data={mockData} />
      </Provider>,
    );

    expect(getByTestId('num-fte').textContent).to.equal('Total Enrolled FTE');
    expect(getByTestId('nonSupported').textContent).to.equal('--');
    expect(getByTestId('percentage-FTE').textContent).to.equal(
      'Supported student percentage FTE',
    );
    expect(getByTestId('supportedFTEPercent').textContent).to.equal('62.5%');
  });

  it('should render "--" when no data is available', () => {
    const emptyData = { programs: [] };
    const store = mockStore({ form: { data: emptyData } });
    const { getByTestId } = render(
      <Provider store={store}>
        <Calcs data={emptyData} />
      </Provider>,
    );

    expect(getByTestId('nonSupported').textContent).to.equal('--');
    expect(getByTestId('supportedFTEPercent').textContent).to.equal('62.5%');
  });

  it('should update programData when updateData is called', async () => {
    const store = mockStore({ form: { data: mockData } });
    const mockSupportedInput = { shadowRoot: { querySelector: sinon.stub() } };
    const mockNonSupportedInput = {
      shadowRoot: { querySelector: sinon.stub() },
    };

    mockSupportedInput.shadowRoot.querySelector
      .withArgs('input')
      .returns({ value: '5' });
    mockNonSupportedInput.shadowRoot.querySelector
      .withArgs('input')
      .returns({ value: '3' });

    querySelectorStub
      .withArgs('va-text-input[name="root_fte_supported"]', document)
      .resolves(mockSupportedInput);
    querySelectorStub
      .withArgs('va-text-input[name="root_fte_nonSupported"]', document)
      .resolves(mockNonSupportedInput);

    const { getByTestId } = render(
      <Provider store={store}>
        <Calcs data={mockData} />
      </Provider>,
    );

    await webComponents.querySelectorWithShadowRoot();

    expect(getByTestId('nonSupported').textContent).to.equal('--');
    expect(getByTestId('supportedFTEPercent').textContent).to.equal('62.5%');
  });
  it('should set programData if none exists and data is provided', async () => {
    const data = {
      programs: [
        {
          supported: 'initialValue1',
          nonSupported: 'initialValue2',
        },
        {
          supported: '3',
          nonSupported: '5',
        },
      ],
    };
    const store2 = mockStore({ form: { data } });
    const mockSupportedInput = {
      shadowRoot: {
        querySelector: sinon.stub().returns({ value: '5' }),
      },
    };

    const mockNonSupportedInput = {
      shadowRoot: {
        querySelector: sinon.stub().returns({ value: '3' }),
      },
    };

    querySelectorStub
      .withArgs('va-text-input[name="root_fte_supported"]', document)
      .resolves(mockSupportedInput);
    querySelectorStub
      .withArgs('va-text-input[name="root_fte_nonSupported"]', document)
      .resolves(mockNonSupportedInput);

    const originalLocation = window.location;
    delete window.location;
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, href: 'https://fake.url/somePage1' },
      writable: true,
    });
    render(
      <Provider store={store2}>
        <Calcs data={mockData} />
      </Provider>,
    );

    await waitFor(() => {
      const lastCallArg = getFTECalcsStub.lastCall.args[0];
      expect(lastCallArg).to.deep.equal({ supported: '3', nonSupported: '5' });
    });
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: false,
    });
  });
});
