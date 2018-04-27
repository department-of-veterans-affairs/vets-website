// TODO: Move to Jean Pants when approved
import PropTypes from 'prop-types';
import React from 'react';
import _debounce from './debounce';
import uniqid from 'uniqid';

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileShow: false,
    };

    this.id = this.props.id || uniqid('va-breadcrumbs-');
    this.listId = this.props.listId || uniqid('va-breadcrumbs-list-');
    this.mobileWidth = this.props.mobileWidth || 425;

    this.debouncedToggleDisplay = this.debouncedToggleDisplay.bind(this);
    this.renderBreadcrumbLinks = this.renderBreadcrumbLinks.bind(this);
    this.renderMobileLink = this.renderMobileLink.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this, this.listId);
  }

  componentDidMount() {
    this.toggleDisplay();
    window.addEventListener('resize', this.debouncedToggleDisplay);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedToggleDisplay);
  }

  debouncedToggleDisplay = _debounce(() => {
    this.toggleDisplay();
  }, 500);

  toggleDisplay() {
    if (window.innerWidth <= this.mobileWidth) {
      this.setState({ mobileShow: true });
    } else {
      this.setState({ mobileShow: false });
    }
  }

  renderBreadcrumbLinks() {
    return React.Children.map(this.props.children, (child, i) => {
      if (i === this.props.children.length - 1) {
        return (
          <li>{React.cloneElement(child, {
            'aria-current': 'page',
          })}</li>
        );
      }

      return <li>{React.cloneElement(child)}</li>;
    });
  }

  renderMobileLink() {
    // The second to last link being sliced from the crumbs array
    // prop to create the "Back by one" mobile breadcrumb link
    return React.Children.map(this.props.children, (child, i) => {
      if (i === this.props.children.length - 2) {
        return (
          <li>{React.cloneElement(child, {
            'aria-label': `Previous page: ${child.props.children}`,
            className: 'va-nav-breadcrumbs-list__mobile-link',
          })}</li>
        );
      }

      return null;
    });
  }

  render() {
    const {
      ...breadcrumbProps
    } = this.props;
    // const mobileBreadcrumbLink = this.sliceMobileLink(crumbs);
    const mobileShow = this.state.mobileShow;
    const shownList = mobileShow
      ? (
        <ol
          className="row va-nav-breadcrumbs-list columns"
          id={`${this.listId}-clone`}>
          {this.renderMobileLink()}
        </ol>
      ) : (
        <ol
          className="row va-nav-breadcrumbs-list columns"
          id={this.listId}
          {...breadcrumbProps}>
          {this.renderBreadcrumbLinks()}
        </ol>
      );

    return (
      <nav
        aria-label="Breadcrumb"
        aria-live="polite"
        className="va-nav-breadcrumbs"
        id={this.id}>
        <p className="usa-sr-only">Breadcrumb navigation will usually show all page links. It will adjust to show only the previous page when zoomed in, or viewed on a mobile device.</p>
        { shownList }
      </nav>
    );
  }
}

Breadcrumbs.propTypes = {
  crumbs: PropTypes.array,
  id: PropTypes.string,
  listId: PropTypes.string,
  mobileWidth: PropTypes.number,
};

export default Breadcrumbs;
