import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import BackLink from '../BackLink';
import { getConfirmedAppointmentDetailsInfo } from '../../appointment-list/redux/selectors';
import NewTabAnchor from '../NewTabAnchor';

export function Section({ children, heading }) {
  return (
    <>
      <h2 className="vads-u-font-size--h3">{heading}</h2>
      {children}
    </>
  );
}
Section.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
};

export function When({ children }) {
  return <Section heading="When">{children}</Section>;
}
When.propTypes = {
  children: PropTypes.node,
};

export function What({ children }) {
  return <Section heading="What">{children}</Section>;
}
What.propTypes = {
  children: PropTypes.node,
};

export function Who({ children }) {
  return <Section heading="Who">{children}</Section>;
}
Who.propTypes = {
  children: PropTypes.node,
};

export function Where({ children }) {
  return <Section heading="Where to attend">{children}</Section>;
}
Where.propTypes = {
  children: PropTypes.node,
};

export default function DetailPageLayout({ children, header, instructions }) {
  const { id } = useParams();
  const { appointment } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );

  return (
    <>
      <BackLink appointment={appointment} />
      <h1>{header}</h1>
      <p>{instructions}</p>
      {children}
      <Section heading="Prepare for your visit">
        <NewTabAnchor href="#" aria-label="">
          Review your personal healthcare contacts
        </NewTabAnchor>
      </Section>
      <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
        <VaButton
          text="Print"
          secondary
          onClick={() => window.print()}
          data-testid="print-button"
          uswds
        />
        <VaButton text="Cancel appointment" secondary onClick="" />
      </div>
    </>
  );
}
DetailPageLayout.propTypes = {
  children: PropTypes.node,
  header: PropTypes.string,
  instructions: PropTypes.string,
};
