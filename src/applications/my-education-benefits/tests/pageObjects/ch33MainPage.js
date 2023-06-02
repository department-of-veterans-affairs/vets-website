class ch33MainPage {
  getStartYourApplicationLink() {
    return cy
      .get('div a.vads-c-action-link--green:nth-child(2)')
      .contains('Start your application');
  }
}

export default ch33MainPage;
