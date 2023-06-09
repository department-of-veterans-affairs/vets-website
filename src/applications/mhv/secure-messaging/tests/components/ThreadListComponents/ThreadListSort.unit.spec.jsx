import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import ThreadListSort from '../../../components/ThreadList/ThreadListSort';
import { Paths, threadSortingOptions } from '../../../util/constants';

describe('Thread List Sort component', () => {
  const props = {
    defaultSortOrder: threadSortingOptions.DESCENDING,
    setSortOrder: () => {},
    setSortBy: () => {},
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
    const screen = setup('/inbox');
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal('DESC');
    expect(sortButton.getAttribute('label')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal('DESC');
    expect(screen.getByText('Oldest to newest').value).to.equal('ASC');
    expect(screen.getByText('A to Z - Sender’s name').value).to.equal(
      'sender-alpha-asc',
    );
    expect(screen.getByText('Z to A - Sender’s name').value).to.equal(
      'sender-alpha-desc',
    );
  });

  it('renders properly on Drafts folder', () => {
    const screen = setup('/drafts');
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal('DESC');
    expect(sortButton.getAttribute('label')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal('DESC');
    expect(screen.getByText('Oldest to newest').value).to.equal('ASC');
    expect(screen.getByText('A to Z - Recipient’s name').value).to.equal(
      'recepient-alpha-asc',
    );
    expect(screen.getByText('Z to A - Recipient’s name').value).to.equal(
      'recepient-alpha-desc',
    );
  });

  it('renders properly on Sent folder', () => {
    const screen = setup('/sent');
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal('DESC');
    expect(sortButton.getAttribute('label')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal('DESC');
    expect(screen.getByText('Oldest to newest').value).to.equal('ASC');
    expect(screen.getByText('A to Z - Recipient’s name').value).to.equal(
      'recepient-alpha-asc',
    );
    expect(screen.getByText('Z to A - Recipient’s name').value).to.equal(
      'recepient-alpha-desc',
    );
  });

  it('renders properly on Trash folder', () => {
    const screen = setup('/trash');
    expect(screen).to.exist;

    const sortSelectDropdown = document.querySelector('va-select');
    const sortButton = document.querySelector('va-button');

    expect(sortSelectDropdown.label).to.equal(
      'Show conversations in this order',
    );
    expect(sortSelectDropdown.value).to.equal('DESC');
    expect(sortButton.getAttribute('label')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal('DESC');
    expect(screen.getByText('Oldest to newest').value).to.equal('ASC');
    expect(screen.getByText('A to Z - Sender’s name').value).to.equal(
      'sender-alpha-asc',
    );
    expect(screen.getByText('Z to A - Sender’s name').value).to.equal(
      'sender-alpha-desc',
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
    expect(sortSelectDropdown.value).to.equal('DESC');
    expect(sortButton.getAttribute('label')).to.equal('Sort');

    expect(screen.getByText('Newest to oldest').value).to.equal('DESC');
    expect(screen.getByText('Oldest to newest').value).to.equal('ASC');
    expect(screen.getByText('A to Z - Sender’s name').value).to.equal(
      'sender-alpha-asc',
    );
    expect(screen.getByText('Z to A - Sender’s name').value).to.equal(
      'sender-alpha-desc',
    );
  });
});
