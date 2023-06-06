import React from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

class SearchBreadcrumbs extends React.Component {
  static propTypes = {
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
        Search VA.gov
      </a>,
    ];
  }

  render() {
    return (
      <va-breadcrumbs id={this.props.breadcrumbId}>
        {this.getBreadcrumbs()}
      </va-breadcrumbs>
    );
  }
}

export default SearchBreadcrumbs;
