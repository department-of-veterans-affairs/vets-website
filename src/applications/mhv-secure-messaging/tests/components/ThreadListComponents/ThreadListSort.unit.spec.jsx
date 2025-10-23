import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import ThreadListSort from '../../../components/ThreadList/ThreadListSort';
import { Paths, threadSortingOptions } from '../../../util/constants';

describe('Thread List Sort component', () => {
  const {
    SENT_DATE_DESCENDING,
    SENT_DATE_ASCENDING,
    DRAFT_DATE_DESCENDING,
    DRAFT_DATE_ASCENDING,
    SENDER_ALPHA_DESCENDING,
    SENDER_ALPHA_ASCENDING,
    RECEPIENT_ALPHA_DESCENDING,
    RECEPIENT_ALPHA_ASCENDING,
  } = threadSortingOptions;
  const props = {
    sortOrder: SENT_DATE_DESCENDING.value,
    sortCallback: () => {},
  };
  const setup = (path, defaultProps = props) => {
    return renderWithStoreAndRouter(<ThreadListSort {...defaultProps} />, {
      sm: {},
      reducers,
      path,
    });
  };

  it('renders properly on Inbox folder', () => {
    const screen = setup(Paths.INBOX);
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal(SENT_DATE_DESCENDING.value);
    expect(sortButton.getAttribute('text')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal(
      SENT_DATE_DESCENDING.value,
    );
    expect(screen.getByText('Oldest to newest').value).to.equal(
      SENT_DATE_ASCENDING.value,
    );
    expect(screen.getByText('A to Z - Sender’s name').value).to.equal(
      SENDER_ALPHA_ASCENDING.value,
    );
    expect(screen.getByText('Z to A - Sender’s name').value).to.equal(
      SENDER_ALPHA_DESCENDING.value,
    );
  });

  it('renders properly on Drafts folder', () => {
    const draftProps = {
      sortOrder: DRAFT_DATE_DESCENDING.value,
      sortCallback: () => {},
    };
    const screen = setup(Paths.DRAFTS, draftProps);
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal('Show drafts in this order');
    expect(sortSelectDropdown.value).to.equal(DRAFT_DATE_DESCENDING.value);
    expect(sortButton.getAttribute('text')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal(
      DRAFT_DATE_DESCENDING.value,
    );
    expect(screen.getByText('Oldest to newest').value).to.equal(
      DRAFT_DATE_ASCENDING.value,
    );
    expect(screen.getByText('A to Z - Recipient’s name').value).to.equal(
      RECEPIENT_ALPHA_ASCENDING.value,
    );
    expect(screen.getByText('Z to A - Recipient’s name').value).to.equal(
      RECEPIENT_ALPHA_DESCENDING.value,
    );
  });

  it('renders properly on Sent folder', () => {
    const sentProps = {
      sortOrder: SENT_DATE_DESCENDING.value,
      sortCallback: () => {},
    };
    const screen = setup(Paths.SENT, sentProps);
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal(SENT_DATE_DESCENDING.value);
    expect(sortButton.getAttribute('text')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal(
      SENT_DATE_DESCENDING.value,
    );
    expect(screen.getByText('Oldest to newest').value).to.equal(
      SENT_DATE_ASCENDING.value,
    );
    expect(screen.getByText('A to Z - Recipient’s name').value).to.equal(
      RECEPIENT_ALPHA_ASCENDING.value,
    );
    expect(screen.getByText('Z to A - Recipient’s name').value).to.equal(
      RECEPIENT_ALPHA_DESCENDING.value,
    );
  });

  it('renders properly on Trash folder', () => {
    const trashProps = {
      sortOrder: SENT_DATE_DESCENDING.value,
      sortCallback: () => {},
    };
    const screen = setup(Paths.DELETED, trashProps);
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal(SENT_DATE_DESCENDING.value);
    expect(sortButton.getAttribute('text')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal(
      SENT_DATE_DESCENDING.value,
    );
    expect(screen.getByText('Oldest to newest').value).to.equal(
      SENT_DATE_ASCENDING.value,
    );
    expect(screen.getByText('A to Z - Sender’s name').value).to.equal(
      SENDER_ALPHA_ASCENDING.value,
    );
    expect(screen.getByText('Z to A - Sender’s name').value).to.equal(
      SENDER_ALPHA_DESCENDING.value,
    );
  });

  it('renders properly on custom folder', () => {
    const screen = setup(`${Paths.FOLDERS}759063`);
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal(SENT_DATE_DESCENDING.value);
    expect(sortButton.getAttribute('text')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal(
      SENT_DATE_DESCENDING.value,
    );
    expect(screen.getByText('Oldest to newest').value).to.equal(
      SENT_DATE_ASCENDING.value,
    );
    expect(screen.getByText('A to Z - Sender’s name').value).to.equal(
      SENDER_ALPHA_ASCENDING.value,
    );
    expect(screen.getByText('Z to A - Sender’s name').value).to.equal(
      SENDER_ALPHA_DESCENDING.value,
    );
  });
});
