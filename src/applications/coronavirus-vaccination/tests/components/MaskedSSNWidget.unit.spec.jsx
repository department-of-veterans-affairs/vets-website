import React from 'react';
import ReactDOM from 'react-dom';

import MaskedSSNWidget from '../../components/MaskedSSNWidget';

describe('<MaskedSSNWidget/>', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MaskedSSNWidget
        value=""
        onChange={() => {}}
        onBlur={() => {}}
        schema={{}}
        options={{}}
      />,
      div,
    );
  });
});
