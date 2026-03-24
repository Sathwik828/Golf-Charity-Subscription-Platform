const { supabase } = require('../utils/supabase');

exports.verifyWin = async (req, res) => {
  const { winnerId, verificationUrl } = req.body;
  try {
    const { data, error } = await supabase
      .from('winners')
      .update({ verification_url: verificationUrl })
      .eq('id', winnerId)
      .select();

    if (error) throw error;
    res.status(200).json({ message: 'Scorecard link submitted for verification', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.approveWin = async (req, res) => {
  const { winnerId } = req.body;
  try {
    const { data, error } = await supabase
      .from('winners')
      .update({ 
        is_verified: true, 
        approved_at: new Date().toISOString() 
      })
      .eq('id', winnerId)
      .select();

    if (error) throw error;
    res.status(200).json({ message: 'Winner approved!', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUnverifiedWinners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('winners')
      .select('id, user_id, matches_count, prize_amount, verification_url, created_at')
      .eq('is_verified', false)
      .not('verification_url', 'is', null);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
