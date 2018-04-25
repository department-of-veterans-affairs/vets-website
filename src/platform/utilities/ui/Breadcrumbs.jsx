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

    this.debouncedToggleDisplay = this.debouncedToggleDisplay.bind(this);
    this.sliceMobileLink = this.sliceMobileLink.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this, this.listId);
  }

  componentDidMount() {
    this.toggleDisplay();
    window.addEventListener('resize', this.debouncedToggleDisplay);
  }

  // TODO: Figure out how to force update, but only if props updated

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedToggleDisplay);
  }

  debouncedToggleDisplay = _debounce(() => {
    this.toggleDisplay();
  }, 500)

  sliceMobileLink(targetArr) {
    // The second to last link being sliced to pull
    // off the "Back by one" mobile breadcrumb handling
    const breadcrumbList = targetArr.slice(-2, -1);

    return breadcrumbList;
  }

  toggleDisplay() {
    if (window.innerWidth <= 425) {
      this.setState({ mobileShow: true });
    } else {
      this.setState({ mobileShow: false });
    }
  }

  render() {
    const {
      crumbs,
      ...breadcrumbProps
    } = this.props;
    const mobileBreadcrumbLink = this.sliceMobileLink(crumbs);
    const mobileViewport = this.state.mobileShow;
    const shownList = mobileViewport
      ? (<ol
        className="row va-nav-breadcrumbs-list columns"
        id={`${this.listId}-clone`}
        {...breadcrumbProps}>
        {mobileBreadcrumbLink.map((c, i) => {
          return (
            <li
              className="va-nav-breadcrumbs-list__mobile-link"
              key={i}>
              <a
                aria-label={`Previous Step ${c.props.children}`}
                href={c.props.href}>
                {c.props.children}
              </a>
            </li>
          );
        })}
      </ol>
      ) : (<ol
        className="row va-nav-breadcrumbs-list columns"
        id={this.listId}
        {...breadcrumbProps}>
        {crumbs.map((c, i) => {
          return (
            <li key={i}>
              <a
                aria-current={i === crumbs.length - 1 ? 'page' : null}
                href={c.props.href}>
                {c.props.children}
              </a>
            </li>
          );
        })}
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
  crumbs: PropTypes.array.isRequired,
  id: PropTypes.string,
  listId: PropTypes.string,
};

export default Breadcrumbs;
