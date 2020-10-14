import React from 'react';
import { render } from '@testing-library/react';

import App from './HelloWorld';

// yarn test:unit --path src/applications/coronavirus-screener/components/HelloWorld.unit.spec.jsx

describe('App', () => {
  it('renders App component', () => {
    // does not work with:
    // import { render, screen } from '@testing-library/react';
    // render(<App />);
    // screen.getByText('Hello React');

    // for some reason screen variable must be created instead of following https://testing-library.com/docs/react-testing-library/example-intro#full-example
    const screen = render(<App />);
    screen.debug();
    screen.getByText('Hello React');
  });
});
