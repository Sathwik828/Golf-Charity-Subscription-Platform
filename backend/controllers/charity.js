const { supabase } = require('../utils/supabase');

exports.getCharities = async (req, res) => {
  try {
    const { data, error } = await supabase.from('charities').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserCharity = async (req, res) => {
  const { userId, charityId, additionalDonation } = req.body;
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ 
        charity_id: charityId, 
        additional_donation: additionalDonation || 0 
      })
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    res.status(200).json({ message: 'Charity selection updated', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.seedCharities = async (req, res) => {
  const charities = [
    { name: 'Golf for Good', description: 'Supporting local youth golf programs.', website: 'https://golf4good.org' },
    { name: 'Green Fairways', description: 'Environmental conservation for golf courses.', website: 'https://greenfairways.org' },
    { name: 'Swing Foundation', description: 'Providing adaptive golf equipment for disabled veterans.', website: 'https://swingfoundation.org' }
  ];

  try {
    const { data, error } = await supabase.from('charities').insert(charities).select();
    if (error) throw error;
    res.status(201).json({ message: 'Charities seeded', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
