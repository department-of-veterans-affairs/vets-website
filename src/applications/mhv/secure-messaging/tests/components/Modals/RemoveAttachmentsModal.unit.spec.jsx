import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import RemoveAttachmentsModal from '../../../components/Modals/RemoveAttachmentModal';
import { Prompts } from '../../../util/constants';

describe('Remove Message Modal component', () => {
  it('should render without errors', () => {
    const screen = render(<RemoveAttachmentsModal visible />);

    expect(screen.getByTestId('remove-attachment-modal')).to.exist;
    expect(screen.getByText(Prompts.Attachment.REMOVE_ATTACHMENT_CONTENT)).to
      .exist;
    expect(screen.getByTestId('remove-attachment-modal')).to.have.attribute(
      'modal-title',
      `${Prompts.Attachment.REMOVE_ATTACHMENT_TITLE}`,
    );
    expect(screen.getByTestId('remove-attachment-modal')).to.have.attribute(
      'primary-button-text',
      'Remove',
    );
    expect(screen.getByTestId('remove-attachment-modal')).to.have.attribute(
      'secondary-button-text',
      'Cancel',
    );
    expect(screen.getByTestId('remove-attachment-modal')).to.have.attribute(
      'status',
      'warning',
    );
  });
});
