import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { fireEvent } from '@testing-library/dom';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import TabItem from '../../components/TabItem';
import { renderWithRouter } from '../utils';

describe('<TabItem>', () => {
  it('should render tab', () => {
    const screen = renderWithRouter(
      <TabItem shortcut={1} title="Title" tabpath="appeals/1234567/status" />,
    );

    screen.getByText('Title');
  });

  it('should use id if present', () => {
    const screen = renderWithRouter(
      <TabItem
        shortcut={1}
        id="TitleHere"
        title="Title Here"
        tabpath="appeals/1234567/status"
      />,
    );

    screen.getByText('Title Here');
  });

  it('should run tabShortcut when keydown (Alt + 1) is pressed', () => {
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');

    const { container } = renderWithRouter(
      <TabItem
        shortcut={1}
        title="Title"
        tabpath="appeals/1234567/status"
        className="index-link"
      />,
    );

    const indexLink = $('.index-link', container);
    // Event Key Press
    // Note: this is selecting the 'Alt' + '1' which is '¡'
    // and meets the desired logic to go into the if statement
    fireEvent.keyDown(indexLink, {
      key: '¡',
      keyCode: 49,
      which: 49,
      code: 'Digit1',
      location: 0,
      altKey: true,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      repeat: false,
    });

    expect(addEventListenerSpy.called).to.be.true;
    addEventListenerSpy.restore();
  });

  it('should run tabShortcut when keydown (Alt) is pressed', () => {
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');

    const { container } = renderWithRouter(
      <TabItem
        shortcut={1}
        title="Title"
        tabpath="appeals/1234567/status"
        className="index-link"
      />,
    );

    const indexLink = $('.index-link', container);
    // Event Key Press
    // Note: this is selecting the 'Alt' key which meets the desired
    // logic to go into the else statement
    fireEvent.keyDown(indexLink, {
      key: 'Alt',
      keyCode: 18,
      which: 18,
      code: 'AltLeft',
      location: 1,
      altKey: true,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      repeat: false,
    });

    expect(addEventListenerSpy.called).to.be.true;
    addEventListenerSpy.restore();
  });
});
