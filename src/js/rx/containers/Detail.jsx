import React from 'react';
import { connect } from 'react-redux';

import { loadData } from '../actions/prescriptions.js';
import BackLink from '../components/BackLink';
import ContactCard from '../components/ContactCard';
import TableVerticalHeader from '../components/tables/TableVerticalHeader';

class Detail extends React.Component {
  componentWillMount() {
    console.log(this.props.params.id);
    this.props.dispatch(loadData(this.props.params.id));
  }

  render() {
    let content;
    const item = this.props.prescriptions.currentItem

    if (item) {
      const attrs = item.attributes;
      const data = {
        Quantity: attrs['quantity'],
        'Start date': attrs['dispensed-date'],
        'Stop using by': attrs['expiration-date'],
        'Prescription #': attrs['prescription-number'],
        'Refills': (
          <span>
            {attrs['refill-remaining']} left
            <a>Refill prescription</a>
          </span>
        )
      };

      content = (
        <div>
          <h3>{attrs['prescription-name']}</h3>
          <TableVerticalHeader
              data={data}/>
        </div>
      );
    }

    return (
      <div className="rx-app row">
        <BackLink/>
        <ContactCard/>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Detail);
