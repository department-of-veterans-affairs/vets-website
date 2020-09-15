import React from 'react';
import { render, screen } from '@testing-library/react';

import App from './HelloWorld';

// yarn test:unit --path src/applications/coronavirus-screener/components/HelloWorld.unit.spec.jsx

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

  it('gets text from exampleHTML', () => {
    const exampleHTML = `<body>
    <div>
      <div>hello</div>
    </div>
  </body>`;
    document.body.innerHTML = exampleHTML;

    screen.debug();
    const example = screen.getByText(/hello/i);
  });

  it('gets text from super simple exampleHTML', () => {
    const exampleHTML = `<div>hello</div>`;
    document.body.innerHTML = exampleHTML;

    screen.debug();
    const example = screen.getByText('hello');
  });
});
