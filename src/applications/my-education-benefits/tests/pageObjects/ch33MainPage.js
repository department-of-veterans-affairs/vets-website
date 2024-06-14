class ch33MainPage {
  getStartYourApplicationLink() {
    return cy
      .get('div a.vads-c-action-link--green')
      .contains('Start your application');
  }
}

export default ch33MainPage;
