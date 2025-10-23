// libs
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Row from 'platform/forms/components/common/grid/Row';

describe('Common Row component', () => {
  it('should render', () => {
    const tree = render(<Row testId="12345" />);

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should render child components', () => {
    const childComponent = <div data-testid="12345">i am a component</div>;

    const tree = render(<Row>{childComponent}</Row>);

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should add classNames to output', () => {
    const classNames = 'i-am-classname';

    const tree = render(<Row classNames={classNames} testId="12345" />);

    expect(tree.getByTestId('12345')).to.have.class(classNames);
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should add role to output', () => {
    const role = 'alert';

    const tree = render(<Row role={role} testId="12345" />);

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });
});
