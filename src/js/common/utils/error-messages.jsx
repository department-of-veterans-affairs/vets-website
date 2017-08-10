/* eslint-disable camelcase */
import React from 'react';

export const systemDownMessage = (
  <div className="row" id="systemDownMessage">
    <div className="small-12 columns">
      <div className="react-container">
        <h3>Sorry, our system is temporarily down while we fix a few things. Please try again later.</h3>
        <a href="/"><button>Go Back to Vets.gov</button></a>
      </div>
    </div>
  </div>
);

export const unableToFindRecordWarning = (
  <div id="recordNotFound">
    <div className="small-12 columns">
      <div className="react-container">
        <h3>We weren't able to find your records.</h3>
        <h4>Please call <a href="tel:855-574-7286">855-574-7286</a> between Monday - Friday, 8:00 a.m. - 8:00 p.m. ET.</h4>
      </div>
    </div>
  </div>
);
