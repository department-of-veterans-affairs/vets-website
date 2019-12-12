import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getData } from '../util/index';
import { getDependents } from '../redux/actions/index';
import ViewDependentsLayout from '../layouts/ViewDependentsLayout';

class ViewDependentsApp extends Component {
  state = {
    loading: true, // app starts in loading state
    error: null,
    onAwardDependents: null,
    notOnAwardDependents: null,
  };

  componentDidMount() {
    this.props.getDependents();
    this.makeAPICall();
    console.log(this.props.allState);
  }

  async makeAPICall() {
    

    
      // this will be changed to pass the error to the state and the child components when mockup is provided for error states
      this.setState({
        loading: false,
        onAwardDependents: [
          {
            name: 'Billy Blank',
            social: '312-243-5634',
            onAward: true,
            birthdate: '05-05-1983',
          },
          {
            name: 'Cindy See',
            social: '312-243-5634',
            onAward: true,
            birthdate: '05-05-1953',
            spouse: true,
          },
        ],
        notOnAwardDependents: [
          {
            name: 'Frank Fuzzy',
            social: '312-243-5634',
            birthdate: '05-05-1953',
          },
        ],
      });
    
  }

  render() {
    return (
      <ViewDependentsLayout
        loading={this.state.loading}
        error={this.state.error}
        onAwardDependents={this.state.onAwardDependents}
        notOnAwardDependents={this.state.notOnAwardDependents}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  message: state.message,
  allState: state,
});

const mapDispatchToProps = {
  getDependents
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewDependentsApp);
export { ViewDependentsApp };
