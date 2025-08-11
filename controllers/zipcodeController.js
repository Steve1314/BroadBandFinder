import NodeCache from "node-cache";
import Zipcode from "../models/Zipcode.js";

const myCache = new NodeCache();

// Create
export const createZipcode = async (req, res) => {
  try {
    const zipcode = await Zipcode.create(req.body);
    res.status(201).json(zipcode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read (paginated & filter by city)
export const getZipcodes = async (req, res) => {
  try {
    const { city, page = 1, limit = 50 } = req.query;
    const query = city ? { city: { $regex: new RegExp(city, "i") } } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const zipcodes = await Zipcode.find(query).skip(skip).limit(parseInt(limit));
    const total = await Zipcode.countDocuments(query);

    res.json({
      data: zipcodes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get unique cities
export const getCities = async (req, res) => {
  try {
    const cities = await Zipcode.distinct("city");
    res.json({
      totalCities: cities.length,
      cities: cities.sort()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dashboard stats in one API
export const getStats = async (req, res) => {
  try {
    const totalZipcodes = await Zipcode.countDocuments();
    const cities = await Zipcode.distinct("city");

    // Example pending filter - adjust if your schema has a status field
    const pendingUpdates = await Zipcode.countDocuments({ status: "pending" });

    res.json({
      totalZipcodes,
      activeCities: cities.length,
      pendingUpdates
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateZipcode = async (req, res) => {
  try {
    const { id } = req.params;
    const zipcode = await Zipcode.findByIdAndUpdate(id, req.body, { new: true });
    if (!zipcode) return res.status(404).json({ message: "Zipcode not found" });
    res.json(zipcode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteZipcode = async (req, res) => {
  try {
    const { id } = req.params;
    const zipcode = await Zipcode.findByIdAndDelete(id);
    if (!zipcode) return res.status(404).json({ message: "Zipcode not found" });
    res.json({ message: "Zipcode deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
