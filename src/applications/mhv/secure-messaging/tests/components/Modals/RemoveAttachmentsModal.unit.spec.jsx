import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import RemoveAttachmentsModal from '../../../components/Modals/RemoveAttachmentModal';
import { Prompts } from '../../../util/constants';

describe('Remove Message Modal component', () => {
  it('should render without errors', () => {
    const screen = render(<RemoveAttachmentsModal visible />);

    expect(screen.findByText(Prompts.Attachment.REMOVE_ATTACHMENT_TITLE));
    expect(screen.findByText(Prompts.Attachment.REMOVE_ATTACHMENT_CONTENT));
    expect(screen.findByText('Remove'));
    expect(screen.findByText('Cancel'));
  });
});
