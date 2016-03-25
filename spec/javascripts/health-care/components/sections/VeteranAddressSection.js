describe('<VeteranAddressSection>', () => {
  describe('form can be filled as expected', () => {
    afterEach((client, done) => {
      done();
    });

    beforeEach((client, done) => {
      done();
    });

    it('Email element', (client) => {
      client
        .url('http://localhost:8080/#/personal-information/veteran-address')
        .assert.urlContains('veteran-address')
        .expect.element('body').to.be.present.before(1000);
    });

    it('Clicking <ProgressButton> moves user to the next page.', (client) => {
      client
        .url('http://localhost:8080/#/personal-information/veteran-address')
        .assert.urlContains('veteran-address')
        .expect.element('button.text-capitalize').to.be.present.before(1000);

      client
        .click('button.text-capitalize')
        .pause(1000)
        .assert.urlContains('insurance-information');
    });
  });
});
