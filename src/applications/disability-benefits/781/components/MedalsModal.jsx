import React from 'react';
import MedalsContent from './MedalsContent';

export default class MedalsCheckbox extends React.Component {
  state = { isOpen: false };

  onOpen = () => {
    this.setState({ isOpen: true });
  };

  onClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const medalsList = [
      ('Air Force Achievement Medal with “V” Device': { type: 'boolean' }),
      ('Air Force Combat Action Medal': { type: 'boolean' }),
      ('Air Force Commendation Medal with “V” Device': { type: 'boolean' }),
      ('Air Force Cross': { type: 'boolean' }),
      ('Air Medal with “V” Device': { type: 'boolean' }),
      ('Army Commendation Medal with “V” Device': { type: 'boolean' }),
      ('Bronze Star Medal with “V” Device': { type: 'boolean' }),
      ('Combat Action Badge': { type: 'boolean' }),
      ('Combat Action Ribbon (Note: Prior to February 1969, the Navy Achievement Medal with “V” Device was awarded.)': {
        type: 'boolean',
      }),
      ('Combat Aircrew Insignia': { type: 'boolean' }),
      ('Combat Infantry/Infantryman Badge': { type: 'boolean' }),
      ('Combat Medical Badge': { type: 'boolean' }),
      ('Distinguished Flying Cross': { type: 'boolean' }),
      ('Distinguished Service Cross': { type: 'boolean' }),
      ('Joint Service Commendation Medal with “V” Device': { type: 'boolean' }),
      ('Medal of Honor': { type: 'boolean' }),
      ('Navy Commendation Medal with “V” Device': { type: 'boolean' }),
      ('Navy Cross': { type: 'boolean' }),
      ('Purple Heart': { type: 'boolean' }),
      ('Silver Star': { type: 'boolean' }),
      ('Other medal(s) or citations': { type: 'boolean' }),
    ];

    const { isOpen } = this.state;

    return (
      <div>
        <div>
          <div className="medal-wrapper" onClick={this.onOpen}>
            <select className="medal-select" />
            <div className="medal-text">Select all that apply</div>
          </div>
        </div>
        {isOpen && (
          <MedalsContent
            props={this.props}
            onClose={this.onClose}
            items={medalsList}
          />
        )}
      </div>
    );
  }
}
