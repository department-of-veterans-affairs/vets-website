import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PendingDocuments from '../../components/PendingDocuments';
import { PENDING_DOCUMENTS_TITLE } from '../../constants/index';

describe('<PendingDocuments>', () => {
  it('renders the loading indicator when loading is true', () => {
    const wrapper = mount(<PendingDocuments loading pendingDocuments={[]} />);
    expect(wrapper.find('va-loading-indicator').prop('message')).to.equal(
      'Loading Pending Documents...',
    );
    wrapper.unmount();
  });

  it('renders no pending documents statement when there are no pending documents', () => {
    const wrapper = mount(
      <PendingDocuments loading={false} pendingDocuments={[]} />,
    );
    const expectedTextContent = 'We currently do not show a claim pending.';
    expect(wrapper.text()).to.include(expectedTextContent);
    wrapper.unmount();
  });

  it('renders pending documents statement and document info when there are pending documents', () => {
    const pendingDocuments = [
      {
        docType: '1990',
      },
    ];
    const wrapper = mount(
      <PendingDocuments loading={false} pendingDocuments={pendingDocuments} />,
    );
    expect(wrapper.text()).to.include(
      'The following document is currently being processed for your account.',
    );
    expect(wrapper.text()).to.include(
      'Application for Benefits (VA Form 22-1990)',
    );
    wrapper.unmount();
  });

  it('renders no pending documents when a bad docType is passed', () => {
    const pendingDocuments = [
      {
        docType: 'XXXX',
      },
    ];
    const wrapper = mount(
      <PendingDocuments loading={false} pendingDocuments={pendingDocuments} />,
    );
    expect(wrapper.text()).to.include(
      'We currently do not show a claim pending.',
    );
    wrapper.unmount();
  });

  it('renders the title correctly', () => {
    const wrapper = mount(
      <PendingDocuments loading={false} pendingDocuments={[]} />,
    );
    expect(wrapper.find('.vads-u-font-size--h2').text()).to.equal(
      PENDING_DOCUMENTS_TITLE,
    );
    wrapper.unmount();
  });
});
