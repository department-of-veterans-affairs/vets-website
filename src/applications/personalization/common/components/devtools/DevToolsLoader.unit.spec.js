import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import DevToolsLoader from './DevToolsLoader';

const mockNanoid = () => '123';

describe('<DevToolsLoader />', () => {
  let props;

  beforeEach(() => {
    props = {
      devToolsData: {},
      panel: true,
    };
  });

  it('toggles the panel visibility with custom events', async () => {
    const { queryByTestId, findByTestId } = render(
      <DevToolsLoader {...props} nanoidImp={mockNanoid} />,
    );

    document.dispatchEvent(
      new CustomEvent('devToolsPanelUpdate', {
        detail: { devToolsData: { test: true }, uuid: mockNanoid() },
      }),
    );

    expect(await findByTestId('devtools-panel')).to.exist;

    document.dispatchEvent(
      new CustomEvent('devToolsPanelUpdate', {
        detail: { closeAll: true },
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

  it('renders children correctly', async () => {
    const { findByRole, findByText } = render(
      <DevToolsLoader {...props}>
        <div>Child Content</div>
      </DevToolsLoader>,
    );

    fireEvent.click(await findByRole('button'));

    expect(await findByText('Child Content', { exact: false })).to.exist;
    expect(
      await findByText(`"componentOrElementName": "div"`, { exact: false }),
    ).to.exist;
  });
});
