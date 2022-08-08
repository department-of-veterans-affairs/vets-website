import React from 'react';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddInfo';
import ComposeForm from '../components/ComposeForm';

const Compose = () => {
  return (
    <div className="vads-l-grid-container vads-u-margin-top--2 compose-container">
      <nav>
        <a href="/messages" className="breadcrumb">
          <i className="fas fa-angle-left" />
          Messages
        </a>
        <button
          type="button"
          className="vads-u-margin-top--2 usa-button-secondary messages-nav-menu"
        >
          <span>In the Messages section</span>
          <i className="fas fa-bars" />
        </button>
      </nav>

      <h1 className="vads-u-margin-top--2">Compose Message</h1>
      <section>
        <p className="emergency-note">
          <strong>Note: </strong>
          Call <a href="tel:911">911</a> if you have a medical emergency. If
          you’re in crisis and need to talk to someone now, call the{' '}
          <a href="tel:988">Veterans Crisis Line</a>. To speak with a VA
          healthcare team member right away, contact your local VA call center.
        </p>
      </section>
      <div>
        <BeforeMessageAddlInfo />
      </div>

      <section className="compose-block">
        <div className="vads-u-display--flex vads-u-flex-direction--row compose-header">
          <h3 className="vads-u-margin-top--1 vads-u-margin-bottom--2">
            New Message
          </h3>
          <button type="button" className="send-button-top">
            <i className="fas fa-paper-plane" />
            <span className="send-button-top-text">Send</span>
          </button>
        </div>

        <ComposeForm />
      </section>
    </div>
  );
};

export default Compose;
