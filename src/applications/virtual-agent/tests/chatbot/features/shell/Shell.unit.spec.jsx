import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import * as ReactRedux from 'react-redux';

import { Shell } from '../../../../chatbot/features/shell/Shell';
import * as LeftColumnContentModule from '../../../../chatbot/features/shell/components/LeftColumnContent';
import * as RightColumnContentModule from '../../../../chatbot/features/shell/components/RightColumnContent';
import * as UseSkipLinkFixModule from '../../../../chatbot/features/shell/hooks/useSkipLinkFix';
import { chatbotActions } from '../../../../chatbot/store';

describe('Shell', () => {
  let sandbox;
  let dispatchSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatchSpy = sandbox.spy();

    sandbox.stub(ReactRedux, 'useDispatch').returns(dispatchSpy);
    sandbox.stub(UseSkipLinkFixModule, 'default');

    sandbox
      .stub(LeftColumnContentModule, 'default')
      .returns(<div data-testid="left-column-content" />);
    sandbox
      .stub(RightColumnContentModule, 'default')
      .callsFake(({ onAccept }) => (
        <button
          type="button"
          data-testid="right-column-content"
          onClick={onAccept}
        >
          Accept
        </button>
      ));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the shell layout with left and right content', () => {
    const { getByTestId } = render(<Shell />);

    expect(getByTestId('chatbot-shell')).to.exist;
    expect(getByTestId('left-column-content')).to.exist;
    expect(getByTestId('right-column-content')).to.exist;
  });

  it('dispatches acceptDisclaimer when the right column calls onAccept', () => {
    const { getByTestId } = render(<Shell />);

    fireEvent.click(getByTestId('right-column-content'));

    expect(dispatchSpy.calledWith(chatbotActions.acceptDisclaimer())).to.be
      .true;
  });
});
