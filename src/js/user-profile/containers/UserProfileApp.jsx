import React from 'react';
import { connect } from 'react-redux';

import ProgressButton from '../../common/components/form-elements/ProgressButton';
import Modal from '../../common/components/Modal';

import { removeSavedForm } from '../actions/index';
import UserDataSection from '../components/UserDataSection';
import AuthApplicationSection from '../components/AuthApplicationSection';
import FormList from '../components/FormList';
import RequiredLoginView from '../../common/components/RequiredLoginView';

import { isSIPEnabledForm } from '../helpers';

class UserProfileApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

 removeForm = () => {
   this.toggleModal();
   this.props.removeSavedForm(this.state.formId);
 }

 toggleModal = (formId) => {
   this.setState({ formId, modalOpen: !this.state.modalOpen });
 }

 render() {
   const savedForms = this.props.profile.savedForms;
   const verifiedSavedForms = savedForms.filter(isSIPEnabledForm);
   const hasVerifiedSavedForms = !!verifiedSavedForms.length;

   const view = (
     <div className="row user-profile-row">
       <div className="usa-width-two-thirds medium-8 small-12 columns">
         <h1>Your Account</h1>
         <div>
           {hasVerifiedSavedForms && <FormList
             userProfile={this.props.profile}
             toggleModal={this.toggleModal}
             savedForms={verifiedSavedForms}/>}
           <AuthApplicationSection
             userProfile={this.props.profile}
             verifyUrl={this.props.verifyUrl}/>
           <UserDataSection/>
           <Modal
             cssClass="va-modal-large"
             id="start-over-modal"
             onClose={this.toggleModal}
             visible={this.state.modalOpen}>
             <h4>Are you sure?</h4>
             <p>If you delete this application, the information you entered will be lost.</p>
             <ProgressButton
               onButtonClick={this.removeForm}
               buttonText="Yes, delete it"
               buttonClass="usa-button-primary"/>
             <ProgressButton
               onButtonClick={this.toggleModal}
               buttonText="No, keep it"
               buttonClass="usa-button-outline"/>
           </Modal>
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
  removeSavedForm
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
