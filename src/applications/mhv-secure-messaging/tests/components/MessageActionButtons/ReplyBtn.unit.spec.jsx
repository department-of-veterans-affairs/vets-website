import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import ReplyBtn from '../../../components/MessageActionButtons/ReplyBtn';

describe('ReplyBtn component', () => {
  it('renders without errors when visible is true', () => {
    const screen = render(<ReplyBtn visible onReply={() => {}} />);
    expect(screen).to.exist;
  });

  it('renders reply button text when visible', () => {
    const screen = render(<ReplyBtn visible onReply={() => {}} />);
    expect(screen.getByText('Reply')).to.exist;
  });

  it('does not render when visible is false', () => {
    const screen = render(<ReplyBtn visible={false} onReply={() => {}} />);
    expect(screen.queryByText('Reply')).to.not.exist;
  });

  it('calls onReply when clicked', () => {
    const onReplySpy = sinon.spy();
    const screen = render(<ReplyBtn visible onReply={onReplySpy} />);
    fireEvent.click(screen.getByTestId('reply-button-top'));
    expect(onReplySpy.calledOnce).to.be.true;
  });

  it('renders the reply button with data-testid', () => {
    const screen = render(<ReplyBtn visible onReply={() => {}} />);
    expect(screen.getByTestId('reply-button-top')).to.exist;
    expect(screen.getByTestId('reply-button-text')).to.exist;
  });

  it('renders the reply button text content', () => {
    const screen = render(<ReplyBtn visible onReply={() => {}} />);
    const buttonText = screen.getByTestId('reply-button-text');
    expect(buttonText.textContent).to.equal('Reply');
  });

  it('renders within a list item', () => {
    const { container } = render(<ReplyBtn visible onReply={() => {}} />);
    const li = container.querySelector('li');
    expect(li).to.exist;
  });

  it('renders a va-icon with undo icon', () => {
    const { container } = render(<ReplyBtn visible onReply={() => {}} />);
    const icon = container.querySelector('va-icon[icon="undo"]');
    expect(icon).to.exist;
  });
});
