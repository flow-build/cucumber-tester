const { Given } = require("@cucumber/cucumber");

Given("the default user is logged in", { timeout: 60 * 1000 }, async function () {
  await this.authenticate();
  return;
});

Given("que o usuario padrao esta logado", { timeout: 60 * 1000 }, async function () {
  await this.authenticate();
  return;
});
