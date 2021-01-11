import React from 'react';
import ReactDOM from 'react-dom';

import { Unsubscribe } from '../../components/Unsubscribe';

describe('<Unsubscribe/>', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Unsubscribe router={{ location: { query: { sid: '12345' } } }} />,
      div,
    );
  });
});
