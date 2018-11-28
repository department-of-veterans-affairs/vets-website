import React from 'react';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { PENDING, RESOLVED, REJECTED } from '../constants';

/**
 * Handles the various display statuses when calling an asynchronous function.
 */
export default class AsyncDisplayWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      promiseState: PENDING,
    };

    // Make sure we configured it correctly
    // StringField passes 'ui:options' as the options prop
    const uiOptions = props.options;
    if (!uiOptions) {
      throw new Error('No ui:options supplied to AsyncDisplayWidget.');
    }

    if (typeof uiOptions.viewComponent !== 'function') {
      throw new Error(
        'AsyncDisplayWidget requires viewComponent in ui:options to be a React component.',
      );
    }

    if (
      uiOptions.failureComponent &&
      typeof uiOptions.failureComponent !== 'function'
    ) {
      throw new Error(
        'AsyncDisplayWidget requires the optional failureComponent in ui:options to be a React component.',
      );
    }

    if (typeof uiOptions.callback !== 'function') {
      throw new Error(
        'AsyncDisplayWidget requires callback in ui:options to be a function.',
      );
    }
  }

  componentDidMount() {
    // TODO: Don't call the callback _every_ time the component is mounted
    const cbPromise = this.props.options.callback();
    // instanceof Promise doesn't work in Firefox, so we just check for .then() and hope it's a promise
    if (cbPromise && typeof cbPromise.then === 'function') {
      cbPromise
        .then(data => {
          this.setState({
            data,
            promiseState: RESOLVED,
          });
        })
        .catch(data => {
          if (data instanceof Error) {
            throw data;
          }

          this.setState({
            data,
            promiseState: REJECTED,
          });
        });
    } else {
      throw new Error(
        `AsyncDisplayWidget: Expected callback to return a Promise, but got ${typeof cbPromise}.`,
      );
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
        content = <ViewComponent {...this.state.data} />;
        break;
      }
      case REJECTED: {
        // Show error message or error component passed in
        const CustomAlert = uiOptions.failureComponent;
        const { errorHeadline, errorContent } = uiOptions;
        // TODO: Get generic headline and content
        content = CustomAlert ? (
          <CustomAlert />
        ) : (
          <AlertBox
            status="error"
            isVisible
            headline={errorHeadline || 'We can’t find your information'}
            content={
              errorContent ||
              'We’re sorry. We can’t find your information in our system right now. Please try again later.'
            }
            className="async-display-widget-alert-box"
          />
        );
        break;
      }
      case PENDING:
      default: {
        // Show loading spinner or pending component passed in
        content = (
          <LoadingIndicator
            message={
              uiOptions.loadingMessage ||
              'Please wait while we load your information.'
            }
          />
        );
        break;
      }
    }

    return content;
  }
}
