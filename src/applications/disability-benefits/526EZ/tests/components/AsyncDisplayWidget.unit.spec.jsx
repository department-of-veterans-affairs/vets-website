import React from 'react';

import { expect } from 'chai';
import { shallow } from 'enzyme';

import AsyncDisplayWidget from '../../components/AsyncDisplayWidget';


const viewComponent = () => <div id="view-component">View component</div>;

describe('AsyncDisplayWidget', () => {
  it('should throw an error if ui:options are not present', () => {
    expect(() => shallow(<AsyncDisplayWidget/>)).to.throw('No ui:options supplied');
  });

  it('should throw an error if viewComponent is not a React element', () => {
    const props = {
      options: {
        viewComponent: 'not a function'
      }
    };
    expect(() => shallow(<AsyncDisplayWidget {...props}/>)).to.throw('requires viewComponent');
  });

  it('should fire the callback provided', () => {});

  it('should throw an error if callback does not return a promise', () => {
    const props = {
      options: {
        viewComponent,
        callback: () => 'not a promise'
      }
    };
    expect(() => shallow(<AsyncDisplayWidget {...props}/>)).to.throw('callback to return a Promise');
  });

  it('should initially render a loading indicator', () => {
    const props = {
      options: {
        viewComponent,
        // May need to set a timeout if this proves flaky
        callback: () => Promise.resolve()
      }
    };
    const widget = shallow(<AsyncDisplayWidget {...props}/>);
    // It'll only show the LoadingIndicator for the briefest of moments
    expect(widget.find('LoadingIndicator').length).to.equal(1);
  });

  it('should render a failure message if the callback promise is rejected', () => {
    const props = {
      options: {
        viewComponent,
        // May need to set a timeout if this proves flaky
        callback: () => Promise.reject()
      }
    };
    const widget = shallow(<AsyncDisplayWidget {...props}/>);
    // After briefly flashing the LoadingIndicator, it'll display the error
    setTimeout(() => {
      expect(widget.find('AlertBox').length).to.equal(1);
    });
  });

  it('should render a custom failure message', () => {
    const failureComponent = () => <div>Failure</div>;
    const props = {
      options: {
        viewComponent,
        // May need to set a timeout if this proves flaky
        callback: () => Promise.reject(),
        failureComponent
      }
    };
    const widget = shallow(<AsyncDisplayWidget {...props}/>);
    // After briefly flashing the LoadingIndicator, it'll display the error
    setTimeout(() => {
      expect(widget.find('CustomAlert').length).to.equal(1);
    });
  });

  it('should render a the viewComponent if the callback promise is resolved', () => {
    const props = {
      options: {
        viewComponent,
        // May need to set a timeout if this proves flaky
        callback: () => Promise.resolve()
      }
    };
    const widget = shallow(<AsyncDisplayWidget {...props}/>);
    // After briefly flashing the LoadingIndicator, it'll display the viewComponent
    setTimeout(() => {
      expect(widget.find('#view-component').length).to.equal(1);
    });
  });

  it('should pass the callback return result to viewComponent', () => {
    const viewComponentProps = { prop1: 'adf', prop2: 'asdff' };
    const props = {
      options: {
        viewComponent,
        // May need to set a timeout if this proves flaky
        callback: () => Promise.resolve(viewComponentProps)
      }
    };
    const widget = shallow(<AsyncDisplayWidget {...props}/>);
    // After briefly flashing the LoadingIndicator, it'll display the viewComponent
    setTimeout(() => {
      expect(widget.find('#view-component').props).to.equal(viewComponentProps);
    });
  });
});
