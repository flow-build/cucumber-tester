require("dotenv").config();
const { CustomWorld } = require('../../src/support/world')
const axios = require("axios");
const { logger } = require("../../src/utils/logger");
const { setWorldConstructor } = require("@cucumber/cucumber");

const FLOWBUILD_URL = process.env.FLOWBUILD_URL;

class AuthWorld extends CustomWorld {
    
  async authenticate() {
    logger.info("[AuthWorld] authenticate");
    const response = await axios({
      method: "post",
      url: "/login",
      baseURL: FLOWBUILD_URL,
      data: {
        email: this.email,
        password: this.password,
      },
    });
    logger.info("getToken received");
    this.token = response.data.jwtToken;
  }
    
  async getToken() {
    logger.info("[AuthWorld] getToken");
    const response = await axios({
      method: "get",
      url: "/anonymousToken",
      baseURL: FLOWBUILD_URL,
    });
    logger.debug("getAnonymousToken received");
    this.token = response.data.jwtToken;
  }
}

setWorldConstructor(AuthWorld);