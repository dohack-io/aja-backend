const express = require("express");
const router = express.Router();
const logger = require("../../logger");
const httpContext = require("express-http-context");
const User = require("../../models/user");
const Garden = require("../../models/garden");
const Team = require("../../models/team");

router.delete("/user/:userid/garden/:gardenid", async (req, res, next) => {
  logger.info(
    "DELETE /user/%s/garden/%s",
    req.params.userid,
    req.params.gardenid,
    {
      reqId: httpContext.get("reqId")
    }
  );
  const user = await User.getById(req.params.userid);
  if (!user) {
    next({
      status: 404,
      message: "User not found"
    });
    return;
  }
  const garden = await Garden.getById(req.params.gardenid);
  if (!garden) {
    next({
      status: 404,
      message: "Garden not found"
    });
    return;
  }
  if (!garden.team_id) {
    next({
      status: 400,
      message: "Garden is not taken"
    });
    return;
  }
  const result = await Garden.update(req.params.gardenid, {team_id: null})
  res.result = result;
  next();
});

module.exports = router;
