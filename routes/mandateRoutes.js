
const express = require('express');
const router = express.Router();
const {
  getMandateStatus,
  initiateMandate,
  mandateCallback
} = require("../controllers/mandateController");

router.post("/initiate", initiateMandate);
router.post("/callback", mandateCallback);
router.get("/:id", getMandateStatus); 


module.exports = router;
