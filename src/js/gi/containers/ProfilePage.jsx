import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { calculatedBenefits } from '../selectors/calculator';

export class ProfilePage extends React.Component {

  componentWillMount() {
    this.props.fetch(this.props.params.facility_code);
  }

  setPageTitleOnce() {
    const profileName = this.props.profile.attributes.name;
    const title = `${profileName} - GI Bill Comparison Tool`;
    if (profileName && window.document.title !== title) {
      this.props.setPageTitle(title);
    }
  }

  render() {
    // this.setPageTitleOnce();
    return (
      <div className="profile-page">
        <a onClick={() => this.props.showModal('cautionInfo')}>Caution Modal</a>
      </div>
    );
  }

}

const mapStateToProps = (state, props) => {
  return {
    calc: null //calculatedBenefits(state, props)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
    hideModal: () => {
      dispatch(actions.displayModal(null));
    },
    setPageTitle: (title) => {
      dispatch(actions.setPageTitle(title));
    },
    fetch: (facility_code) => {
      dispatch(actions.fetchProfile(facility_code));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
