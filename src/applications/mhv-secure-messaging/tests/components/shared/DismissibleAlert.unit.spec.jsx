import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import reducer from '../../../reducers';
import DismissibleAlert from '../../../components/shared/DismissibleAlert';
import * as SmApi from '../../../api/SmApi';

describe('DismissibleAlert', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  const baseState = {
    sm: {
      tooltip: {
        tooltipVisible: true,
        tooltipId: 'mock-tooltip-id',
        error: undefined,
      },
    },
  };

  const renderComponent = (state = baseState) => {
    return renderWithStoreAndRouter(
      <DismissibleAlert
        tooltipName="test_tooltip"
        status="info"
        headline="Test Alert"
      >
        <p>This is a test alert message.</p>
      </DismissibleAlert>,
      {
        initialState: state,
        reducers: reducer,
        path: '/',
      },
    );
  };

  it('renders the alert when tooltipVisible is true', async () => {
    sandbox.stub(SmApi, 'getTooltipsList').resolves([
      {
        id: 'mock-tooltip-id',
        tooltipName: 'test_tooltip',
        hidden: false,
        counter: 1,
      },
    ]);
    sandbox.stub(SmApi, 'incrementTooltipCounter').resolves({});

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId('dismissible-tooltip-alert')).to.exist;
    });
  });

  it('does not render the alert when tooltipVisible is false', () => {
    sandbox.stub(SmApi, 'getTooltipsList').resolves([]);
    sandbox.stub(SmApi, 'createTooltip').resolves({
      id: 'new-id',
      tooltipName: 'test_tooltip',
      hidden: true,
      counter: 0,
    });

    const hiddenState = {
      sm: {
        tooltip: {
          tooltipVisible: false,
          tooltipId: undefined,
          error: undefined,
        },
      },
    };

    const { queryByTestId } = renderComponent(hiddenState);
    expect(queryByTestId('dismissible-tooltip-alert')).to.be.null;
  });

  it('creates a new tooltip when none exists', async () => {
    const createStub = sandbox.stub(SmApi, 'createTooltip').resolves({
      id: 'new-tooltip-id',
      tooltipName: 'test_tooltip',
      hidden: false,
      counter: 1,
    });
    sandbox.stub(SmApi, 'getTooltipsList').resolves([]);

    renderComponent();

    await waitFor(() => {
      expect(createStub.calledOnce).to.be.true;
    });
  });

  it('calls hideTooltip API when close event fires', async () => {
    const hideStub = sandbox.stub(SmApi, 'hideTooltip').resolves({});
    sandbox.stub(SmApi, 'getTooltipsList').resolves([
      {
        id: 'mock-tooltip-id',
        tooltipName: 'test_tooltip',
        hidden: false,
        counter: 1,
      },
    ]);
    sandbox.stub(SmApi, 'incrementTooltipCounter').resolves({});

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId('dismissible-tooltip-alert')).to.exist;
    });

    const alert = getByTestId('dismissible-tooltip-alert');
    alert.dispatchEvent(new CustomEvent('closeEvent', { bubbles: true }));

    await waitFor(() => {
      expect(hideStub.calledOnce).to.be.true;
    });
  });

  it('renders headline and children content', async () => {
    sandbox.stub(SmApi, 'getTooltipsList').resolves([
      {
        id: 'mock-tooltip-id',
        tooltipName: 'test_tooltip',
        hidden: false,
        counter: 1,
      },
    ]);
    sandbox.stub(SmApi, 'incrementTooltipCounter').resolves({});

    const { getByTestId, getByText } = renderComponent();

    await waitFor(() => {
      expect(getByTestId('dismissible-tooltip-alert')).to.exist;
    });

    expect(getByText('Test Alert')).to.exist;
    expect(getByText('This is a test alert message.')).to.exist;
  });
});
