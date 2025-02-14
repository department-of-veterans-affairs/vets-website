import React from 'react';

const UserSelectPage = ({ userSelectContent }) => {
  return (
    <main id="main" className="main">
      <div className="section">
        <section className="login">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="container">{userSelectContent}</div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default UserSelectPage;
