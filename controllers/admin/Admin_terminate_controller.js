"use strict";

const app = require("express").Router();
const db = require("../../models");
const SessionService = require("../../services/SessionService");
const role = 1;

app.get(
  "/admin/terminate-config",
  SessionService.verifySessionMiddleware(role, "admin"),
  async (req, res) => {
    const config = await db.terminate_config.findOne();
    const sentConfig = config.dataValues;

    if (Object.keys(sentConfig).length === 0) {
      res.status(404).send("Configuration not found");
      return;
    }

    try {
      res.render("admin/View_Terminate_Config", {
        sentConfig: sentConfig,
        _base_url: "/admin/terminate-config",
        get_page_name: () => "Termination Configuration",
      });
    } catch (error) {
      console.error("Error fetching configuration:", error);
      res.status(500).send("Error fetching configuration");
    }
  }
);

app.get(
  "/admin/terminate-config/create",
  SessionService.verifySessionMiddleware(role, "admin"),
  async (req, res) => {
    const config = await db.terminate_config.findOne();
    const sentConfig = config.dataValues;

    if (Object.keys(sentConfig).length === 0) {
      res.status(404).send("Configuration not found");
      return;
    }

    try {
      res.render("admin/terminate_config", {
        sentConfig: sentConfig,
        _base_url: "/admin/terminate-config",
        get_page_name: () => "Create/Update Termination Configuration",
      });
    } catch (error) {
      console.error("Error fetching configuration:", error);
      res.status(500).send("Error fetching configuration");
    }
  }
);

app.post(
  "/admin/terminate-config",
  SessionService.verifySessionMiddleware(role, "admin"),
  async (req, res) => {
    const { message, countdown } = req.body;

    try {
      const parsedCountdown = +countdown;

      await db.terminate_config.upsert({
        id: 1,
        message: message,
        countdown: parsedCountdown,
      });

      res.redirect("/admin/terminate-config");
    } catch (error) {
      console.error("Error saving configuration:", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.get("/api/terminate-config", async (req, res) => {
  try {
    const config = await db.terminate_config.findOne();
    if (config) {
      res.json(config);
    } else {
      res.status(404).json({ message: "Configuration not found" });
    }
  } catch (error) {
    console.error("Failed to fetch termination config:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post(
  "/api/terminate-config",
  SessionService.verifySessionMiddleware(role, "admin"),
  async (req, res) => {
    try {
      const { message, countdown } = req.body;

      if (!message || typeof countdown !== "number") {
        return res.status(400).json({ error: "Invalid input" });
      }

      let config = await db.terminate_config.findOne();

      if (config) {
        config.message = message;
        config.countdown = countdown;
        await config.save();
        res.status(200).json(config);
      } else {
        config = await db.terminate_config.create({ message, countdown });
        res.status(201).json(config);
      }
    } catch (error) {
      console.error("Error creating or updating TerminateConfig:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = app;
