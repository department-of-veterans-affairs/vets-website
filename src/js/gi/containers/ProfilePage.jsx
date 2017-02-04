import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

export class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.renderPageTitle = this.renderPageTitle.bind(this);
  }

  renderPageTitle() {
    const schoolName = this.props.institution.name;
    document.title = `${schoolName} - GI Bill Comparison Tool`;
  }

  renderOutcomeMeasuresLink() {
    return (
      <span>
        <p>Access a comprehensive spreadsheet of <a id="veteran-outcome-spreadsheet-link-out" title="Veteran Outcome Measures" href="http://www.benefits.va.gov/gibill/docs/OutcomeMeasuresDashboard.xlsx" target="_blank">Veteran Outcome Measures</a> (<i className="fa fa-file-excel-o info-icons"></i> | 14.4 MB)</p>
      </span>
    );
  }

  render() {
    this.renderPageTitle();
    return (
      <div className="profile-page">
        <a onClick={() => this.props.showModal('cautionInfo')}>Caution Modal</a>
      </div>
    );
  }
}

ProfilePage.defaultProps = {
  institution: { name: 'SOME SCHOOL NAME' },
};

ProfilePage.propTypes = {
  institution: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
    hideModal: () => {
      dispatch(actions.displayModal(null));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
