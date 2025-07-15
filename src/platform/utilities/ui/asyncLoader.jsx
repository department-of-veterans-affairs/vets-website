// Adapted from https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
import React from 'react';
// import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

export default function asyncLoader(getComponent, message) {
  if (process.env.NODE_ENV !== 'production' && !window.vaAsyncLoaderWarned) {
    // eslint-disable-next-line no-console
    console.warn(
      'DEPRECATION: asyncLoader is being phased out. Please migrate to React.lazy + Suspense or lazyRoute().',
    );
    window.vaAsyncLoaderWarned = true;
  }
  return class AsyncComponent extends React.Component {
    static Component = null;

    constructor(props) {
      super(props);
      this.state = { Component: AsyncComponent.Component };
    }

    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillMount() {
      if (!this.state.Component) {
        this.componentPromise = getComponent()
          .then(m => {
            if (m.default) {
              return m.default;
            }

            return m;
          })
          .then(Component => {
            AsyncComponent.Component = Component;
            this.setState({ Component });
          });
      } else if (!this.componentPromise) {
        this.componentPromise = Promise.resolve();
      }
    }

    render() {
      const { Component } = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return (
        <div className="async-loader">
          <va-loading-indicator message={message || 'Loading page...'} />
        </div>
      );
    }
  };
}
