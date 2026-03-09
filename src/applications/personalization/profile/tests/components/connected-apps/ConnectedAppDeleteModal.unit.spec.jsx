import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
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
      view.container.querySelector('va-modal[modal-title="Disconnect app?"]'),
    ).to.exist;
    expect(view.getByText(/This may affect how useful the app is to you./i)).to
      .exist;
  });
});
