import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { fetchProfile, setPageTitle, showModal } from '../actions';
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

  constructor(props) {
    super(props);
    this.handleViewWarnings = this.handleViewWarnings.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile(this.props.params.facilityCode);
  }

  componentDidUpdate(prevProps) {
    const institutionName = _.get(this.props.profile, 'attributes.name');
    const shouldUpdateTitle = !_.isEqual(
      institutionName,
      _.get(prevProps.profile, 'attributes.name'),
    );

    if (shouldUpdateTitle) {
      this.props.setPageTitle(`${institutionName} - GI Bill Comparison Tool`);
    }
  }

  handleViewWarnings() {
    this._cautionaryInfo.setState({ expanded: true });
  }

  render() {
    const { constants, outcomes, profile } = this.props;
    return (
      <div className="profile-page">
        <HeadingSummary
            institution={this.props.profile.attributes}
            onLearnMore={this.props.showModal.bind(this, 'gibillstudents')}
            onViewWarnings={this.handleViewWarnings}/>
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
          <AccordionItem
              button="Cautionary information"
              ref={c => { this._cautionaryInfo = c; }}>
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
  setPageTitle,
  showModal
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
