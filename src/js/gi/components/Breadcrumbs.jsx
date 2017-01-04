import React from 'react';

class Breadcrumbs extends React.Component {

  renderDefault(props) {
    return (
      <li className="active">{props.currentLabel}</li>
    );
  }

  renderNamed(props) {
    return (
      <span>
        <li><a href="/gi-bill-comparison-tool/">GI Bill Comparison Tool</a></li>
        <li className="active">{props.currentLabel}</li>
      </span>
    );
  }

  render() {
    const defaultCondition = (this.props.currentLabel === 'GI Bill Comparison Tool');
    const crumbs = (defaultCondition ? this.renderDefault : this.renderNamed);
    return (
      <nav className="va-nav-breadcrumbs">
        <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
          <li><a href="/">Home</a></li>
          <li><a href="/education/">Education Benefits</a></li>
          <li><a href="/education/gi-bill/">GI Bill</a></li>
          {crumbs(this.props)}
        </ul>
      </nav>
    );
  }

}

Breadcrumbs.propTypes = {
  currentLabel: React.PropTypes.string
};

Breadcrumbs.defaultProps = {
  currentLabel: 'GI Bill Comparison Tool'
};

export default Breadcrumbs;
