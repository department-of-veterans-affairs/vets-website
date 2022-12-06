import { render } from '@testing-library/react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import React from 'react';
import messageResponse from '../fixtures/message-response.json';
import reducers from '~/applications/mhv/secure-messaging/reducers';
import ReplyBox from '../../components/ReplyBox';
import ReplyHeader from '../../components/ReplyHeader';
import BeforeMessageAddlInfo from '../../components/BeforeMessageAddlInfo';
// import NavigationLinks from '../../components/NavigationLinks';
import MessageThread from '../../components/MessageThread/MessageThread';

describe('Reply Header', () => {
  it('renders without errors', () => {
    const screen = render(<ReplyHeader />);

    screen.getByText('call', { exact: false });
  });
});

describe('Additional Info', () => {
  it('renders without errors', () => {
    render(<BeforeMessageAddlInfo />);
  });
});

// Unable to test at the moment since the compnent is connected to redux, will uncomment once we have figured out the redux testing issues
// describe('Navigation Links', () => {
//   it('renders without errors', () => {
//     const screen = render(<NavigationLinks />);

//     screen.getByText('Next', { exact: false });
//     screen.getByText('Previous', { exact: false });
//   });
// });

describe('Reply Box', () => {
  it('renders without errors', () => {
    render(<ReplyBox />);
  });
});

describe('Older Messages', () => {
  it('renders without errors', () => {
    const initialState = {
      message: { message: { messageResponse }, messages: null },
    };
    renderInReduxProvider(<MessageThread />, { initialState, reducers });
  });
});
