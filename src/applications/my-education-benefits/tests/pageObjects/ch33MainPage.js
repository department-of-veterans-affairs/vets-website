class ch33MainPage {
  getStartYourApplicationLink() {
    return cy
      .get(
        'div a.vads-c-action-link--green.vads-u-padding-left--0:nth-child(2)',
      )
      .contains('Start your application');
  }
}

export default ch33MainPage;
