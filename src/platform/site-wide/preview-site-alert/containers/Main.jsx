import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

const headline = "You're viewing a preview of the new VA.gov";
const content =  "We're building a new online experience to make it easier for Veterans to find, access, and manage the benefits they've earned. And we're building it with input from Veterans at every step. Please note: We work iteratively using agile development practices, so you'll see new content, features, and functionality added to the site every day.";

export class Main extends React.Component {
  render() {
    return (
      <div className="usa-width-one-whole">
        <AlertBox
          headline={headline}
          content={content}
          status={'info'}
          isVisible/>
      </div>
    );
  }
}

const mapDispatchToProps = () => {
  return {};
};

export default connect(undefined, mapDispatchToProps)(Main);
