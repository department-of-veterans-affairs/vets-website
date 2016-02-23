import React from 'react';

import { Nav } from './_hello-world.jsx';

class HealthCareApp extends React.Component {
  constructor() {
    super();
    this.onStateChange = this.onStateChange.bind(this);
    this.state = { applicationData: {} };
    const savedAppData = window.localStorage["health-app-data"];
    if (savedAppData) {
      this.state.applicationData = JSON.parse(savedAppData);
    }
    if (this.state.applicationData.sharedText === undefined) {
      this.state.applicationData.sharedText = "shared";
    }
    if (this.state.applicationData.happyDate === undefined) {
      this.state.applicationData.happyDate = {
        month: "1",
        day: "15",
        year: "1997",
      };
    }
    if (this.state.applicationData.sadDate === undefined) {
      this.state.applicationData.sadDate = {
        month: "4",
        day: "5",
        year: "2014",
      };
    }
    if (this.state.applicationData.fullName === undefined) {
      this.state.applicationData.fullName = {
        first: "William",
        last: "Shakespeare",
      }
    }
    if (this.state.applicationData.mothersMaidenName === undefined) {
      this.state.applicationData.mothersMaidenName = {
        name: "Arden"
      }
    }
  }

  onStateChange(field, update) {
    let newApplicationData = Object.assign({}, this.state.applicationData);
    newApplicationData[field] = update;
    window.localStorage["health-app-data"] = JSON.stringify(newApplicationData);

    this.setState( {applicationData: newApplicationData} );
  }

  render()  {
    if (this === null) {console.log("huh"); }
    return (
      <div>
        <h1>Top-Level of App</h1>
        <p> Shared text is: { this.state.applicationData.sharedText } </p>
        <Nav/>
        {
          // Pass the application state down to child components. The
          // cloneElement idiom is the standard react way to add
          // properties to a child. It doesn't actually new a bunch of objects
          // so it's fast.
          React.Children.map(this.props.children, (child) => {
              return React.cloneElement(child,
                { applicationData: this.state.applicationData,
                  onStateChange: this.onStateChange })
          })
        }
      </div>
    )
  }
}

export default HealthCareApp;
