import React from 'react';

class WhatsNext extends React.Component {
  render() {
    return (
      <div>
        <h2>What happens next?</h2>
        <ul className="appeals-next-list">
          <li>
            <h3>Additional evidence</h3>
            <p>VBA must reveiw any additional evidence you submit prios to certifying
            your appeal to the Board of Veterans’ Appeals. This evidence could cause VBA
            to grant your appeal, but if not, they will need to produce an additional
            Statement of the Case.</p>
            <div className="card information">
              <span className="number">11 months</span>
              <span className="description">The Oakland regional office takes about 11 months to produce additional
              Statements of the Case.</span>
            </div>
          </li>
          <span className="sidelines">OR</span>
          <li>
            <h3>Appeal certified to the Board</h3>
            <p>Your appeal will be sent to the Board of Veterans’ Appeals in Washington,
              D.C.</p>
            <div className="card information">
              <span className="number">2 months</span>
              <span className="description">The Oakland regional office takes about 2 months
              to certify appeals to the Board.</span>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default WhatsNext;

