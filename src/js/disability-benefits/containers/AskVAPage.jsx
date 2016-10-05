import React from 'react';
import AskVAQuestions from '../components/AskVAQuestions';

class AskVAPage extends React.Component {
  render() {
    return (
      <div>

        <div className="row">
          <div className="medium-8 columns">
            <div className="va-claim-form">
              <h1>Ask VA to Decide Your Claim</h1>
              <p className="first-of-type">Have you submitted all of your evidence in support of this claim? If so, you can request that VA decide your claim as soon as possible.</p>
              <p>We provide a notice to you about the evidence and information VA needs to support your claim for benefits. At this time, you may choose to indicate whether you intend to submit additional information or evidence that would help support your claim.</p>
              <p>By checking the box below and submitting, you are letting us know you want to decide your claim without waiting 30 days. If you select “Cancel”, you are advising us to give you more time to provide us with information or evidence.</p>
              <p>Your selection will not affect:</p>
              <ul>
                <li>Whether or not you are entitled to VA benefits;</li>
                <li>The amount of benefits to which you may be entitled;</li>
                <li>The assistance VA will provide you in obtaining evidence to support your claims; or</li>
                <li>The date any benefits will begin if your claim is granted.</li>
              </ul>
              <div className="agreement">
                
              </div>
            </div>
          </div>

          <AskVAQuestions/>
        </div>
      </div>
    );
  }
}

export default AskVAPage;
