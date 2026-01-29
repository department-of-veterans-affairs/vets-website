import { render } from '@testing-library/react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import React from 'react';
import reducers from '../../reducers';
import messageResponse from '../fixtures/message-response.json';
import ReplyHeader from '../../components/ReplyHeader';
import BeforeMessageAddlInfo from '../../components/BeforeMessageAddlInfo';
import MessageThread from '../../components/MessageThread/MessageThread';

describe('Reply Header', () => {
  it('renders without errors', () => {
    const screen = render(<ReplyHeader />);

    screen.getByText('If you think your life or health is in danger,', {
      exact: false,
    });
  });
});

describe('Additional Info', () => {
  it('renders without errors', () => {
    render(<BeforeMessageAddlInfo />);
  });
});

describe.skip('Older Messages', () => {
  it('renders without errors', () => {
    const initialState = {
      message: { message: { messageResponse }, messages: null },
    };
    renderInReduxProvider(<MessageThread />, { initialState, reducers });
  });
});
