import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import FeedbackEmail from '../components/shared/FeedbackEmail';

const LandingPage = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([{ url: '/my-health', label: 'Dashboard' }], {
          url: '/my-health/medical-records',
          label: 'About medical records',
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="landing-page">
      <section>
        <h1>About VA medical records</h1>
        <p className="vads-u-font-size--h3">
          This is a summary of what you can do with your medical records.
        </p>
      </section>
      <section>
        <h2>Lab and test results</h2>
        <va-link
          active
          href="/my-health/medical-records/labs-and-tests"
          text="Review your lab and test results"
        />
        <p>[Description of section]</p>
      </section>
      <section>
        <h2>Health history</h2>
        <va-link
          active
          href="/my-health/medical-records/health-history"
          text="Review your health history"
        />
        <p>
          [description of allergies; care summaries and notes; health
          conditions; vaccines; vitals]
        </p>
      </section>
      <section>
        <h2>Share your medical record</h2>
        <va-link
          active
          href="/my-health/medical-records/share-your-medical-record"
          text="Review your sharing options"
        />
        <p>[description of Health Summary/Blue Button/VHIE]</p>
      </section>
      <section>
        <h2>What to know as you try out this tool</h2>
        <p>
          We’re giving the trusted My HealtheVet medical records tools a new
          home here on VA.gov. You can use these tools to view your medical
          history online—just like you can today on the My HealtheVet website.
        </p>
        <p>
          We need your feedback to help us keep making this tool better for you
          and all Veterans.
        </p>
        <p>
          Email us at <FeedbackEmail /> to tell us what you think. We can also
          answer questions about how to use the tool.
        </p>
      </section>
      <section>
        <h2>Questions about your medical records</h2>
        <va-accordion bordered>
          <va-accordion-item>
            <h3 className="vads-u-font-size--h6" slot="headline">
              What can I do with medical records?
            </h3>
            <p>This is content about what to do with MR.</p>
            <p>
              This more content to see what this section might look like with a
              lot of content that spans onto more than one line.
            </p>
            <p>Here is a link to do stuff on My HealtheVet</p>
            <p>
              Some features might not be available in this new tool. If you have
              questions about your preferences, you can send us an email.
            </p>
            <p>
              Email us at <FeedbackEmail />
            </p>
          </va-accordion-item>
          <va-accordion-item header="Example question?">
            <p>Example answer.</p>
          </va-accordion-item>
          <va-accordion-item header="Another example question?">
            <p>Another example answer.</p>
          </va-accordion-item>
          <va-accordion-item header="This is a really long sample question to show what this might look like on multiple lines?">
            <p>
              This is a really long sample answer to show what this might look
              like on multiple lines.
            </p>
          </va-accordion-item>
          <va-accordion-item header="Last example question?">
            <p>Last example answer.</p>
          </va-accordion-item>
        </va-accordion>
      </section>
      <va-back-to-top />
    </div>
  );
};

export default LandingPage;
