import React from 'react';
import Dropdown from './Dropdown'
import If from './If'
import Modal from '../../common/components/Modal'

class AboutYourselfFields extends React.Component {

  constructor(props) {
    super(props);

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.toggleModalDisplay = this.toggleModalDisplay.bind(this);

    this.state = {
      modals: {
        military_status: false,
        gi_bill_chapter: false,
        cumulative_service: false,
        enlistment_service: false,
        consecutive_service: false
      },
      dropdowns: {
        military_status: true,
        gi_bill_chapter: true,
        cumulative_service: true
      }
    };
  }

  handleDropdownChange(event) {
    const delay = 80; // todo: proper animation

    let field = event.target.name;
    let value = event.target.value;

    if (field === 'military_status') {
      setTimeout(() => {
        this.setState((state, props) => {
          state.dropdowns['spouse_active_duty'] = (value === 'spouse');
          return state;
        });
      }, delay);
    }

    if (field === 'gi_bill_chapter') {
      setTimeout(() => {
        this.setState((state, props) => {
          state.dropdowns['cumulative_service'] = (value === '33');
          state.dropdowns['enlistment_service'] = (value === '30');
          state.dropdowns['consecutive_service'] = (value === '1607');
          state.dropdowns['elig_for_post_gi_bill'] = (value === '31');
          state.dropdowns['number_of_dependents'] = (value === '31');
          return state;
        });
      }, delay);
    }
  }

  toggleModalDisplay(name) {
    this.setState({modals: {
      [name]: !(this.state.modals[name])
    }});
  }

