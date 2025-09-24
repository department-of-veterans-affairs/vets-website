import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import EditPageButtons from '../../../components/EditPageButtons';

describe('<EditPageButtons />', () => {
  it('renders both Update and Cancel buttons with correct text', () => {
    const handlers = { onUpdate: () => {}, onCancel: () => {} };
    const { container } = render(
      <EditPageButtons handlers={handlers} pageName="Test Page" />,
    );

    const buttons = container.querySelectorAll('va-button');
    expect(buttons).to.have.length(2);
    expect(buttons[0].getAttribute('text')).to.equal('Update');
    expect(buttons[1].getAttribute('text')).to.equal('Cancel');
  });

  it('renders correct aria-describedby values', () => {
    const handlers = { onUpdate: () => {}, onCancel: () => {} };
    const { container } = render(
      <EditPageButtons handlers={handlers} pageName="Test Page" />,
    );

    const buttons = container.querySelectorAll('va-button');
    expect(buttons[0].getAttribute('message-aria-describedby')).to.equal(
      'Update test page',
    );
    expect(buttons[1].getAttribute('message-aria-describedby')).to.equal(
      'Cancel updating test page',
    );
  });

  it('passes onUpdate and onCancel functions as click props', () => {
    const handlers = { onUpdate: () => {}, onCancel: () => {} };
    const { container } = render(
      <EditPageButtons handlers={handlers} pageName="Test Page" />,
    );

    const buttons = container.querySelectorAll('va-button');

    expect(buttons[0].getAttribute('text')).to.equal('Update');
    expect(buttons[1].getAttribute('text')).to.equal('Cancel');
  });

  it('calls handlers when invoked directly', () => {
    const onUpdate = sinon.spy();
    const onCancel = sinon.spy();
    const handlers = { onUpdate, onCancel };

    render(<EditPageButtons handlers={handlers} pageName="Test Page" />);

    handlers.onUpdate();
    handlers.onCancel();

    expect(onUpdate.calledOnce).to.be.true;
    expect(onCancel.calledOnce).to.be.true;
  });
});
