const express = require('express');
const router = express.Router();
const Notice = require('../models/notice');

// Mark notice as seen
router.post('/:id/seen', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (notice) {
      notice.views += 1;
      await notice.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;