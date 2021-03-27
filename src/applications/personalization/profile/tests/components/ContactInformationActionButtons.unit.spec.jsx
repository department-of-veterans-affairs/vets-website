import React from 'react';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ContactInformationActionButtons from '@@profile/components/personal-information/ContactInformationActionButtons';

describe('<ContactInformationActionButtons/>', () => {
  function defaultProps() {
    return {
      isLoading: false,
      onDelete() {},
      title: 'TITLE_ATTRIBUTE',
      deleteEnabled: true,
    };
  }

  let props;

  beforeEach(() => {
    props = defaultProps();
  });

  it('renders correctly when deleteEnabled is true', () => {
    const view = render(
      <ContactInformationActionButtons {...props}>
        <p>Children</p>
      </ContactInformationActionButtons>,
    );

    expect(view.getByText('Children')).to.exist;
    expect(view.getByRole('button', { name: /Remove title_attribute/ })).to
      .exist;
  });

  it('renders correctly when deleteEnabled is false', () => {
    props.deleteEnabled = false;
    const view = render(
      <ContactInformationActionButtons {...props}>
        <p>Children</p>
      </ContactInformationActionButtons>,
    );

    expect(view.getByText('Children')).to.exist;
    expect(view.queryByRole('button', { name: /remove/i })).to.not.exist;
  });

  it('handles the deletion flow', () => {
    const onDeleteSpy = sinon.spy();
    props.onDelete = onDeleteSpy;
    const view = render(
      <ContactInformationActionButtons {...props}>
        <p>Children</p>
      </ContactInformationActionButtons>,
    );

    // start the deletion flow
    userEvent.click(view.getByRole('button', { name: /remove/i }));
    // make sure the UI has changed
    expect(view.queryByText('Children')).to.not.exist;
    expect(view.queryByRole('button', { name: /remove/i })).to.not.exist;
    expect(view.getByText(/Are you sure/i)).to.exist;
    expect(view.getByText(/This will delete your title_attribute/i)).to.exist;

    // cancel the deletion flow
    userEvent.click(view.getByRole('button', { name: /cancel/i }));
    // mke sure the UI has returned to its previous start
    expect(view.getByText('Children')).to.exist;
    expect(view.getByRole('button', { name: /remove/i })).to.exist;
    expect(view.queryByText(/Are you sure/i)).to.not.exist;

    // start the deletion flow again
    userEvent.click(view.getByRole('button', { name: /remove/i }));
    // and make sure it works
    userEvent.click(view.getByRole('button', { name: /confirm/i }));
    expect(onDeleteSpy.calledOnce).to.be.true;
  });
});
