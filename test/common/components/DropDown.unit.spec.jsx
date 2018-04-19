import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';

import DropDown from '../../../src/js/common/components/DropDown.jsx';

describe('<DropDown>', () => {
  let clickHandler;
  let container;
  let props;

  beforeEach(() => {
    clickHandler = sinon.stub();
    container = window.document.createElement('div');

    container.addEventListener = sinon.spy(container.addEventListener.bind(container));
    container.removeEventListener = sinon.spy(container.removeEventListener.bind(container));

    props = {
      buttonText: 'Button text',
      clickHandler,
      container,
      contents: (<h1>Hi</h1>),
      cssClass: 'testClass',
      isOpen: true,
      icon: (<svg><rect x="50" y="50" width="50" height="50"/></svg>),
      id: 'testId'
    };

    ReactDOM.render(<DropDown {...props}/>, container);
  });

  it('should render', () => {
    const dropdownDOM = ReactDOM.findDOMNode(container);
    expect(dropdownDOM).to.not.be.undefined;
  });

  it('should register event listeners on the parent element', () => {
    expect(container.addEventListener.called).to.be.true;
  });

  it('should call clickHandler when the parent element\'s click event occurs', () => {
    expect(clickHandler.called).to.be.false;
    container.dispatchEvent(new window.MouseEvent('click'));
    expect(clickHandler.called).to.be.true;
  });

  it('should unregister event listeners on the parent element', () => {
    ReactDOM.unmountComponentAtNode(container);
    expect(container.removeEventListener.called).to.be.true;
  });

});
