import PrivacyPolicy from '../models/PrivacyPolicy.js';

export const createPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.create(req.body);
    res.status(201).json(policy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPolicies = async (req, res) => {
  const policies = await PrivacyPolicy.find();
  res.json(policies);
};
