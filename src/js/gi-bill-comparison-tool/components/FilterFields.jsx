import React from 'react';

// todo: fix tracking onClicks
class FilterFields extends React.Component {

  render() {
    const count_all = 39349,
          count_school = 23434,
          count_ojt = 3434,
          student_veteran_count = 238;

    const type_name = this.props.queryParams.type_name;

    return (
      <div className="row">

        <div className="small-12 columns filter-box">
          <p>Institution</p>
          <p className="filter-p">
      			<input type="radio" id="all-school" name="institution_type"
              className="filter" value="all"
              checked={type_name === 'all'} />
            <label id="all-school-label" htmlFor="all-school">All ({count_all})</label>
      		</p>
      		<p className="filter-p">
      			<input type="radio" id="school" name="institution_type"
              className="filter" value="school"
              checked={type_name === 'school'} />
            <label id="school-label" htmlFor="school">School ({count_school})</label>
      		</p>
      		<p className="filter-p">
      			<input type="radio" id="employer" name="institution_type"
      				className="filter" value="employer"
              checked={type_name === 'employer'} />
            <label id="employer-label" htmlFor="employer">Employer ({count_ojt})</label>
          </p>
        </div>

        <div className="small-12 columns filter-box">
          <p>Location</p>
          <label htmlFor="state">State: </label>
          <select id="states" name="state" className="filter">
            <option value="all" selected>All ({count_all})</option>
            <option id="filters-wi" value="wi"> WI (3)</option>
            <option id="filters-dc" value="dc"> DC (8)</option>
          </select>
          <label htmlFor="country">Country: </label>
          <select id="countries" name="country" className="filter">
            <option value="all" selected>All ({count_all})</option>
            <option id="filters-usa" value="usa"> USA (35)</option>
          </select>
        </div>

        <div className="small-12 columns filter-box">
          <p>School Features</p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
              className="filter" value="true"
              checked={this.props.queryParams.hasOwnProperty('student_veteran_group')} />
            <label id="student-veteran-label" htmlFor="student-veteran">
              Student Vet Group ({student_veteran_count})
            </label>
          </p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
              className="filter" value="true"
              checked={this.props.queryParams.hasOwnProperty('student_veteran_group')} />
            <label id="student-veteran-label" htmlFor="student-veteran">
              Yellow Ribbon ({student_veteran_count})
            </label>
          </p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
              className="filter" value="true"
              checked={this.props.queryParams.hasOwnProperty('student_veteran_group')} />
            <label id="student-veteran-label" htmlFor="student-veteran">
              Principles of Excellence ({student_veteran_count})
            </label>
          </p>
          <p className="filter-p">
            <input type="checkbox" id="student-veteran" name="student_veteran"
              className="filter" value="true"
              checked={this.props.queryParams.hasOwnProperty('student_veteran_group')} />
            <label id="student-veteran-label" htmlFor="student-veteran">
              8 Keys to Vet Success ({student_veteran_count})
            </label>
          </p>
        </div>
        <div className="small-12 columns filter-box">
          <p>Types of Schools</p>
          <select id="types" name="types" className="filter">
            <option value="all" selected>All ({count_all})</option>
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
}

export default FilterFields;




// <% count_all = @kilter.count_all %>
//
// <div class="row">
// 	<div class="small-12 columns filter-box">
// 	<%
// 		type_name = @inputs[:type_name] || "all"
// 		count_ojt = @kilter.count(:name)[Institution::EMPLOYER]
//
// 		count_school = InstitutionType.where.not(name: Institution::EMPLOYER).inject(0) do |memo, it|
// 			memo += @kilter.count(:name)[it.name]
// 		end
// 	%>
// 		<p>Institution</p>
//
// 		<p class="filter-p">
// 			<input type="radio" id="all-school" name="institution_type" class="filter" value="all"
// 				<%= "checked" if type_name == "all" %>
// 			/>
// 			<label id="all-school-label" for="all-school">All (<%= count_all %>)</label>
// 		</p>
//
// 		<p class="filter-p">
// 			<input type="radio" id="school" name="institution_type"
//         class="filter" value="school"
//         <%= 'checked' if type_name == "school" %>
//       />
// 			<label id="school-label" for="school">School (<%= count_school %>)</label>
// 		</p>
//
// 		<p class="filter-p">
// 			<input type="radio" id="employer" name="institution_type"
// 				class="filter" value="employer" <%= 'checked' if type_name == "employer" %>
// 			/>
//       <label id="employer-label" for="employer">Employer (<%= count_ojt %>)</label>
//     </p>
// 	</div><!-- end institution section -->
//
// 	<div class="small-12 columns filter-box">
// 		<p>Location</p>
//
		// <label for="state">State: </label>
		// <select id="states" name="state" class="filter">
		// 	<option value="all" selected>All (<%= count_all %>)</option>
		// 	<% @kilter.count(:state).each_pair do |state, count| %>
		// 		<option id="filters-<%= state %>" value="<%= state %>" <%= 'selected' if compare_downcase(@inputs[:state], state) %>>
    //       <%= state.upcase %> (<%= count %>)
		// 		</option>
		// 	<% end %>
		// </select>
//
// 		<label for="country">Country: </label>
// 		<select id="countries" name="country" class="filter">
// 			<option value="all" selected>All (<%= count_all %>)</option>
// 			<% @kilter.count(:country).each_pair do |country, count| %>
// 				<option id="filters-<%= country %>" value="<%= country %>" <%= 'selected' if compare_downcase(@inputs[:country], country) %>>
//           <%= country.upcase %> (<%= count %>)
// 				</option>
// 			<% end %>
// 		</select>
// 	</div><!-- end location section -->
//
// 	<div class="small-12 columns filter-box">
// 		<p>School Features</p>
//
		// <p class="filter-p">
		// 	<input type="checkbox" id="student-veteran" name="student_veteran"
		// 		class="filter" value="true" <%= 'checked' if @inputs[:student_veteran_group].present? %>
		// 	/>
    //   <label id="student-veteran-label" for="student-veteran">
    //   	Student Vet Group (<%= @kilter.count(:student_veteran)["true"] %>)
    //   </label>
    // </p>
//
// 		<p class="filter-p">
// 			<input type="checkbox" id="yr" name="yr"
// 				class="filter" value="true" <%= 'checked' if @inputs[:yellow_ribbon_scholarship].present? %>
// 			/>
//     	<label id="yr-label" for="yr">
//     		Yellow Ribbon (<%= @kilter.count(:yr)["true"] %>)
//     	</label>
//    	</p>
//
// 		<p class="filter-p">
// 			<input type="checkbox" id="poe" name="poe"
// 				class="filter" value="true" <%= 'checked' if @inputs[:principles_of_excellence].present? %>
// 			/>
//       <label id="poe-label" for="poe">
//       	Principles of Excellence (<%= @kilter.count(:poe)["true"] %>)
//       </label>
//      </p>
//
// 		<p class="filter-p">
// 			<input type="checkbox" id="eight-keys" name="eight_keys"
// 				class="filter" value="true" <%= 'checked' if @inputs[:f8_keys_to_veteran_success].present? %>
// 			/>
//       <label id="eight-keys-label" for="eight-keys">
//       	8 Keys to Vet Success (<%= @kilter.count(:eight_keys)["true"] %>)
//       </label>
//     </p>
// 	</div><!-- end features section -->
//
// 	<div class="small-12 columns filter-box">
// 		<p>Types of Schools</p>
//
// 		<select id="types" name="types" class="filter">
// 			<option value="all" selected>All (<%= count_all %>)</option>
// 			<% @kilter.count(:name).each_pair do |itype, count| %>
// 				<option id="filters-<%= itype %>" value="<%= itype %>" <%= 'selected' if compare_downcase(@inputs[:types], itype) %>>
//           <%= itype.upcase %> (<%= count %>)
// 				</option>
// 			<% end %>
// 		</select>
// 	</div><!-- end school types section -->
//
// </div><!--end row-->
