import React from 'react';
import { IndexLink } from 'react-router';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';

class TabItem extends React.Component {
  onKeyDown = e => {
    if (e.key === 'ArrowRight' && this.props.onNextTab) {
      this.props.onNextTab();
    } else if (e.key === 'ArrowLeft' && this.props.onPreviousTab) {
      this.props.onPreviousTab();
    } else if (e.key === 'ArrowDown') {
      focusElement(`#tabpanel${this.props.id}`);
    }
  };

  render() {
    const { id, tabpath, title, isActive } = this.props;

    const tabClasses = classNames(
      'vaos-appts__tab',
      'vads-u-background-color--gray-light-alt',
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
          id={`tab${id}`}
          aria-controls={isActive ? `tabpanel${id}` : null}
          aria-selected={isActive ? 'true' : 'false'}
          role="tab"
          className={tabClasses}
          tabIndex={isActive ? null : '-1'}
          onKeyDown={this.onKeyDown}
          activeClassName="vaos-appts__tab--current"
          to={tabpath}
        >
          {title}
        </IndexLink>
      </li>
    );
  }
}

export default TabItem;
