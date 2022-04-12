const { openBrowser, goto, closeBrowser, click, $ } = require('taiko');
const assert = require('assert');

describe('Discount for beta testers', () => {
  beforeAll(async() => {
    await openBrowser();
  }, 60000);

  beforeEach(async() => {
    await goto('localhost:8080');
    await click($('#overviewButtonPay'));
  });

  test('free plan should have 20% or more discount', async() => {
    await click($('#buttonTryFree'));
    const discount = await parseInt(await $('#discountAmount').text(), 10) || 0;
    assert.equal(discount >= 20, true);
  });
  test('base plan should have 20% or more discount', async() => {
    await click($('#buttonTryBase'));
    const discount = await parseInt(await $('#discountAmount').text(), 10) || 0;
    assert.equal(discount >= 20, true);
  });
  test('team plan should have 20% or more discount', async() => {
    await click($('#buttonTryTeam'));
    const discount = await parseInt(await $('#discountAmount').text(), 10) || 0;
    assert.equal(discount >= 20, true);
  });
  test('enterprise plan should have 20% or more discount', async() => {
    await click($('#buttonTryEnterprise'));
    const discount = await parseInt(await $('#discountAmount').text(), 10) || 0;
    assert.equal(discount >= 20, true);
  });

  afterAll(async() => {
    await closeBrowser();
  });
});