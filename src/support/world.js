require("dotenv").config();
const axios = require("axios");
const { logger } = require("../utils/logger");
const FLOWBUILD_URL = process.env.FLOWBUILD_URL;
const actualTimeout = setTimeout;

function wait(ms = 5000) {
  return new Promise((resolve) => {
    actualTimeout(resolve, ms);
  });
}
class CustomWorld {
  constructor() {
    this.email = process.env.DEFAULT_EMAIL;
    this.password = process.env.DEFAULT_PASSWORD;
  }

  async getToken(actorId, claims) {
    logger.verbose("getToken");
    const response = await axios({
      method: "post",
      url: "/token",
      baseURL: FLOWBUILD_URL,
      data: {
        actor_id: actorId,
        claims: claims,
      },
    });
    logger.debug("getToken received");
    this.token = response.data.jwtToken;
  }

  async startProcess(workflowName, initialBag) {
    logger.info(`startProcess ${workflowName}`);
    const response = await axios({
      method: "post",
      url: `/workflows/name/${workflowName}/start`,
      baseURL: FLOWBUILD_URL,
      headers: { Authorization: `Bearer ${this.token}` },
      data: initialBag,
    });
    logger.debug("startProcess received");
    this.pid = response.data.process_id;
    logger.info(`PID ${this.pid}`);
    return;
  }

  async submitActivity(payload) {
    logger.verbose(`submitActivity ${this.amid}`);
    const response = await axios({
      method: "post",
      url: `/activity_manager/${this.amid}/submit`,
      baseURL: FLOWBUILD_URL,
      headers: { Authorization: `Bearer ${this.token}` },
      data: JSON.parse(payload),
      validateStatus: function (status) {
        return status >= 200 && status < 405; // default
      },
    });
    logger.debug("submitActivity response");
    
    if (response.status > 200 && response.status < 300) {
      return true;
    } else {
      logger.warn(`status: ${response.status}, data: ${response.data}`);
    }
    return false;
  }

  async waitProcessStop() {
    logger.verbose(`waitProcessStop ${this.pid}`);
    const expectedStatus = ["waiting", "error", "finished"];
    do {
      await wait(1000);
      await this.getCurrentState();
      logger.debug(`process status: ${this.currentStatus}, node: ${this.nodeId}`);
    } while (!expectedStatus.includes(this.currentStatus));

    if (this.currentStatus === "waiting") {
      await this.getCurrentActivity();
    }
    return;
  }

  async getCurrentActivity() {
    logger.verbose(`getCurrentActivity ${this.pid}`);
    const response = await axios({
      method: "get",
      url: `/processes/${this.pid}/activity`,
      baseURL: FLOWBUILD_URL,
      headers: { Authorization: `Bearer ${this.token}` },
    });
    this.activity = response.data;
    this.amid = response.data.id;
    logger.info(`AMID ${this.amid}`);
    return;
  }

  async getCurrentState() {
    logger.verbose(`getCurrentState ${this.pid}`);
    const response = await axios({
      method: "get",
      url: `/processes/${this.pid}`,
      baseURL: FLOWBUILD_URL,
      headers: { Authorization: `Bearer ${this.token}` },
    });
    logger.debug("getCurrentState response");
    this.currentState = response.data;
    this.currentStatus = response.data.state.status;
    this.nodeId = response.data.state.node_id;
    return;
  }

  async getProcessHistory() {
    logger.verbose(`getProcessHistory ${this.pid}`);
    const response = await axios({
      method: "get",
      url: `/processes/${this.pid}/history`,
      baseURL: FLOWBUILD_URL,
      headers: { Authorization: `Bearer ${this.token}` },
    });
    logger.debug(`getProcessHistory response ${response.status}`);
    this.history = response.data;
    return response.data;
  }
}

module.exports = { CustomWorld }