import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { getByRole } from '@testing-library/dom';
import { expect } from 'chai';
import SaveCancelButtons from '../../../components/reviewPage/SaveCancelButtons';

describe('<SaveCancelButtons />', () => {
  let mockCloseSection;
  let mockScroll;
  const mockTitle = 'TestSection';
  const mockKeys = ['key1', 'key2'];

  beforeEach(() => {
    mockCloseSection = (...args) => {
      mockCloseSection.calls.push(args);
    };
    mockCloseSection.calls = [];

    mockScroll = (...args) => {
      mockScroll.calls.push(args);
    };
    mockScroll.calls = [];
  });

  it('renders without crashing', () => {
    render(
      <SaveCancelButtons
        closeSection={mockCloseSection}
        keys={mockKeys}
        title={mockTitle}
        scroll={mockScroll}
      />,
    );
  });

  it('renders Save and Cancel buttons', () => {
    render(
      <SaveCancelButtons
        closeSection={mockCloseSection}
        keys={mockKeys}
        title={mockTitle}
        scroll={mockScroll}
      />,
    );

    expect(getByRole(document.body, 'button', { name: 'Update TestSection' }))
      .to.exist;
    expect(getByRole(document.body, 'button', { name: 'Cancel' })).to.exist;
  });

  it('calls closeSection and scroll when Save button is clicked', () => {
    render(
      <SaveCancelButtons
        closeSection={mockCloseSection}
        keys={mockKeys}
        title={mockTitle}
        scroll={mockScroll}
      />,
    );

    const saveButton = getByRole(document.body, 'button', {
      name: 'Update TestSection',
    });
    fireEvent.click(saveButton);

    // Manually check that functions were called
    expect(mockCloseSection.calls.length).to.equal(1);
    expect(mockCloseSection.calls[0]).to.deep.equal([mockKeys, mockTitle]);

    expect(mockScroll.calls.length).to.equal(1);
    expect(mockScroll.calls[0]).to.deep.equal([
      `chapter${mockTitle}ScrollElement`,
    ]);
  });

  it('calls closeSection when Cancel button is clicked', () => {
    render(
      <SaveCancelButtons
        closeSection={mockCloseSection}
        keys={mockKeys}
        title={mockTitle}
        scroll={mockScroll}
      />,
    );

    const cancelButton = getByRole(document.body, 'button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockCloseSection.calls.length).to.equal(1);
    expect(mockCloseSection.calls[0]).to.deep.equal([mockKeys, mockTitle]);

    expect(mockScroll.calls.length).to.equal(0);
  });
});
