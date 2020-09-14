import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './HelloWorld';

describe('App', () => {
  it('renders App component', () => {
    render(<App />);
    screen.debug();
    /*
    <body>
      <div>
        <div>Hello React</div>
      </div>
    </body>
    */
    screen.getByText('Hello React');
    // yarn test:unit --path src/applications/coronavirus-screener/components/HelloWorld.unit.spec.jsx
    // TestingLibraryElementError: Unable to find an element with the text: Hello React.
  });
});
