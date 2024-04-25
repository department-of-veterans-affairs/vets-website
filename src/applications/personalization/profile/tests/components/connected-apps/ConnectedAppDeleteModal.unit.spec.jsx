import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { getVaButtonByText } from '~/applications/personalization/common/unitHelpers';
import { ConnectedAppDeleteModal } from '../../../components/connected-apps/ConnectedAppDeleteModal';

describe('<ConnectedAppDeleteModal />', () => {
  const defaultProps = {
    title: 'Sample App',
    modalOpen: true,
    closeModal: sinon.spy(),
    confirmDelete: sinon.spy(),
    deleting: false,
  };

  it('renders the modal and content', () => {
    const view = render(<ConnectedAppDeleteModal {...defaultProps} />);
    expect(view.container.querySelector('va-modal')).to.exist;

    expect(
      view.container.querySelector('va-modal[modalTitle="Disconnect app?"]'),
    ).to.exist;
    expect(view.getByText(/This may affect how useful the app is to you./i)).to
      .exist;
  });

  it('renders the buttons correctly when not deleting', () => {
    const view = render(<ConnectedAppDeleteModal {...defaultProps} />);
    expect(getVaButtonByText('Disconnect', view)).to.be.ok;
    expect(getVaButtonByText('No, cancel this change', view)).to.be.ok;
  });

  it('renders a disabled button when deleting', () => {
    const view = render(<ConnectedAppDeleteModal {...defaultProps} deleting />);
    expect(getVaButtonByText('Processing update...', view)).to.exist;
  });
});