  render() {
    return (
      <div className="row">
        <If condition={!this.props.labels}>
          <p className="filter-p filter-item about-you">About You:</p>
        </If>

        <Dropdown
          identifier="military-status"
          options={[
            'veteran', 'Veteran',
            'active duty', 'Active Duty',
            'national guard / reserves', 'National Guard / Reserves',
            'spouse', 'Spouse',
            'child', 'Child'
          ]}
          defaultOption="veteran"
          alt="Select military status"
          visible={this.state.dropdowns.military_status}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          <label htmlFor="military-status">
            Military Status:
            <a onClick={() => {this.toggleModalDisplay('military_status')}} className="info-icons">
              <i className="fa fa-info-circle info-icons"></i>
            </a>
          </label>
        </Dropdown>

        <Dropdown
          identifier="spouse-active-duty"
          options={[
            'yes', 'Spouse Active Duty',
            'no', 'Spouse Not Active Duty'
          ]}
          defaultOption="no"
          alt="Spouse Active Duty? Yes/No"
          visible={this.state.dropdowns.spouse_active_duty}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          <label htmlFor="spouse-active-duty">
            Is your spouse on active duty?
          </label>
        </Dropdown>

        <Dropdown
          identifier="gi-bill-chapter"
          options={[
            '33', 'Post-9/11 GI Bill (Ch 33)',
            '30', 'Montgomery GI Bill (Ch 30)',
            '1606', 'Select Reserve GI Bill (Ch 1606)',
            '1607', 'REAP GI Bill (Ch 1607)',
            '31', 'Vocational Rehabilitation & Employment (VR&E)',
            '35', 'Dependents Educational Assistance (DEA)'
          ]}
          defaultOption="33"
          alt="Select which GI Bill benefit you are thinking of using"
          visible={this.state.dropdowns.gi_bill_chapter}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          <label htmlFor="gi-bill-chapter">
            Which GI Bill benefit are you thinking of using?
            <a onClick={() => {this.toggleModalDisplay('gi_bill_chapter')}} className="info-icons">
              <i className="fa fa-info-circle info-icons"></i>
            </a>
          </label>
        </Dropdown>

        <Dropdown
          identifier="cumulative-service"
          options={[
            '1.0', '36+ months: 100% (includes BASIC)', // notice not 1.00
            '0.9', '30 months: 90% (includes BASIC)',
            '0.8', '24 months: 80% (includes BASIC)',
            '0.7', '18 months: 70% (excludes BASIC)',
            '0.6', '12 months: 60% (excludes BASIC)',
            '0.5', '6 months: 50% (excludes BASIC)',
            '0.4', '90 days: 40% (excludes BASIC)',
            '0.0', 'Less than 90 days 0% (excludes BASIC)',
            '1.00', 'GYSGT Fry Scholarship: 100%',  // notice not 1.0
            'service discharge', 'Service-Connected Discharge: 100%'
          ]}
          defaultOption="1.0"
          alt="Select amount of cumulative Post 9-11 Active Duty Service"
          visible={this.state.dropdowns.cumulative_service}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          <label htmlFor="cumulative-service">
            Cumulative Post 9-11 Active Duty Service:
            <a onClick={() => {this.toggleModalDisplay('cumulative_service')}} className="info-icons">
              <i className="fa fa-info-circle info-icons"></i>
            </a>
          </label>
        </Dropdown>

        <Dropdown
          identifier="enlistment-service"
          options={[
            '3', '3 or more years',
            '2', '2 or more years'
          ]}
          defaultOption="3"
          alt="Select length of your enlistment"
          visible={this.state.dropdowns.enlistment_service}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          <label htmlFor="enlistment-service">
            Completed an enlistment of:
            <a onClick={() => {this.toggleModalDisplay('enlistment_service')}} className="info-icons">
              <i className="fa fa-info-circle info-icons"></i>
            </a>
          </label>
        </Dropdown>

        <Dropdown
          identifier="consecutive-service"
          options={[
            '0.8', '2+ years of consecutive service: 80%',
            '0.6', '1+ year of consecutive service: 60%',
            '0.4', '90+ days of consecutive service: 40%'
          ]}
          defaultOption="0.8"
          alt="Select the length of your longest actice duty tour"
          visible={this.state.dropdowns.consecutive_service}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          <label htmlFor="consecutive-service">
            Length of Longest Active Duty Tour:
            <a onClick={() => {this.toggleModalDisplay('consecutive_service')}} className="info-icons">
              <i className="fa fa-info-circle info-icons"></i>
            </a>
          </label>
        </Dropdown>

        <Dropdown
          identifier="elig-for-post-gi-bill"
          options={[
            'yes', 'Eligilble for Post-9/11 Gi Bill',
            'no', 'Not Eligilble for Post-9/11 Gi Bill'
          ]}
          defaultOption="no"
          alt="Eligible for Post 9/11 GI Bill?"
          visible={this.state.dropdowns.elig_for_post_gi_bill}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          { this.renderVREBenefitsMessage() }
          <label htmlFor="elig-for-post-gi-bill">
            Are you eligible for the Post-9/11 GI Bill?
          </label>
        </Dropdown>

        <Dropdown
          identifier="number-of-dependents"
          options={[
            '0', '0 Dependents',
            '1', '1 Dependent',
            '2', '2 Dependents',
            '3', '3 Dependents',
            '4', '4 Dependents',
            '5', '5 Dependents'
          ]}
          defaultOption="0"
          alt="Select the number of dependents you have"
          visible={this.state.dropdowns.number_of_dependents}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels}>
          <label htmlFor="number-of-dependents">
            Number of Dependents
          </label>
        </Dropdown>

        <Dropdown
          identifier="online-classes"
          options={[
            'yes', 'All Online',
            'no', 'None Online',
            'both', 'Both online and on-campus'
          ]}
          defaultOption="no"
          alt="Online? Yes/No"
          visible={this.state.dropdowns.online_classes || !this.props.labels}
          onChange={this.handleDropdownChange}
          showLabel={this.props.labels} />


        <Modal onClose={() => {this.toggleModalDisplay('military_status')}} visible={this.state.modals.military_status}>
            <h3>Military Status</h3>
            <p>
              <a title="Post 9/11 GI Bill"
                href="http://www.benefits.va.gov/gibill/post911_gibill.asp"
                id="anch_378" target="_blank">
              Post 9/11 GI Bill</a> recipients serving on Active Duty (or
              transferee spouses of a servicemember on active duty) are not
              eligible to receive a monthly housing allowance.
            </p>
        </Modal>

        <Modal onClose={() => {this.toggleModalDisplay('gi_bill_chapter')}} visible={this.state.modals.gi_bill_chapter}>
            <h3>Which GI Bill benefit are you thinking of using?</h3>
            <p>
              You may be eligible for several types of VA education and training
              benefits depending on when and how long you served. There are
              several things to consider before you apply for a GI Bill program.
              One person may benefit more by using the Montgomery GI Bill while
              another may make an irrevocable election and use the Post-9/11 GI
              Bill instead. This tool allows you to compare the different
              programs and make an educated decision on which benefit best suits
              your needs.
            </p>
            <p>
              For more detailed information on eligibility requirements and
              general program benefits, please check out
              <a href="http://www.benefits.va.gov/gibill/comparison_tool.asp"
                target="_blank">this page</a>.
            </p>
        </Modal>

        <Modal onClose={() => {this.toggleModalDisplay('cumulative_service')}} visible={this.state.modals.cumulative_service}>
            <h3>Cumulative Post-9/11 Service</h3>
            <p>
              The <a title="Post-9/11 GI Bill" href="../post911_gibill.asp" id="anch_375">
              Post-9/11 GI Bill</a> provides financial support for education and a
              housing allowance to qualifying individuals with at least 90 days of
              aggregate service after September 10, 2001, or individuals discharged
              with a service-connected disability after 30 days. You must have received
              an honorable discharge to be eligible for the Post-9/11 GI Bill.
            </p>
            <p>
              For more detailed information Cumulative Post-9/11 Service, please check out <a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#cumulativeservice" target="_blank">this page</a>.
            </p>
        </Modal>

        <Modal onClose={() => {this.toggleModalDisplay('enlistment_service')}} visible={this.state.modals.enlistment_service}>
            <h3>Completed an enlistment of (MGIB):</h3>
            <p>
              The Montgomery GI Bill – Active Duty provides education benefits
              to Veterans and Servicemembers who have served at least two years
              of active duty. When using this tool, you will need to select the
              length of your original active duty enlistment obligation in order
              to get an estimate of your monthly benefit. The amount of time you
              served (2 year enlistment vs. 3+ year enlistment) will impact your
              monthly payment amount when using the Montgomery GI Bill. To learn
              more about MGIB please visit
              <a href="http://www.benefits.va.gov/gibill/mgib_ad.asp"
                id="anch_399" target="_blank">
                http://www.benefits.va.gov/gibill/mgib_ad.asp
              </a>.
            </p>
        </Modal>

        <Modal onClose={() => {this.toggleModalDisplay('consecutive_service')}} visible={this.state.modals.consecutive_service}>
            <h3>Length of Longest Active Duty Tour (REAP)</h3>
            <p>
              The REAP program pays benefits to eligible Reservists or Guard
              members who were called or ordered to active duty for at least 90
              consecutive days in response to a war or national emergency
              declared by the President or Congress. REAP payment amounts are
              based on length of consecutive days of active duty service with
              rates increasing at one year and again at two years of consecutive
              service. To learn more about REAP please visit
              <a href="http://www.benefits.va.gov/gibill/reap.asp"
                id="anch_403" target="_blank">
                http://www.benefits.va.gov/gibill/reap.asp
              </a>.
            </p>
        </Modal>

      </div>
    );
  }

  renderVREBenefitsMessage() {
    // onClick="track('Tool Tips', 'Voc Rehab Warning');"
    return (
      <div className="form-group top-aligned" id="voc-rehab-warning">
        <p className="caption">To apply for VR&E benefits,
          please <a href="http://vabenefits.vba.va.gov/vonapp/main.asp"
          target="_blank">
          visit this site.</a>
        </p>
      </div>
    );
  }

}

AboutYourselfFields.propTypes = {
  labels: React.PropTypes.bool,
  dropdowns: React.PropTypes.object
};

AboutYourselfFields.defaultProps = {
  labels: false
};

export default AboutYourselfFields;
