const { supabase } = require('../utils/supabase');

exports.runDraw = async (req, res) => {
  const { prizePool, userId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "User ID is required" });
  }

  if (!prizePool) {
    return res.status(400).json({ error: "Prize pool is required" });
  }

  // 1. Generate 5 random winning numbers (1-45)
  const winningNumbers = [];
  while (winningNumbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!winningNumbers.includes(num)) {
      winningNumbers.push(num);
    }
  }

  try {
    // 2. Fetch previous rollover
    const { data: lastDraw } = await supabase
      .from('draws')
      .select('jackpot_rollover')
      .eq('is_completed', true)
      .order('draw_date', { ascending: false })
      .limit(1)
      .single();

    const currentRollover = lastDraw?.jackpot_rollover || 0;
    const activePrizePool = parseFloat(prizePool) + parseFloat(currentRollover);

    // 3. Create the draw record
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert([
        {
          user_id: userId,
          draw_name: `Monthly Draw - ${new Date().toLocaleDateString()}`,
          winning_numbers: winningNumbers.join(','),
          total_prize_pool: activePrizePool,
          is_completed: false
        }
      ])
      .select()
      .single();

    if (drawError) throw drawError;

    // 4. Fetch all scores AND their subscription/charity info
    const { data: userScores, error: scoreError } = await supabase
      .from('golf_scores')
      .select('user_id, score');

    if (scoreError) throw scoreError;

    const { data: userDataWithCharity, error: userError } = await supabase
      .from('subscriptions')
      .select('user_id, charity_id, additional_donation');

    if (userError) throw userError;

    const charityMap = {};
    userDataWithCharity.forEach(sub => {
      charityMap[sub.user_id] = { id: sub.charity_id, extra: sub.additional_donation || 0 };
    });

    // 5. Group scores and identify matches
    const userMatches = {};
    userScores.forEach(item => {
      if (!userMatches[item.user_id]) userMatches[item.user_id] = 0;
      if (winningNumbers.includes(item.score)) {
        userMatches[item.user_id]++;
      }
    });

    // 6. Determine winners and charity splits
    let hasJackpotWinner = false;
    const winners = [];
    Object.entries(userMatches).forEach(([userId, count]) => {
      if (count >= 3) {
        if (count === 5) hasJackpotWinner = true;
        
        const fullPrize = calculatePrize(count, activePrizePool);
        const charitySelection = charityMap[userId];
        const baseCharityAmount = fullPrize * 0.10;
        const totalCharityAmount = baseCharityAmount + (charitySelection?.extra || 0);
        const netUserPrize = fullPrize - totalCharityAmount;

        winners.push({
          draw_id: draw.id,
          user_id: userId,
          matches_count: count,
          prize_amount: netUserPrize,
          charity_id: charitySelection?.id || null,
          charity_amount: totalCharityAmount
        });
      }
    });

    let nextRollover = 0;
    if (!hasJackpotWinner) {
      nextRollover = activePrizePool * 0.40;
    }

    if (winners.length > 0) {
      const { error: winnerError } = await supabase.from('winners').insert(winners);
      if (winnerError) throw winnerError;
    }

    await supabase
      .from('draws')
      .update({ is_completed: true, jackpot_rollover: nextRollover })
      .eq('id', draw.id);

    res.status(200).json({
      message: 'Draw completed!',
      winningNumbers,
      winnersCount: winners.length,
      jackpotRollover: nextRollover,
      totalPoolRan: activePrizePool
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function calculatePrize(matches, totalPool) {
  if (matches === 5) return totalPool * 0.40;
  if (matches === 4) return totalPool * 0.35;
  if (matches === 3) return totalPool * 0.25;
  return 0;
}