import React from 'react';
import { connect } from 'react-redux';
import CollapsiblePanel from '@department-of-veterans-affairs/formation/CollapsiblePanel';

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isMobile: false};

    //{date: new Date()};
  }

  // check for and set state on mount
  // bring in the footer code (hardcoded for now)
  // set and unset dynamic classes depending on window resize
  // those classes should trigger uswds' accordion code
  // you might need to rewrite the markup

  componentDidMount() {

    console.log('state your width: ', window.innerWidth, this.state.isMobile);
    window.addEventListener('resize', () => {

        console.log( 'hello footer world', window.innerWidth, this.state.isMobile);

      this.setState({
        isMobile: window.innerWidth < 767
      });

    }, false);

  }

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }


  render() {
    const className = this.state.isMobile ? 'mobile' : '';

    return (
      <div>
        <h3 className={className}>I am a footer</h3>
      </div>
    );
  }
}

/* const mapStateToProps = (state) => {
  return {
    currentlyLoggedIn: isLoggedIn(state),
    isProfileLoading: isProfileLoading(state),
    isLOA3: isLOA3(state),
    userGreeting: selectUserGreeting(state),
    ...state.navigation
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  updateLoggedInStatus,
  initializeProfile
}; */

const mapDispatchToProps = () => {
  return {};
};

export default connect (mapDispatchToProps)(Main);
