import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import FormResult from './FormResult';

describe('FormResult', () => {
  it('renders FormResult component', async () => {
    const formState = {
      status: 'incomplete',
    };
    render(<FormResult formState={formState} />);

    screen.debug();
    /*
<body>
  <div>
    <div
      class="feature covid-screener-results covid-screener-results-incomplete"
    >
      <div
        name="multi-question-form-result-scroll-element"
      />
      <div>
        <div
          data-testid="result-incomplete"
        >
          Please answer all the questions above.
        </div>
      </div>
    </div>
  </div>
</body>
*/
    // Error: Unable to find an element by: [data-testid="result-incomplete"]
    expect(await screen.findByTestId('result-incomplete')).to.exist();
  });
});
