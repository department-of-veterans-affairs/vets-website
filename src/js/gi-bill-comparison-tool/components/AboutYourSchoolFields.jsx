import React from 'react';
import Dropdown from './Dropdown';
import Modal from '../../common/components/Modal';
import If from './If';
import InstitutionNameInput from './InstitutionNameInput';


class AboutYourSchoolFields extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>
        <a name="about_your_school"></a>
        <div id="institution-search-form" className="form-group">

          <If condition={this.props.labels}>
            <div id="online-classes-form" className="form-group">
              <label>Will you be taking classes online? </label>

              <input type="radio" id="online-classes-all"
                name="online_classes" value="yes"
                defaultChecked={this.props.online_classes && this.props.online_classes == 'all'} />
              <label className="radio" htmlFor="online-classes-all" style={{display:'inline-block'}}>All</label>

              <input type="radio" id="online-classes-no"
                name="online_classes" value="no"
                defaultChecked={!this.props.online_classes || this.props.online_classes == 'no'} />
              <label className="radio" htmlFor="online-classes-no" style={{display:'inline-block'}}>No</label>

              <input type="radio" id="online-classes-both"
                name="online_classes" value="both"
                defaultChecked={this.props.online_classes && this.props.online_classes == 'both'} />
              <label className="radio" htmlFor="online-classes-both" style={{display:'inline-block'}}>Both</label>
            </div>
          </If>

          <InstitutionNameInput name="institution_search" />

          <div className="row">
            <div className="small-12 columns" role="search">
              <button className="usa-button-big" type="button" type="submit" id="search-button">
                <span>Search Schools</span>
              </button>
            </div>
          </div>

        </div>
      </span>
    );
  }

}

AboutYourSchoolFields.propTypes = {
  labels: React.PropTypes.bool
};

AboutYourSchoolFields.defaultProps = {
  labels: true
};

export default AboutYourSchoolFields;
