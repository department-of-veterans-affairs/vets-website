import React from 'react';
import { expect } from 'chai';
import { renderWithRouter } from '../utils';
import withRouter from '../../utils/withRouter';

const TestComponent = () => {
  return (
    <h1 data-testid="test" id="test">
      TEST
    </h1>
  );
};

const TestComponentWithRouter = withRouter(TestComponent);

describe('withRouter', () => {
  it('should render withRouter', () => {
    const { getByTestId } = renderWithRouter(<TestComponentWithRouter />);

    expect(getByTestId('test')).to.exist;
    // expect(result).to.exist;
  });
});
