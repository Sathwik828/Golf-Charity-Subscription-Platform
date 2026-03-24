const { supabase } = require('../utils/supabase');

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Fetch Subscription and Charity info
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, plan_type, charity_id, additional_donation')
      .eq('user_id', userId)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.error('Profile - Subscription Error:', subError);
      throw subError;
    }

    let charity = null;
    if (subscription?.charity_id) {
      const { data: charityInfo, error: charityError } = await supabase
        .from('charities')
        .select('name, description')
        .eq('id', subscription.charity_id)
        .single();
      
      if (charityError) {
        console.error('Profile - Charity Error:', charityError);
      }
      charity = charityInfo;
    }

    // 2. Fetch Recent Winnings
    const { data: winnings, error: winError } = await supabase
      .from('winners')
      .select('prize_amount, matches_count, is_verified, created_at, id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (winError) {
      console.error('Profile - Winnings Error:', winError);
      throw winError;
    }

    res.status(200).json({
      subscription: subscription || { status: 'none' },
      charity: charity || { name: 'None selected' },
      winnings: winnings || []
    });
  } catch (error) {
    console.error('CRITICAL: Profile Fetch Failed:', error);
    res.status(500).json({ error: error.message });
  }
};
