import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import DeleteMessageModal from '../../../components/Modals/DeleteMessageModal';
import { Prompts } from '../../../util/constants';

describe('Delete Message Modal component', () => {
  it('should render without errors', () => {
    const screen = render(<DeleteMessageModal visible />);

    expect(screen.findByText(Prompts.Message.DELETE_MESSAGE_CONFIRM));
    expect(screen.findByText(Prompts.Message.DELETE_MESSAGE_CONFIRM_NOTE));
    expect(screen.findByText('Confirm'));
    expect(screen.findByText('Cancel'));
  });
});
