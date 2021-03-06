const express = require("express");

function updateGETHandler(context, pgClient) {
  return async function (req, res) {
    const query = `SELECT * FROM Note WHERE id=$1;`;
    const values = [req.params.id];

    const { rows } = await pgClient.query(query, values);
    res.render("update", { context, data: rows[0] });
  };
}

function updatePOSTHandler(context, pgClient) {
  return async function (req, res) {
    const query = `UPDATE Note SET title=$1, body=$2 WHERE id=$3 RETURNING *;`;
    const values = [req.body.title, req.body.body, req.params.id];

    await pgClient.query(query, values);
    res.redirect(`${context.basePath}/`);
  };
}

function makeUpdateRouter(context, pgClient) {
  const router = express.Router();

  router.get("/:id", updateGETHandler(context, pgClient));

  router.post("/:id", updatePOSTHandler(context, pgClient));

  return router;
}

module.exports = { makeUpdateRouter };
