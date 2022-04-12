const { openBrowser, goto, closeBrowser, $ } = require('taiko');

describe('Transaction stat table', () => {
  beforeAll(async() => {
    await openBrowser();
    await goto('localhost:8080/#/affiliate-program');
  }, 60000);

  test('affiliate main table should exist', async() => {
    await $('#affiliateMainTable').exists()
    const rows = await $('#affiliateMainTable tbody').elements()
    expect(rows.length).toBeGreaterThan(0);
  });

  afterAll(async() => {
    await closeBrowser();
  });
});