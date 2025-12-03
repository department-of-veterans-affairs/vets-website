import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import ActionLink from '../../../components/ActionLink';

describe('ActionLink Component', () => {
  it('should render an ActionLink component', () => {
    const { container } = render(<ActionLink text="Test Link" />);
    const linkAction = container.querySelector('va-link-action');
    expect(linkAction).to.exist;
    expect(linkAction.getAttribute('text')).to.equal('Test Link');
  });

  it('should call onClick and router.push when clicked', () => {
    const mockRouter = {
      push: sinon.spy(),
    };
    const mockOnClick = sinon.spy();

    const { container } = render(
      <ActionLink
        text="Test Link"
        path="/test-path"
        router={mockRouter}
        onClick={mockOnClick}
      />,
    );

    const linkAction = container.querySelector('va-link-action');
    fireEvent.click(linkAction);

    expect(mockOnClick.calledOnce).to.be.true;
    expect(mockRouter.push.calledOnce).to.be.true;
    expect(mockRouter.push.calledWith('/test-path')).to.be.true;
  });

  it('should only call router.push when no onClick provided', () => {
    const mockRouter = {
      push: sinon.spy(),
    };

    const { container } = render(
      <ActionLink text="Test Link" path="/test-path" router={mockRouter} />,
    );

    const linkAction = container.querySelector('va-link-action');
    fireEvent.click(linkAction);

    expect(mockRouter.push.calledOnce).to.be.true;
    expect(mockRouter.push.calledWith('/test-path')).to.be.true;
  });
});
