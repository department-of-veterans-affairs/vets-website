import React from 'react';
import ReactDOM from 'react-dom';

import { Confirmation } from '../../components/Confirmation';

describe('<Confirmation/>', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Confirmation router={{}} formData={{}} />, div);
  });
});
