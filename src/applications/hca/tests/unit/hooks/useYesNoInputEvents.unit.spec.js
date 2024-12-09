import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';
import YesNoWidget from 'platform/forms-system/src/js/widgets/YesNoWidget';
import * as recordEventModule from 'platform/monitoring/record-event';
import { useYesNoInputEvents } from '../../../hooks/useYesNoInputEvents';

// create wrapper component for our hook
// eslint-disable-next-line react/prop-types
const TestComponent = ({ loading }) => {
  useYesNoInputEvents(loading, {});
  return !loading ? (
    <YesNoWidget id="root_response" onChange={() => {}} value={null} />
  ) : null;
};

describe('hca `useYesNoInputEvents` hook', () => {
  const subject = ({ loading = false }) => {
    const { container } = render(<TestComponent loading={loading} />);
    const selectors = () => ({
      input: container.querySelector('input[id$=Yes]'),
    });
    return { selectors };
  };

  it('should not render any inputs that get event attachment when the app is loading', () => {
    const { selectors } = subject({ loading: true });
    expect(selectors().input).to.not.exist;
  });

  it('should fire the `recordEvent` method to log the interaction to analytics', async () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { selectors } = subject({});
    await waitFor(() => {
      userEvent.click(selectors().input);
      expect(recordEventStub.called).to.be.true;
      recordEventStub.restore();
    });
  });
});
