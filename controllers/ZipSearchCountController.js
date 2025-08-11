import ZipSearchCount from "../models/ZipSearchCount.js";
export const zipcodeSearchCount = async (req, res) => {

   try {
    const topZipcodes = await ZipSearchCount.aggregate([
      { $group: { _id: { zipcode: "$zipcode", city: "$city" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json(topZipcodes);
    console.log(topZipcodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
