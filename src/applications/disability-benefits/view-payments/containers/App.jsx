import React from 'react';
import ViewPaymentsHeader from '../components/view-payments-header/ViewPaymentsHeader.jsx';
import ViewPaymentsLists from '../components/view-payments-lists/ViewPaymentsLists.jsx';
import ViewPaymentsSidebar from '../components/ViewPaymentsSidebar/ViewPaymentsSidebar.jsx';
import ViewPaymentsSidebarBlock from '../components/ViewPaymentsSidebar/ViewPaymentsSidebarBlock.jsx';
import {
  firstSidebarBlock,
  secondSidebarBlock,
  thirdSidebarBlock,
} from '../components/ViewPaymentsSidebar/ViewPaymentsSidebarBlockStates/ViewPaymentsSidebarBlockStates.jsx';

export default function App() {
  return (
    <div>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--12 large-screen:vads-l-col--8 vads-u-padding--1p5 large-screen:vads-u-padding--0">
            <ViewPaymentsHeader />
            <ViewPaymentsLists />
            <p className="vads-u-font-size--lg vads-u-font-weight--bold">
              What if I find a check that I reported missing?
            </p>
            <p>
              If you reported a check missing and found it later, you must
              return the original check to the U.S. Department of the Treasury
              and wait to receive your replacement check. If you endorse both
              the original and replacement check, you'll get a double payment.
              If this happens, VA Debt Management Center will contact you about
              collection.
            </p>
          </div>
          <div className="vads-l-col--12 medium-screen:vads-l-col--12 large-screen:vads-l-col--4">
            <ViewPaymentsSidebar>
              <ViewPaymentsSidebarBlock
                heading={firstSidebarBlock.heading}
                content={firstSidebarBlock.content}
              />
              <ViewPaymentsSidebarBlock
                heading={secondSidebarBlock.heading}
                content={secondSidebarBlock.content}
              />
              <ViewPaymentsSidebarBlock
                heading={thirdSidebarBlock.heading}
                content={thirdSidebarBlock.content}
              />
            </ViewPaymentsSidebar>
          </div>
        </div>
      </div>
    </div>
  );
}
