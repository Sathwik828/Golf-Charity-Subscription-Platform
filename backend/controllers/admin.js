const { supabase } = require('../utils/supabase');

exports.getAdminOverview = async (req, res) => {
  try {
    // 1. Total Users (using admin API)
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Admin Overview - User Error:', userError);
    }
    const userCount = userData?.users?.length || 0;
    
    // 2. Active Subscriptions
    const { count: activeCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // 3. Total Prize Pool Awarded
    const { data: winners, error: winnersError } = await supabase
      .from('winners')
      .select('prize_amount, charity_amount');

    if (winnersError) {
      console.error('Admin Overview - Winners Error:', winnersError);
    }

    const totalPrize = winners?.reduce((acc, curr) => acc + parseFloat(curr.prize_amount || 0), 0) || 0;
    const totalCharity = winners?.reduce((acc, curr) => acc + parseFloat(curr.charity_amount || 0), 0) || 0;

    res.status(200).json({
      totalUsers: userCount,
      activeSubscriptions: activeCount || 0,
      totalPrizeAwarded: totalPrize,
      totalCharityDonated: totalCharity
    });
  } catch (error) {
    console.error('CRITICAL: Admin Overview Failed:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('subscriptions')
      .select('user_id, status, plan_type, created_at');

    if (error) throw error;
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
