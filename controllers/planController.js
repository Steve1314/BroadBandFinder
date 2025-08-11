import Plan from '../models/Plan.js';

export const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPlans = async (req, res) => {
  const plans = await Plan.find().populate('zipcode');
  res.json(plans);
};
