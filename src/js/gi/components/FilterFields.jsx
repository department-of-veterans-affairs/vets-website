import React from 'react';

// todo: fix tracking onClicks
class FilterFields extends React.Component {

  render() {
    const countAll = 39349;
    const countSchool = 23434;
    const countOjt = 3434;
    const studentVeteranCount = 238;

    const typeName = this.props.queryParams.type_name;

    return (
      <div className="row">

        <div className="small-12 columns filter-box">
          <p>Institution</p>
          <p className="filter-p">
            <input type="radio" id="all-school" name="institution_type"
                className="filter" value="all"
                checked={typeName === 'all'}/>
            <label id="all-school-label" htmlFor="all-school">All ({countAll})</label>
          </p>
          <p className="filter-p">
            <input type="radio" id="school" name="institution_type"
                className="filter" value="school"
                checked={typeName === 'school'}/>
            <label id="school-label" htmlFor="school">School ({countSchool})</label>
          </p>
          <p className="filter-p">
            <input type="radio" id="employer" name="institution_type"
                className="filter" value="employer"
                checked={typeName === 'employer'}/>
            <label id="employer-label" htmlFor="employer">Employer ({countOjt})</label>
          </p>
        </div>

        <div className="small-12 columns filter-box">
          <p>Location</p>
          <label htmlFor="state">State: </label>
          <select id="states" name="state" className="filter">
            <option value="all" selected>All ({countAll})</option>
            <option id="filters-wi" value="wi"> WI (3)</option>
            <option id="filters-dc" value="dc"> DC (8)</option>
          </select>
          <label htmlFor="country">Country: </label>
          <select id="countries" name="country" className="filter">
            <option value="all" selected>All ({countAll})</option>
            <option id="filters-usa" value="usa"> USA (35)</option>
          </select>
        </div>

        <div className="small-12 columns filter-box">
          <p>School Features</p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
                className="filter" value="true"
                checked={this.props.queryParams.hasOwnProperty('student_veteran_group')}/>
            <label id="student-veteran-label" htmlFor="student-veteran">
              Student Vet Group ({studentVeteranCount})
            </label>
          </p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
                className="filter" value="true"
                checked={this.props.queryParams.hasOwnProperty('student_veteran_group')}/>
            <label id="student-veteran-label" htmlFor="student-veteran">
              Yellow Ribbon ({studentVeteranCount})
            </label>
          </p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
                className="filter" value="true"
                checked={this.props.queryParams.hasOwnProperty('student_veteran_group')}/>
            <label id="student-veteran-label" htmlFor="student-veteran">
              Principles of Excellence ({studentVeteranCount})
            </label>
          </p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
                className="filter" value="true"
                checked={this.props.queryParams.hasOwnProperty('student_veteran_group')}/>
            <label id="student-veteran-label" htmlFor="student-veteran">
              8 Keys to Vet Success ({studentVeteranCount})
            </label>
          </p>
        </div>
        <div className="small-12 columns filter-box">
          <p>Types of Schools</p>
          <select id="types" name="types" className="filter">
            <option value="all" selected>All ({countAll})</option>
            <option id="filters-ojt" value="ojt"> OJT (8)</option>
          </select>
        </div>

      </div>
    );
  }
}

FilterFields.propTypes = {
  queryParams: React.PropTypes.object.isRequired
};

FilterFields.defaultProps = {
  queryParams: {}
};

export default FilterFields;
