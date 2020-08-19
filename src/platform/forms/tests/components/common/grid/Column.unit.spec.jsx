// libs
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import Column from 'platform/forms/components/common/grid/Column';

describe('Common Column component', () => {
  it('should render', () => {
    const tree = render(<Column testId="12345" />);

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should render child components', () => {
    const childComponent = <div data-testid="12345">i am a component</div>;

    const tree = render(<Column>{childComponent}</Column>);

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should add classNames to output', () => {
    const classNames = 'i-am-classname';

    const tree = render(<Column classNames={classNames} />);

    expect(tree.container.firstChild).to.have.class(classNames);
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should role to output', () => {
    const role = 'alert';

    const tree = render(<Column role={role} testId="12345" />);

    expect(tree.getByTestId('12345')).to.have.attribute('role', role);
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });
});
