import React from 'react';
import { connect } from 'react-redux';
import { showModal, setPageTitle, fetchProfile } from '../actions';
import AccordionItem from '../components/AccordionItem';
import If from '../components/If';
import HeadingSummary from '../components/profile/HeadingSummary';
import Programs from '../components/profile/Programs';
import Outcomes from '../components/profile/Outcomes';
import Calculator from '../components/profile/Calculator';
import CautionaryInformation from '../components/profile/CautionaryInformation';
import AdditionalInformation from '../components/profile/AdditionalInformation';

export class ProfilePage extends React.Component {

  componentWillMount() {
    this.props.fetchProfile(this.props.params.facilityCode);
  }

  render() {
    const constants = this.props.constants.constants;
    const profile = this.props.profile;
    // TODO - set page title
    // const title = `${profile.attributes.name} - GI Bill Comparison Tool`;
    // this.props.setPageTitle(title);
    return (
      <div className="profile-page">
        <HeadingSummary/>
        <ul className="usa-accordion">
          <AccordionItem button="Estimate your benefits" expanded>
            <Calculator/>
          </AccordionItem>
          <AccordionItem button="Veteran programs">
            <Programs/>
          </AccordionItem>
          <AccordionItem button="Student outcomes">
            <If condition={!!profile.attributes.facilityCode && !!constants} comment="TODO">
              <Outcomes/>
            </If>
          </AccordionItem>
          <a name="viewWarnings"></a>
          <AccordionItem button="Cautionary information">
            <CautionaryInformation/>
          </AccordionItem>
          <AccordionItem button="Additional information">
            <AdditionalInformation/>
          </AccordionItem>
        </ul>
      </div>
    );
  }

}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
  showModal,
  setPageTitle,
  fetchProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
