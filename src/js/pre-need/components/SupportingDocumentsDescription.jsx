import React from 'react';
import classNames from 'classnames';

export default class SupportingDocumentsDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedAnswer1: false,
      expandedAnswer2: false
    };
  }

  toggleAnswer1 = () => {
    this.setState({
      expandedAnswer1: !this.state.expandedAnswer1
    });
  }

  toggleAnswer2 = () => {
    this.setState({
      expandedAnswer2: !this.state.expandedAnswer2
    });
  }

  render() {
    const answerClass = classNames(
      'usa-alert',
      'usa-alert-info',
      'no-background-image'
    );

    const answer1 = (
      <div className={answerClass}>
        <p>
          Documents may include the most recent discharge document (DD Form 214) showing the highest rank and valor awards and decorations, active duty service records, or active duty for a minimum of 24 continuous months for enlisted Servicemembers after September 7, 1980; for officers, after October 16, 1981, or the full period for which the person was called to active duty. If you are unable to locate copies of military records, apply anyway, as VA will attempt to obtain records necessary to make a determination.
        </p>
        <button type="button" onClick={this.toggleAnswer1}>Close</button>
      </div>
    );

    const answer2 = (
      <div className={answerClass}>
        <p>
          Please upload your documents online to help VA process your request quickly.
        </p>
        <p>
          If you can't upload documents:
        </p>
        <ol className="mail-or-fax-steps">
          <li>Make copies of the documents.</li>
          <li>Make sure you write your name and confirmation number on every page.</li>
          <li>
            <p>Mail or fax them to:</p>
            <div className="mail-fax-address">
              <div>National Cemetery Scheduling Office</div>
              <div>P.O. Box 510543</div>
              <div>St. Louis, MO 63151</div>
            </div>
            <p>Fax (toll-free): 1-855-840-8299</p>
          </li>
        </ol>
        <button type="button" onClick={this.toggleAnswer1}>Close</button>
      </div>
    );

    return (
      <div id="supporting-documents-description">
        <p>
          If you have supporting documents readily available, you can upload them to help us make a determination quickly.
        </p>
        <p>
          <a onClick={this.toggleAnswer1}>What kinds of documents should I provide?</a>
        </p>
        {this.state.expandedAnswer1 && answer1}
        <p>
          <a onClick={this.toggleAnswer2}>Can I mail or fax documents?</a>
        </p>
        {this.state.expandedAnswer2 && answer2}
      </div>
    );
  }
}
