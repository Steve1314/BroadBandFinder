import Zipcode from '../models/Zipcode.js';

export const searchProvidersByZipcode = async (req, res) => {
  try {
    const zipcode = (req.query.zipcode || '').trim();

    const defaultProviders = [
      { typeName: 'Spectrum Business', availability: true },
      { typeName: 'Comcast Business', availability: true },
      { typeName: 'AT&T Business', availability: true }
    ];

    // ❌ CASE: No zipcode provided
    if (!zipcode) {
      return res.status(400).json({
        error: 'Zipcode is required as query param.'
      });
    }

    const record = await Zipcode.findOne({ zipcode });
    // ❌ CASE: Zipcode not found — show default
    if (!record) {
      return res.status(200).json({
        message: 'Zipcode not found. Showing default providers.',
        zipcode,
      });
    }

    // ✅ CASE: Found — return available or default
    const availableProviders = record.types.filter(p => p.availability);

    return res.status(200).json({
      message: availableProviders.length
        ? 'Providers found.'
        : 'No providers available for this zipcode. Showing default providers.',
      city: record.city,
      zipcode: record.zipcode,
      providers: availableProviders.length ? availableProviders : defaultProviders
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
