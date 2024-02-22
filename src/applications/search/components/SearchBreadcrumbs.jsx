import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

class SearchBreadcrumbs extends React.Component {
  static defaultProps = {
    breadcrumbId: 'search-breadcrumbs',
  };

  componentDidMount() {
    focusElement(`#${this.props.breadcrumbId}`);
  }

  render() {
    return (
      <div className="row">
        <VaBreadcrumbs
          class="vads-u-margin-left--1p5"
          id={this.props.breadcrumbId}
          label="Breadcrumbs"
          uswds
          breadcrumbList={[
            {
              href: '/',
              label: 'Home',
            },
            {
              href: '/search',
              label: 'Search VA.gov',
            },
          ]}
        />
      </div>
    );
  }
}

SearchBreadcrumbs.propTypes = {
  breadcrumbId: PropTypes.string.isRequired,
};

export default SearchBreadcrumbs;
