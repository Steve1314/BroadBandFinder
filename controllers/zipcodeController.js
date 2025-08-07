import Zipcode from '../models/Zipcode.js';

export const createZipcode = async (req, res) => {
  try {
    const zipcode = await Zipcode.create(req.body);
    res.status(201).json(zipcode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getZipcodes = async (req, res) => {
  const zipcodes = await Zipcode.find();
  res.json(zipcodes);
};