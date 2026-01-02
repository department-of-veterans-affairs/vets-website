import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import ReplyBtn from '../../../components/MessageActionButtons/ReplyBtn';

describe('ReplyBtn component', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('renders without errors when visible is true', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    expect(screen).to.exist;
  });

  it('does not render when visible is false', () => {
    const mockProps = {
      visible: false,
      onReply: sinon.spy(),
    };
    const { container } = render(<ReplyBtn {...mockProps} />);
    expect(container.firstChild).to.be.null;
  });

  it('does not render when visible is undefined/not provided', () => {
    const mockProps = {
      onReply: sinon.spy(),
    };
    const { container } = render(<ReplyBtn {...mockProps} />);
    expect(container.firstChild).to.be.null;
  });

  it('renders reply button with correct text when visible', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    const replyButton = screen.getByText('Reply');
    expect(replyButton).to.exist;
  });

  it('has correct data-testid attributes', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    expect(screen.getByTestId('reply-button-top')).to.exist;
    expect(screen.getByTestId('reply-button-text')).to.exist;
  });

  it('applies correct CSS classes to button', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    const button = screen.getByTestId('reply-button-top');
    expect(button).to.have.class('usa-button-secondary');
    expect(button).to.have.class('vads-u-display--flex');
    expect(button).to.have.class('vads-u-flex-direction--row');
    expect(button).to.have.class('vads-u-justify-content--center');
    expect(button).to.have.class('vads-u-align-items--center');
  });

  it('contains va-icon with correct icon', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    const icon = screen.container.querySelector('va-icon[icon="undo"]');
    expect(icon).to.exist;
    expect(icon).to.have.attribute('aria-hidden', 'true');
  });

  it('calls onReply function when button is clicked', () => {
    const onReplySpy = sinon.spy();
    const mockProps = {
      visible: true,
      onReply: onReplySpy,
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    const button = screen.getByTestId('reply-button-top');
    
    fireEvent.click(button);
    
    expect(onReplySpy.calledOnce).to.be.true;
  });

  it('does not call onReply when onReply is not provided', () => {
    const mockProps = {
      visible: true,
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    const button = screen.getByTestId('reply-button-top');
    
    // Should not throw error when clicking
    expect(() => fireEvent.click(button)).to.not.throw();
  });

  it('renders as a list item when visible', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const { container } = render(<ReplyBtn {...mockProps} />);
    const listItem = container.querySelector('li');
    expect(listItem).to.exist;
    expect(listItem.firstChild).to.have.attribute('data-testid', 'reply-button-top');
  });

  it('button has correct type attribute', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    const button = screen.getByTestId('reply-button-top');
    expect(button).to.have.attribute('type', 'button');
  });

  it('text span has correct class and test id', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const screen = render(<ReplyBtn {...mockProps} />);
    const textSpan = screen.getByTestId('reply-button-text');
    expect(textSpan).to.have.class('message-action-button-text');
    expect(textSpan.textContent).to.equal('Reply');
  });

  it('icon container has correct margin class', () => {
    const mockProps = {
      visible: true,
      onReply: sinon.spy(),
    };
    const { container } = render(<ReplyBtn {...mockProps} />);
    const iconContainer = container.querySelector('.vads-u-margin-right--0p5');
    expect(iconContainer).to.exist;
    expect(iconContainer.querySelector('va-icon')).to.exist;
  });
});