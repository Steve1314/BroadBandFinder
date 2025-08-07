import fs from 'fs';
import csv from 'csv-parser';
import Zipcode from '../models/Zipcode.js';

export const handleCsvUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No CSV files uploaded.' });
    }

    // For each uploaded file
    for (const file of req.files) {
      const rows = [];

      // Read each CSV file
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
              const isAvailable =
                raw && typeof raw === 'string' && raw.toLowerCase().includes('available');

              types.push({
                typeName: provider,
                availability: !!isAvailable,
              });
            });

            if ( zipcode) {
              rows.push({ city, zipcode, number, types });
            }
          })
          .on('end', () => {
              console.log(`✅ Parsed ${rows.length} rows from: ${file.originalname}`);
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          });
        

      });

      // Insert each record one by one, with deduplication
      for (const record of rows) {
        await Zipcode.findOneAndUpdate(
          { zipcode: record.zipcode },
          record,
          { upsert: true, new: true }
        );
      }

      // Delete temp file
      fs.unlinkSync(file.path);

    }

    res.status(201).json({ message: 'All CSV files processed and data saved without duplication.' });

  } catch (err) {
    console.error('CSV Upload Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
