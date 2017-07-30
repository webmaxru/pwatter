import { PwatterPage } from './app.po';

describe('pwatter App', () => {
  let page: PwatterPage;

  beforeEach(() => {
    page = new PwatterPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
