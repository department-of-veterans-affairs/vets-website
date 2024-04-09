import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import DevToolsLoader from './DevToolsLoader';

const mockNanoid = () => '123';

describe('<DevToolsLoader />', () => {
  let props;

  beforeEach(() => {
    props = {
      devToolsData: { key: 'value' },
      panel: true,
    };
  });

  it('toggles the panel visibility with custom events and shows devToolsData', async () => {
    const { queryByTestId, findByTestId } = render(
      <DevToolsLoader {...props} nanoidImp={mockNanoid} />,
    );

    document.dispatchEvent(
      new CustomEvent('devToolsPanelUpdate', {
        detail: { devToolsData: { test: true }, uuid: mockNanoid() },
      }),
    );

    expect(await findByTestId('devtools-panel')).to.exist;

    expect(await findByTestId('devtools-panel')).to.contain.text(
      JSON.stringify(props.devToolsData, null, 2),
      { exact: false },
    );

    document.dispatchEvent(
      new CustomEvent('devToolsPanelUpdate', {
        detail: { closeAll: true },
      }),
    );

    expect(queryByTestId('devtools-panel')).to.not.exist;
  });

  it('toggles the panel visibility with custom events and closes it when uuid does not match in event', async () => {
    const { queryByTestId, findByTestId } = render(
      <DevToolsLoader {...props} nanoidImp={mockNanoid} />,
    );

    document.dispatchEvent(
      new CustomEvent('devToolsPanelUpdate', {
        detail: { devToolsData: { test: true }, uuid: mockNanoid() },
      }),
    );

    expect(await findByTestId('devtools-panel')).to.exist;

    expect(await findByTestId('devtools-panel')).to.contain.text(
      JSON.stringify(props.devToolsData, null, 2),
      { exact: false },
    );

    document.dispatchEvent(
      new CustomEvent('devToolsPanelUpdate', {
        detail: { uuid: 'not-matching-uuid' },
      }),
    );

    expect(queryByTestId('devtools-panel')).to.not.exist;
  });

  it('initially renders in a hidden state', () => {
    const { queryByTestId } = render(<DevToolsLoader {...props} />);
    expect(queryByTestId('devtools-panel')).to.not.exist;
  });

  it('shows the panel when the button is clicked', async () => {
    const { findByRole, findByTestId } = render(<DevToolsLoader {...props} />);

    fireEvent.click(await findByRole('button'));

    expect(await findByTestId('devtools-panel')).to.exist;
  });
});
