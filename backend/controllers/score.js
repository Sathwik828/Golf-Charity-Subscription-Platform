const { supabase } = require('../utils/supabase');

exports.addScore = async (req, res) => {
  const { userId, score } = req.body;

  if (score < 1 || score > 45) {
    return res.status(400).json({ error: 'Score must be between 1 and 45' });
  }

  try {
    // 1. Fetch current scores for the user
    const { data: scores, error: fetchError } = await supabase
      .from('golf_scores')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (fetchError) throw fetchError;

    // 2. If user already has 5 scores, delete the oldest one
    if (scores.length >= 5) {
      const oldestScoreId = scores[0].id;
      const { error: deleteError } = await supabase
        .from('golf_scores')
        .delete()
        .eq('id', oldestScoreId);

      if (deleteError) throw deleteError;
    }

    // 3. Insert the new score
    const { data, error: insertError } = await supabase
      .from('golf_scores')
      .insert([{ user_id: userId, score: score }])
      .select();

    if (insertError) throw insertError;

    res.status(201).json({ message: 'Score added successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getScores = async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
