import csv from 'csv-parser';
import fs from 'fs';
import Provider from '../models/Provider.js';
import Zipcode from '../models/Zipcode.js';

const providers = [
  { name: "AT&T Business", startingPrice: "$70/mo", speed: "300 Mbps", conditions: "taxes + installation charges" },
  { name: "Spectrum Business", startingPrice: "$80/mo", speed: "750 Mbps", conditions: "taxes + installation charges" },
  { name: "Comcast Business", startingPrice: "$30/mo", speed: "200 Mbps", conditions: "taxes + installation charges" },
];

const providerDetailsData = {
  SpectrumBusiness: `
Spectrum Business Pricing:
- 500 Mbps Business Internet - $50/month
- No contract required
- 24/7 customer support
- Additional services available upon request
`,
  "AT&TBusiness": `         
AT&T Fiber Basic Pricing & Offers:
- 20% Internet Savings Offer on eligible plans
- Autopay & Paperless Billing discounts available
- $150 Reward Card with purchase of Internet 1000 plan
- Terms and conditions apply
`,
  ComcastBusiness: `
Comcast Business Internet:
- 150 Mbps starting at $89.99/month
- TV packages available
- Business support and setup
`,
};

export const handleCsvUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No CSV files uploaded.' });
    }

    for (const file of req.files) {
      const rows = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
          .pipe(csv())
          .on('data', (data) => {
            const city = (data['City'] || '').trim();
            const zipcode = (data['Zip Code'] || data['Zip'] || '').trim().replace(/\r/g, '');
            const number = parseInt(data['S.B. Zip'] || '0');

            const types = [];
            ['Spectrum Business', 'Comcast Business', 'AT&T Business'].forEach((provider) => {
              const raw = data[provider];
              const isAvailable = raw && typeof raw === 'string' && raw.toLowerCase().includes('available');
              types.push({
                typeName: provider,
                availability: !!isAvailable,
              });
            });

            if (zipcode) {
              rows.push({ city, zipcode, number, types });
            }
          })
          .on('end', () => {
            console.log(`✅ Parsed ${rows.length} rows from: ${file.originalname}`);
            resolve();
          })
          .on('error', (err) => reject(err));
      });

      for (const record of rows) {
        await Zipcode.findOneAndUpdate(
          { zipcode: record.zipcode },
          record,
          { upsert: true, new: true }
        );
      }

      // Also store provider details
      for (const p of providers) {
        const detailsKey = p.name.replace(/\s+/g, '');
        await Provider.findOneAndUpdate(
          { name: p.name },
          {
            ...p,
            details: providerDetailsData[detailsKey] || '',
          },
          { upsert: true, new: true }
        );
      }

      fs.unlinkSync(file.path);
    }

    res.status(201).json({ message: 'All CSV files processed and data saved without duplication, including provider info.' });

  } catch (err) {
    console.error('CSV Upload Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
