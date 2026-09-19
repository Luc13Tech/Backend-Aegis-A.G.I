const SiteContent = require('../../models/SiteContent');

async function list(req, res, next) {
  try {
    const blocks = await SiteContent.find().sort({ key: 1 });
    res.json(blocks);
  } catch (err) {
    next(err);
  }
}

async function upsert(req, res, next) {
  try {
    const { key } = req.params;
    const { value, type } = req.body;

    const block = await SiteContent.findOneAndUpdate(
      { key },
      { value, type: type || 'text', updatedBy: req.user._id },
      { new: true, upsert: true }
    );

    res.locals.contentId = block._id;
    res.json(block);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, upsert };
