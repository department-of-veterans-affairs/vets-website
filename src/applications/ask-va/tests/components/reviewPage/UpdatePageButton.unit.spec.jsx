import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import UpdatePageButton from '../../../components/reviewPage/UpdatePageButton';

describe('<UpdatePageButton />', () => {
  let mockScroll;
  const mockTitle = 'TestSection';
  const mockKeys = ['key1', 'key2'];

  beforeEach(() => {
    mockScroll = (...args) => {
      mockScroll.calls.push(args);
    };
    mockScroll.calls = [];
  });

  it('renders without crashing', () => {
    render(
      <UpdatePageButton
        keys={mockKeys}
        title={mockTitle}
        scroll={mockScroll}
      />,
    );
  });

  it('Renders the correct button', () => {
    const { container } = render(
      <UpdatePageButton
        keys={mockKeys}
        title={mockTitle}
        scroll={mockScroll}
      />,
    );

    const updateButton = $('va-button', container);

    expect(updateButton).to.exist;
    expect(updateButton.getAttribute('text')).to.eq('Update page');
  });

  it('calls closeSection and scroll when "Update page" button is clicked', () => {
    const mockCloseSection = sinon.spy();

    const { container } = render(
      <UpdatePageButton
        closeSection={mockCloseSection}
        keys={mockKeys}
        title={mockTitle}
        scroll={mockScroll}
      />,
    );

    const updateButton = $('va-button', container);
    expect(updateButton).to.exist;

    fireEvent.click(updateButton);

    // Manually check that functions were called
    expect(mockCloseSection.calledOnce).to.be.true;
    expect(mockCloseSection.calledWith(mockKeys, mockTitle)).to.be.true;

    expect(mockScroll.calls.length).to.equal(1);
    expect(mockScroll.calls[0]).to.deep.equal([
      `chapter${mockTitle}ScrollElement`,
    ]);
  });
});
