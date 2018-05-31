import React from 'react';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';


/**
 * Handles the various display statuses when calling an asynchronous function.
 */
export default class AsyncDisplayWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      promiseState: PENDING
    };

    // Make sure we configured it correctly
    // StringField passes 'ui:options' as the options prop
    const uiOptions = props.options;
    if (!uiOptions) {
      throw new Error('No ui:options supplied to AsyncDisplayWidget.');
    }

    if (typeof uiOptions.viewComponent !== 'function') {
      throw new Error('AsyncDisplayWidget requires viewComponent in ui:options to be a React element.');
    }

    if (typeof uiOptions.callback !== 'function') {
      throw new Error('AsyncDisplayWidget requires callback in ui:options to be a function.');
    }

    // TODO: Don't call the callback _every_ time the component is mounted
    const cbPromise = uiOptions.callback();
    if (cbPromise instanceof Promise) {
      cbPromise.then((data) => {
        this.setState({
          data,
          promiseState: RESOLVED
        });
      }).catch((data) => {
        if (data instanceof Error) {
          throw data;
        }

        this.setState({
          data,
          promiseState: REJECTED
        });
      });
    } else {
      throw new Error(`AsyncDisplayWidget: Expected callback to return a Promise, but got ${typeof cbPromise}.`);
    }
  }


  // Not sure if this will be useful yet
  // componentDidUnmount() {
  //   // Cancel the promise if it isn't already fulfilled
  // }


  render() {
    const uiOptions = this.props.options;

    // Depending on the state of the promise, we'll render different things
    let content;
    switch (this.state.promiseState) {
      case RESOLVED: {
        // Show view component
        const ViewComponent = uiOptions.viewComponent;
        content = (<ViewComponent {...this.state.data}/>);
        break;
      }
      case REJECTED: {
        // Show error message or error component passed in
        const CustomAlert = uiOptions.failureComponent;
        // TODO: Get generic headline and content
        content = CustomAlert || (
          <AlertBox
            status="error"
            isVisible
            headline="We're sorry, we can't seem to find your information right now."
            content="That's a real bummer, we know. Maybe try again later."
            className="fetch-fail-alert"/>
        );
        break;
      }
      case PENDING:
      default: {
        // Show loading spinner or pending component passed in
        const loadingMessage = uiOptions.loadingMessage || 'Loading...';
        content = (<LoadingIndicator message={loadingMessage}/>);
        break;
      }
    }

    return content;
  }
}
