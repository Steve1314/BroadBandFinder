import Zipcode from '../models/Zipcode.js';
import ZipSearchCount from '../models/ZipSearchCount.js';

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

    // 📌 Log search to ZipSearchCount
    // If you also store city, we'll fetch it after finding the zipcode record
    let cityName = null;

    const record = await Zipcode.findOne({ zipcode });

    if (record) {
      cityName = record.city;

      // ✅ Increment search count
      await ZipSearchCount.create({ zipcode, city: cityName });
    } else {
      // ❌ CASE: Zipcode not found — log it with city as "Unknown"
      await ZipSearchCount.create({ zipcode, city: 'Unknown' });

      return res.status(200).json({
        message: 'Zipcode not found. Showing default providers.',
        zipcode,
        providers: defaultProviders
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
// Generic function for a provider
export const searchSpecificProviderByZipcode = (providerName) => {
  return async (req, res) => {
    try {
      const zipcode = (req.query.zipcode || '').trim();

      if (!zipcode) {
        return res.status(400).json({ error: 'Zipcode is required as query param.' });
      }

      // Fetch record from DB
      const record = await Zipcode.findOne({ zipcode });

      if (!record) {
        // Log unsuccessful search
        await ZipSearchCount.create({ zipcode, city: 'Unknown' });

        return res.status(200).json({
          message: `Zipcode not found. ${providerName} is not available.`,
          zipcode,
          providers: []
        });
      }

      // Log search attempt
      await ZipSearchCount.create({ zipcode, city: record.city });

      // Find the requested provider
      const provider = record.types.find(
        p => p.typeName.toLowerCase().includes(providerName.toLowerCase()) && p.availability
      );

      return res.status(200).json({
        message: provider
          ? `${providerName} is available in this zipcode.`
          : `${providerName} is not available in this zipcode.`,
        city: record.city,
        zipcode: record.zipcode,
        provider: provider || null
      });

    } catch (err) {
      console.error(`${providerName} search error:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Export specific provider searches
export const searchSpectrumByZipcode = searchSpecificProviderByZipcode('Spectrum');
export const searchATTByZipcode = searchSpecificProviderByZipcode('AT&T');
export const searchComcastByZipcode = searchSpecificProviderByZipcode('Comcast');