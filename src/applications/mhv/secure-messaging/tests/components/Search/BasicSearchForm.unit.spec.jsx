import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import folderList from '../../fixtures/folder-response.json';
import reducer from '../../../reducers';
import BasicSearchForm from '../../../components/Search/BasicSearchForm';

describe('Basic search form', () => {
  const initialState = {
    sm: {
      folders: { folderList },
      search: {},
    },
  };

  const setup = keywordValue => {
    return renderWithStoreAndRouter(
      <BasicSearchForm testingKeyword={keywordValue} />,
      {
        initialState,
        reducers: reducer,
        path: `/search`,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays keyword field and folder select', () => {
    const screen = setup();
    const keyword = screen.getByTestId('keyword-text-input');
    const folderSelect = screen.getByTestId('folder-dropdown');
    expect(keyword).to.exist;
    expect(folderSelect).to.exist;
  });

  it('displays a search button', () => {
    const screen = setup();
    const searchButton = screen.getByRole('button', {
      name: 'Search',
    });
    expect(searchButton).to.exist;
  });

  it('displays error when form is submitted with no keyword', () => {
    const screen = setup();
    const searchButton = screen.getByRole('button', {
      name: 'Search',
    });
    fireEvent.click(searchButton);
    const keyword = screen.getByTestId('keyword-text-input');
    expect(keyword.error).to.equal('Please enter a keyword');
  });

  it('submits search form when submit button is clicked', () => {
    const screen = setup('test');
    const searchButton = screen.getByRole('button', {
      name: 'Search',
    });
    fireEvent.click(searchButton);
    const keyword = screen.getByTestId('keyword-text-input');
    expect(keyword.error).to.be.null;
  });
});
