import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../actions';
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
    this.props.fetch(this.props.params.facility_code);
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
          <AccordionItem button="Estimate your benefits" expanded={true}>
            <Calculator/>
          </AccordionItem>
          <AccordionItem button="Veteran programs">
            <Programs/>
          </AccordionItem>
          <AccordionItem button="Student outcomes">
            <If condition={!!profile.attributes.facility_code && !!constants} comment="TODO">
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

const mapStateToProps = (state, props) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
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
