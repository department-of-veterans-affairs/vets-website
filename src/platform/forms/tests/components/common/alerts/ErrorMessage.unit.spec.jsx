// libs
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';

describe('Common ErrorMessage component', () => {
  it('should not render if not active', () => {
    const tree = render(<ErrorMessage testId="12345" />);

    expect(tree.queryAllByTestId('12345')).to.be.an('array').that.is.empty;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should render if active', () => {
    const tree = render(<ErrorMessage testId="12345" active />);

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should render title if passed as a prop', () => {
    const title = 'i am a title';

    const tree = render(<ErrorMessage testId="12345" active title={title} />);

    expect(tree.getByText(title)).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should render message if passed as a prop', () => {
    const message = 'i am a message';

    const tree = render(<ErrorMessage active message={message} />);

    expect(tree.getByText(message)).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });

  it('should render children if passed as a prop', () => {
    const children = 'i am a child component';

    const tree = render(<ErrorMessage active>{children}</ErrorMessage>);

    expect(tree.getByText(children)).to.not.be.null;
    expect(tree.container.innerHTML).to.matchSnapshot();

    tree.unmount();
  });
});
