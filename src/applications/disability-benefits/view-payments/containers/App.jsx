import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import ViewPaymentsHeader from '../components/view-payments-header/ViewPaymentsHeader.jsx';
import ViewPaymentsLists from '../components/view-payments-lists/ViewPaymentsLists.jsx';
import ViewPaymentsSidebar from '../components/ViewPaymentsSidebar/ViewPaymentsSidebar.jsx';
import ViewPaymentsSidebarBlock from '../components/ViewPaymentsSidebar/ViewPaymentsSidebarBlock.jsx';
import { breadcrumbLinks } from './helpers';
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
          <div className="vads-l-col--12 medium-screen:vads-l-col--12 large-screen:vads-l-col--8">
            <ViewPaymentsHeader />
            <ViewPaymentsLists />
            <p className="vads-u-font-size--lg vads-u-font-weight--bold">
              What if I find a check I thought was missing?
            </p>
            <p>
              If the original check is found or received, you must return the
              original check to the Treasury Department and await receipt of the
              replacement check. If both checks are negotiated, then you will be
              responsible for the duplicate payment. You will receive a letter
              from the Debt Management Center with instructions concerning
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
