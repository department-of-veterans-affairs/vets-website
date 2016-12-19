import React from 'react';
import If from './If';
import InstitutionNameInput from './InstitutionNameInput';

class AboutYourSchoolFields extends React.Component {

  render() {
    return (
      <div>
        <a name="about_your_school"></a>
        <div id="institution-search-form" className="form-group">

          <If condition={this.props.labels}>
            <div id="online-classes-form" className="form-group">
              <label>Will you be taking classes online? </label>

              <input type="radio" id="online-classes-all"
                  name="online_classes" value="yes"
                  defaultChecked={this.props.onlineClasses && this.props.onlineClasses === 'all'}/>
              <label className="radio" htmlFor="online-classes-all">All</label>

              <input type="radio" id="online-classes-no"
                  name="online_classes" value="no"
                  defaultChecked={!this.props.onlineClasses || this.props.onlineClasses === 'no'}/>
              <label className="radio" htmlFor="online-classes-no">No</label>

              <input type="radio" id="online-classes-both"
                  name="online_classes" value="both"
                  defaultChecked={this.props.onlineClasses && this.props.onlineClasses === 'both'}/>
              <label className="radio" htmlFor="online-classes-both">Both</label>
            </div>
          </If>

          <InstitutionNameInput name="institution_search"/>

          <div className="row">
            <div className="small-12 columns" role="search">
              <button className="usa-button-big" type="submit" id="search-button">
                <span>Search Schools</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

}

AboutYourSchoolFields.propTypes = {
  labels: React.PropTypes.bool,
  onlineClasses: React.PropTypes.string
};

AboutYourSchoolFields.defaultProps = {
  labels: true,
  onlineClasses: 'no'
};

export default AboutYourSchoolFields;
