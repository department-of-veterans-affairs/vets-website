import React from 'react';
import { IndexLink, withRouter } from 'react-router';
import PropTypes from 'prop-types';

class TabItem extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.tabShortcut);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.tabShortcut);
  }

  // Grab the current URL, trim the leading '/', and return activeTabPath
  trimCurrentUrl = () => this.props.location?.pathname.slice(1);

  tabShortcut = evt => {
    if (evt.altKey && evt.which === 48 + this.props.shortcut) {
      this.props.router.push(this.props.tabpath);
    }
  };

  render() {
    const { id, tabpath, title } = this.props;
    const activeTab = this.trimCurrentUrl();

    return (
      <li>
        <IndexLink
          id={`tab${id || title}`}
          aria-current={activeTab === tabpath ? 'page' : null}
          activeClassName="tab--current"
          className="tab"
          to={tabpath}
        >
          <span>{title}</span>
        </IndexLink>
      </li>
    );
  }
}

TabItem.propTypes = {
  tabpath: PropTypes.string.isRequired,
  id: PropTypes.string,
  location: PropTypes.object,
  router: PropTypes.object,
  shortcut: PropTypes.number,
  title: PropTypes.string,
};

export default withRouter(TabItem);

export { TabItem };
