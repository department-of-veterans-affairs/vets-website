import React from 'react';
import { connect } from 'react-redux';
import { removeInProgressForm } from '../../common/schemaform/save-load-actions';

import UserDataSection from '../components/UserDataSection';
import AuthApplicationSection from '../components/AuthApplicationSection';

import RequiredLoginView from '../../common/components/RequiredLoginView';

class UserProfileApp extends React.Component {

 handleClick = (formId) => {
   this.props.removeInProgressForm(formId, null);
 }

 render() {
   const view = (
     <div className="row user-profile-row">
       <div className="usa-width-two-thirds medium-8 small-12 columns">
         <h1>Your Account</h1>
         <div>
           <AuthApplicationSection
             userProfile={this.props.profile}
             verifyUrl={this.props.verifyUrl}
			        handleClick={this.handleClick}/>
           <UserDataSection/>
         </div>
       </div>
     </div>
   );

   return (
     <div>
       <RequiredLoginView
         authRequired={1}
         serviceRequired="user-profile"
         userProfile={this.props.profile}
         loginUrl={this.props.loginUrl}
         verifyUrl={this.props.verifyUrl}>
         {view}
       </RequiredLoginView>
     </div>
   );
 }
}

const mapStateToProps = (state) => {
  const userState = state.user;

  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};

const mapDispatchToProps = {
  removeInProgressForm
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
