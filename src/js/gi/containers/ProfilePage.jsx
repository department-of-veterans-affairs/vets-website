import React from 'react';
import { connect } from 'react-redux';

import { fetchProfile, showModal } from '../actions';
import AccordionItem from '../components/AccordionItem';
import If from '../components/If';
import HeadingSummary from '../components/profile/HeadingSummary';
import Programs from '../components/profile/Programs';
import Outcomes from '../components/profile/Outcomes';
import Calculator from '../components/profile/Calculator';
import CautionaryInformation from '../components/profile/CautionaryInformation';
import AdditionalInformation from '../components/profile/AdditionalInformation';
import { outcomeNumbers } from '../selectors/outcomes';

export class ProfilePage extends React.Component {

  componentDidMount() {
    this.props.fetchProfile(this.props.params.facilityCode);
  }

  render() {
    const { constants, outcomes, profile } = this.props;
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
              <Outcomes
                  graphing={outcomes}
                  showModal={this.props.showModal}/>
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

const mapStateToProps = (state) => {
  const { constants: { constants }, profile } = state;
  const outcomes = constants ? outcomeNumbers(state) : null;
  return { constants, outcomes, profile };
};

const mapDispatchToProps = {
  fetchProfile,
  showModal
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
