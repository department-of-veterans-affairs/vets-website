import React from 'react';

class ProfileVeteranSummary extends React.Component {

  constructor(props) {
    super(props);
    // this.renderHeader = this.renderHeader.bind(this);
  }

  render() {
    return (
      <div>
        ProfileVeteranSummary
      </div>
    );
  }

}

ProfileVeteranSummary.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileVeteranSummary.defaultProps = {
  expanded: true
};

export default ProfileVeteranSummary;

// <!-- Profile Veteran Summary -->
// <div className="large-12 columns accordion-vert-spacing">
// 	<ul className="accordion" data-accordion>
// 		<li className="accordion-navigation">
// 			<a href="#panel1a" aria-expanded="true">Veteran Summary</a>
// 			<div id="panel1a" className="content active">
//         <div className="va-summary-card multicolumn-text">
//
// 					<ul>
// 						<%
// 							feature = @school.student_veteran
// 							link = @school.student_veteran_link
// 							v_str = '<span className="programs-' + (feature ? "yes\">\u2714" : "no\">\u2716") + '</span>'
// 							l_str = feature && link.present? ? "<a target=\"blank\" href=\"#{link}\" className=\"programs-text\"> Go To Site >></a>" : ""
// 						%>
// 		        <li>
// 		        	<%= v_str.html_safe %>
// 		        	<a id="student-veteran-group-info-link" rel="leanModal"
// 		        		name="status" href="#vetgroups">
// 		        		<span className="programs-text">Student Veteran Group</span>
// 		        	</a>
// 		        	<%= h(l_str.html_safe) %>
// 		        </li>
//
// 		        <%
// 							feature = @school.yr
// 							link = "http://www.benefits.va.gov/gibill/yellow_ribbon/2015/states/#{@school.state}.asp"
// 		        	v_str = '<span className="programs-' + (feature ? "yes\">\u2714" : "no\">\u2716") + '</span>'
// 							l_str = feature ? "<a target=\"blank\" href=\"#{link}\" className=\"programs-text\"> <span className=\"see-yr-rates-summary\"> See YR Rates</span></a>" : ""
// 		        %>
// 		        <li>
// 		        	<%= v_str.html_safe %>
// 		        	<a id="yellow-ribbon-info-link" rel="leanModal"
// 		        		name="status" href="#yribbon">
// 		        		<span className="programs-text">Yellow Ribbon</span>
// 		        	</a>
// 		        	<%= h(l_str.html_safe) %>
// 		        </li>
//
// 		        <%
// 		        	v_str = '<span className="programs-' + (@school.poe ? "yes\">\u2714" : "no\">\u2716") + '</span>'
// 		        %>
// 		        <li>
// 		        	<%= v_str.html_safe %>
// 		        	<a id="go" rel="leanModal" name="status" href="#poe">
// 		        		<span className="programs-text">Principles of Excellence</span>
// 		        	</a>
// 		        </li>
//
// 		        <%
// 		        	v_str = '<span className="programs-' + (@school.dodmou ? "yes\">\u2714" : "no\">\u2716") + '</span>'
// 		        %>
// 		        <li>
// 		        	<%= v_str.html_safe %>
// 		        	<a id="military-tuition-assistance-info-link" rel="leanModal"
// 		        		name="status" href="#ta">
// 		        		<span className="programs-text">Military Tuition Assistance (TA)</span>
// 		        	</a>
// 		        </li>
//
// 		        <%
// 		        	feature = @school.vetsuccess_name
// 		        	link = feature.present? && @school.vetsuccess_email.present? ? "mailto:#{@school.vetsuccess_email}" : ""
// 		        	v_str = '<span className="programs-' + (feature.present? ? "yes\">\u2714" : "no\">\u2716") + '</span>'
// 							l_str = feature && link.present? ? "<a target=\"blank\" href=\"#{link}\" className=\"programs-text\"> Email #{feature} >></a>" : ""
// 		        %>
// 		        <li>
// 		        	<%= v_str.html_safe %>
// 		        	<span className="programs-text">VetSuccess on Campus</span>
// 		        	<%= h(l_str.html_safe) %>
// 		        </li>
//
// 		        <%
// 		        	v_str = '<span className="programs-' + (@school.eight_keys ? "yes\">\u2714" : "no\">\u2716") + '</span>'
// 		        %>
// 		        <li>
// 		        	<%= v_str.html_safe %>
// 		        	<a id="8-keys-info-link" rel="leanModal" name="status" href="#8keys">
// 		        		<span className="programs-text">8 Keys to Veteran Success</span>
// 		        	</a>
// 		        </li>
// 					</ul>
// 		  	</div>
//     	</div>
// 		</li>
// 	</ul>
// </div>
