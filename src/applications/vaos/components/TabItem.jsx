import React from 'react';
import { IndexLink, withRouter } from 'react-router';
import classNames from 'classnames';

class TabItem extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.tabShortcut);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.tabShortcut);
  }

  tabShortcut = evt => {
    if (evt.altKey && evt.which === 48 + this.props.shortcut) {
      this.props.router.push(this.props.tabpath);
    }
  };

  render() {
    const { id, tabpath, title } = this.props;
    const activeTab = this.props.location.pathname;

    const tabClasses = classNames(
      'vaos-appts__tab',
      'vads-u-display--inline-block',
      'vads-u-text-align--center',
      'vads-u-color--gray-dark',
    );

    return (
      <li
        role="presentation"
        className="vads-u-display--inline-block vads-u-margin--0"
      >
        <IndexLink
          id={`tab${id || title}`}
          aria-controls={activeTab === tabpath ? `tab${id || title}` : null}
          aria-selected={activeTab === tabpath}
          role="tab"
          className={tabClasses}
          activeClassName="vaos-appts__tab--current"
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
