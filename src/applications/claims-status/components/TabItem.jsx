import React from 'react';
import { IndexLink, withRouter } from 'react-router';

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
    const { tabpath, title } = this.props;
    const activeTab = this.trimCurrentUrl();

    return (
      <li role="presentation">
        <IndexLink
          id={`tab${title}`}
          aria-controls={activeTab === tabpath ? `tabPanel${title}` : null}
          aria-selected={activeTab === tabpath}
          activeClassName="tab--current"
          className="tab"
          role="tab"
          to={tabpath}
        >
          {title}
        </IndexLink>
      </li>
    );
  }
}

export default withRouter(TabItem);

export { TabItem };
