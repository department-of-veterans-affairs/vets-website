// Introduction Section Test

describe('<Introduction>', () => {
  describe('Section flow', () => {
    afterEach((client, done) => {
      done();
    });

    beforeEach((client, done) => {
      done();
    });

    it('Clicking <ProgressButton> moves user to the next page.', (client) => {
      client
        .url('http://localhost:8080/')
        .assert.urlContains('introduction')
        .expect.element('button.text-capitalize').to.be.present.before(1000);

      client
        .click('button.text-capitalize')
        .pause(1000)
        .assert.urlContains('personal-information');
    });
  });
});
