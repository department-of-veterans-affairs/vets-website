import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { expect } from 'chai';

import DevToolsLoader from './DevToolsLoader';

const mockNanoid = () => '123';

describe('<DevToolsLoader />', async () => {
  it('toggles the panel visibility with custom events', async () => {
    const { queryByTestId, findByTestId } = render(
      <DevToolsLoader
        devToolsData={{ test: 'data' }}
        panel
        nanoidImp={mockNanoid}
      />,
    );

    act(() => {
      document.dispatchEvent(
        new CustomEvent('devToolsPanelUpdate', {
          detail: { devToolsData: { test: true }, uuid: mockNanoid() },
        }),
      );
    });

    // Verify panel is shown
    expect(await findByTestId('devtools-panel')).to.exist;

    // Dispatch custom event to hide the panel
    act(() => {
      document.dispatchEvent(
        new CustomEvent('devToolsPanelUpdate', {
          detail: { closeAll: true },
        }),
      );
    });

    // Verify panel is hidden
    expect(queryByTestId('devtools-panel')).to.not.exist;
  });

  it('initially renders in a hidden state', () => {
    const { queryByTestId } = render(
      <DevToolsLoader devToolsData={{}} panel />,
    );
    expect(queryByTestId('devtools-panel')).to.not.exist;
  });

  it('shows the panel when the button is clicked', async () => {
    const { findByRole, findByTestId } = render(
      <DevToolsLoader devToolsData={{}} panel />,
    );

    await act(async () => {
      fireEvent.click(await findByRole('button'));
    });

    expect(await findByTestId('devtools-panel')).to.exist;
  });

  it('renders children correctly', async () => {
    const { findByRole, findByText } = render(
      <DevToolsLoader devToolsData={{}} panel>
        <div>Child Content</div>
      </DevToolsLoader>,
    );

    await act(async () => {
      fireEvent.click(await findByRole('button'));
    });

    expect(await findByText('Child Content', { exact: false })).to.exist;
    expect(
      await findByText(`"componentOrElementName": "div"`, { exact: false }),
    ).to.exist;
  });
});
