import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import { focusElement } from 'platform/utilities/ui';

class SearchBreadcrumbs extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    breadcrumbId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    breadcrumbId: 'search-breadcrumbs',
  };

  componentDidMount() {
    focusElement(`#${this.props.breadcrumbId}`);
  }

  getBreadcrumbs() {
    return [
      <a key="1" href="/">
        Home
      </a>,
      <a key="2" href="/search">
        Search Results for {this.props.query || '...'}
      </a>,
    ];
  }

  render() {
    return (
      <Breadcrumbs id={this.props.breadcrumbId}>
        {this.getBreadcrumbs()}
      </Breadcrumbs>
    );
  }
}

export default SearchBreadcrumbs;
