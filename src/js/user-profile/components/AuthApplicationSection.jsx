import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { handleVerify } from '../../common/helpers/login-helpers.js';
import { dateDiffDesc } from '../../common/utils/helpers';

class AuthApplicationSection extends React.Component {
  verifyUser = () => {
    handleVerify(this.props.verifyUrl);
  }

  render() {
    let content;
    const verifiedAccountType = 3;// verified ID.me accounts are type 3
    const isVerifiedUser = this.props.userProfile.accountType === verifiedAccountType;
    const savedForms = this.props.userProfile.savedForms;
    const hasSavedForms = !!savedForms;
    
    //TODO:  (ceh) verify edu and burial form codes
    const formTitles = {
    '21P-527EZ': {title: 'Veterans pension benefits (21P-527EZ)', link: '/pension/application/527EZ/introduction'}, 
    '21P-530': {title: 'burial benefits (21P-530)', link: '/burials-and-memorials/application/530/introduction'},
    '1010ez': {title: 'health care (10-10EZ)', link: '/health-care/apply/application/introduction'},
    '22-1990': {title: 'education benefits (22-1990)', link: '/education/apply-for-education-benefits/application/1990/introduction'},
    '22-1990E': {title: 'education benefits (22-1990E)', link: '/education/apply-for-education-benefits/application/1990e/introduction'},
    '22-1990N': {title: 'education benefits (22-1990N)', link: '/education/apply-for-education-benefits/application/1990n/introduction'},
    '22-1995': {title: 'education benefits (22-1995)', link: '/education/apply-for-education-benefits/application/1995/introduction'},
    '22-5490': {title: 'education benefits (22-5490)', link: '/education/apply-for-education-benefits/application/5490/introduction'},
    '22-5495': {title: 'education benefits (22-5495)', link: '/education/apply-for-education-benefits/application/5495/introduction'}
    };

    //TODO:(ceh) wire delete button up to removeInProgressForm
    function formItem(savedFormData, index) {
      console.log('insideformitem', savedFormData);
      const {last_updated: lastSavedDate, expires_at} = savedFormData.metadata;
      const expirationDate = moment.unix(expires_at);
      console.log(lastSavedDate, expirationDate);
      return (
      <div key={index} className='card information'>
	<strong>Application for {formTitles[savedFormData.form].title}</strong><br/>
        {!!lastSavedDate && !!expirationDate && <p>Last saved on {moment(lastSavedDate).format('M/D/YYYY [at] h:mm a')}<span className="schemaform-sip-expires">Your saved application will expire in {dateDiffDesc(expirationDate)}.</span></p>}
	<a className=" usa-button-primary" href={formTitles[savedFormData.form].link}>Resume application</a>      
        <div>
          <i className="fa fa-trash"></i><span>Delete</span>
        </div>      
</div>
      )
    }



    const formList = (
      <div>
        <h4 className="section-header">Saved applications</h4>
        {savedForms.map(formItem)}
      </div>
    );

    if (isVerifiedUser) {
      content = (
        <div className="medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/health-care/apply">Apply for health care</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for Education Benefits</a></p>
          <p><a href="/health-care/prescriptions">Refill your prescription</a></p>
          <p><a href="/health-care/messaging">Message your health care team</a></p>
          <p><a href="/health-care/health-records">Get your VA health records</a></p>
          <p><a href="/track-claims">Check your claim and appeal status</a></p>
          <p><a href="/education/gi-bill/post-9-11/ch-33-benefit">Get your Post-9/11 GI Bill statement of benefits</a></p>
        </div>
      );
    } else {
      content = (
        <div className="medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/health-care/apply">Apply for health care</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for education benefits</a></p>
          <p><span className="label">You need to <button className="va-button-link" onClick={this.verifyUser}>verify your account</button> in order to:</span></p>
          <p>Refill your prescription</p>
          <p>Message your health care team</p>
          <p>Check your claim status</p>
          <p>Check your Post-9/11 GI Bill statement of benefits</p>
        </div>
      );
    }

    return (
      <div className="profile-section medium-12 columns">
        {hasSavedForms && formList}
        <h4 className="section-header">Available services</h4>
        {content}
      </div>
    );
  }
}

AuthApplicationSection.propTypes = {
  userProfile: PropTypes.object.isRequired,
  verifyUrl: PropTypes.string
};

export default AuthApplicationSection;
