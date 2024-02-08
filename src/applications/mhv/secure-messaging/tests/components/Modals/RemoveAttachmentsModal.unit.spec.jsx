import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import RemoveAttachmentsModal from '../../../components/Modals/RemoveAttachmentModal';
import { Prompts } from '../../../util/constants';
import { file } from '../../fixtures/attachment-file-response.json';

describe('Remove Message Modal component', () => {
  it('should render without errors', async () => {
    const screen = render(<RemoveAttachmentsModal visible file={file} />);
    const modal = await screen.getByTestId(`remove-attachment-modal`);

    expect(modal).to.exist;
    expect(screen.getByText(Prompts.Attachment.REMOVE_ATTACHMENT_CONTENT)).to
      .exist;
    expect(modal).to.have.attribute(
      'modal-title',
      `${Prompts.Attachment.REMOVE_ATTACHMENT_TITLE}`,
    );
    expect(screen.getByTestId('confirm-remove-attachment-button')).to.exist;
    expect(screen.getByTestId('cancel-remove-attachment-button')).to.exist;
    expect(modal).to.have.attribute('status', 'warning');
  });
});
