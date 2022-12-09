import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class TabItem extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.tabShortcut);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.tabShortcut);
  }

  // Grab the current URL, trim the leading '/', and return activeTabPath
  trimCurrentUrl = () => this.props.location.pathname;

  tabShortcut = evt => {
    if (evt.altKey && evt.which === 48 + this.props.shortcut) {
      this.props.history.push(this.props.tabpath);
    }
  };

  render() {
    const { className, id, tabpath, title } = this.props;
    const activeTab = this.trimCurrentUrl();
    return (
      <li className={className} role="presentation">
        <NavLink
          id={`tab${id || title}`}
          aria-controls={
            activeTab === tabpath ? `tabPanel${id || title}` : null
          }
          aria-selected={activeTab === tabpath}
          role="tab"
          className="va-tab-trigger"
          activeClassName="va-tab-trigger--current"
          to={tabpath}
        >
          {title}
        </NavLink>
      </li>
    );
  }
}

export default withRouter(TabItem);

export { TabItem };
