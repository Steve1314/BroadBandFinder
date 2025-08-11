import CustomerDetail from '../models/CustomerDetail.js';

export const createCustomer = async (req, res) => {
  try {
    const customer = await CustomerDetail.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCustomers = async (req, res) => {
  const customers = await CustomerDetail.find();
  res.json(customers);
};
