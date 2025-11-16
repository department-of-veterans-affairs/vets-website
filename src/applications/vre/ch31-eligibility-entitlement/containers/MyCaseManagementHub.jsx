import React from 'react';

const HubCard = ({ title, body, icon }) => (
  <div
    className="vads-u-margin-bottom--2 vads-u-padding-right--1"
    style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}
  >
    <va-card class="h-100" icon-name={icon}>
      <div>
        <h3 className="vads-u-margin-top--1">{title}</h3>
        <p>{body}</p>
        <va-link-action
          href="https://va.gov/vso/"
          text="Call to action"
          type="secondary"
        />
      </div>
    </va-card>
  </div>
);

const MyCaseManagementHub = () => {
  const stepLabels = [
    'Application Received',
    'Eligibility Determination',
    'Orientation Completion',
    'Intake Scheduled/Awaiting Schedule',
    'Entitlement Determination',
    'Rehabilitation Plan/Career Track Selected',
    'Payment Schedule Activated',
  ];

  const cards = [
    {
      title: 'Example card title 1',
      body: 'Example card content for item one.',
      icon: 'location_city',
    },
    {
      title: 'Example card title 2',
      body: 'Example card content for item two.',
      icon: 'location_city',
    },
    {
      title: 'Example card title 3',
      body: 'Example card content for item three.',
      icon: 'location_city',
    },
    {
      title: 'Example card title 4',
      body: 'Example card content for item four.',
      icon: 'location_city',
    },
    {
      title: 'Example card title 5',
      body: 'Example card content for item five.',
      icon: 'location_city',
    },
  ];

  const total = stepLabels.length; // 7
  const [current, setCurrent] = React.useState(2);

  const goPrev = () => setCurrent(c => Math.max(1, c - 1));
  const goNext = () => setCurrent(c => Math.min(total, c + 1));

  return (
    <div className="row">
      <div className="vads-u-margin-top--0p5 vads-u-margin-x--1 vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--0">
        <h1>My Case Management Hub</h1>

        <p className="vads-u-color--gray-medium">
          The Case Management Hub enables Veterans to manage their entire
          VR&amp;E journey independently, from eligibility determination through
          program participation and completion.
        </p>

        {/* Progress indicator */}
        <div className="vads-u-margin-top--2">
          <va-segmented-progress-bar
            counters="small"
            current={String(current)}
            heading-text="VA Benefits"
            label="Label is here"
            labels={stepLabels.join(';')}
            total={String(total)}
          />
        </div>

        <div>
          <va-additional-info trigger="Additional Information">
            <p>Here are some popular pets to consider</p>
            <ul>
              <li>Dogs</li>
              <li>Cats</li>
              <li>Fish</li>
              <li>Birds</li>
            </ul>
          </va-additional-info>
        </div>

        {/* Actions */}
        <div className="vads-u-margin-top--3">
          <va-button
            class="vads-u-margin-right--1"
            secondary
            onClick={goPrev}
            disabled={current === 1}
            text="Previous step"
          />
          <va-button
            class="vads-u-margin-right--1"
            onClick={goNext}
            disabled={current === total}
            text="Next step"
          />
        </div>

        {/* Cards */}
        <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-margin-top--3">
          {cards.map(card => (
            <HubCard
              key={card.title}
              title={card.title}
              body={card.body}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCaseManagementHub;
