import React from 'react';

import AskVAQuestions from '../components/AskVAQuestions';

export default function AppealListItem() {
  return (
    <div className="claims-container">
      <div className="row">
        <div>
          <h1>Appeals</h1>
        </div>
      </div>
      <div className="row">
        <div className="small-12 usa-width-two-thirds medium-8 columns">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vestibulum sodales sem sed volutpat. Aliquam erat volutpat. Aenean diam sem, interdum et erat at, venenatis dictum tortor. Vivamus vestibulum accumsan mauris eget dignissim. Mauris ac congue metus. Sed ultrices ultrices dui in convallis. In eu interdum eros.
          </p>
        </div>
        <div className="small-12 usa-width-one-third medium-4 columns">
          <AskVAQuestions/>
        </div>
      </div>
    </div>
  );
}
