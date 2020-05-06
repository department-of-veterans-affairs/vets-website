// Adapted from https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

export default function asyncLoader(getComponent, message) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };
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
          <LoadingIndicator message={message || 'Loading page...'} />
        </div>
      );
    }
  };
}
