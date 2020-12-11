import React from 'react';
import ReactDOM from 'react-dom';

import { Introduction } from '../../components/Introduction';

describe('<Introduction/>', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Introduction isLoggedIn={false} toggleLoginModal={null} />,
      div,
    );
  });
});
