import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { glossary } from '../glossary.js';
import { loadData } from '../actions/prescriptions.js';
import { openGlossaryModal } from '../actions/modal.js';

import BackLink from '../components/BackLink';
import ContactCard from '../components/ContactCard';
import OrderHistory from '../components/OrderHistory';
import TableVerticalHeader from '../components/tables/TableVerticalHeader';

class Detail extends React.Component {
  componentWillMount() {
    this.props.dispatch(loadData(this.props.params.id));
    this.getGlossaryTerm = this.getGlossaryTerm.bind(this);
  }

  // Returns an object containing the glossary term we're seeking.
  getGlossaryTerm(list, term) {
    return list.filter((object) => {
      return object.term === term;
    });
  }

  render() {
    let header;
    let rxInfo;
    let contactCard;
    let orderHistory;

    const item = this.props.prescriptions.currentItem;
    // TODO: Replace this with the refill status
    // const glossaryTerm = this.getGlossaryTerm(glossary, item.attributes.status);
    const glossaryTerm = this.getGlossaryTerm(glossary, 'Discontinued');

    if (item) {
      // Compose components from Rx data.
      if (item.rx) {
        const attrs = item.rx.attributes;
        const data = {
          Quantity: attrs.quantity,
          // 'Prescription status': attrs[''],
          'Prescription date': moment(
              attrs['refill-submit-date']
            ).format('D MMM YYYY'),
          'Expiration date': moment(
              attrs['expiration-date']
            ).format('D MMM YYYY'),
          'Prescription #': attrs['prescription-number'],
          Refills: (
            <span>
              {attrs['refill-remaining']} left
              <a className="rx-refill-link">Refill prescription</a>
            </span>
          )
        };

        header = (
          <h2 className="rx-heading">
            {attrs['prescription-name']}
          </h2>
        );

        rxInfo = (
          <TableVerticalHeader
              className="usa-table-borderless rx-table rx-info"
              data={data}/>
        );
      }

      // Compose components from tracking data.
      if (item.trackings) {
        const currentPackage = item.trackings[0].attributes;
        const facilityName = currentPackage['facility-name'];
        const phoneNumber = currentPackage['rx-info-phone-number'];

        contactCard = (
          <ContactCard
              facilityName={facilityName}
              phoneNumber={phoneNumber}/>
        );

        orderHistory = (
          <div className="rx-order-history">
            <h3 className="rx-heading va-h-ruled">Order History</h3>
            <OrderHistory
                className="usa-table-borderless rx-table"
                items={item.trackings}/>
          </div>
        );
      }
    }

    return (
      <div id="rx-detail" className="rx-app row">
        <h1>Mail Order Prescriptions</h1>
        <BackLink text="Back to list"/>
        {header}
        {rxInfo}
        {contactCard}
        {orderHistory}
        <p>
          <button
              onClick={() => {this.props.dispatch(openGlossaryModal(glossaryTerm));}}
              type="button"
              value="Discontinued">Discontinued</button></p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Detail);
