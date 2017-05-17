import React from 'react';

const headerContents = () => (
  <div>
    <h1>HEADER CONTENTS</h1>
  </div>
);

const termsContents = () => (
  <div>
    <h1>TERMS CONTENTS</h1>
  </div>
);

const footerContents = () => (
  <div>
    <h1>FOOTER CONTENTS</h1>
  </div>
);

const yesContents = () => {
  return 'Yes I need this';
};

const noContents = () => {
  return 'No I dislike this';
};

class CreateMHVAccountPrompt extends React.Component {
  render() {
    return (
      <div className="row primary">
        <div className="small-12 columns usa-content">
          {headerContents()}
          <div className="terms-scroller">
            {termsContents()}
          </div>
          <div className="form-radio-buttons">
            <input type="radio" name="form-selection" id="form-yes" value="yes"/>
            <label htmlFor="form-yes">
              {yesContents()}
            </label>
            <input type="radio" name="form-selection" id="form-no" value="no"/>
            <label htmlFor="form-no">
              {noContents()}
            </label>
          </div>
          <p>
            {footerContents()}
          </p>
        </div>
      </div>
    );
  }
}

export default CreateMHVAccountPrompt;
