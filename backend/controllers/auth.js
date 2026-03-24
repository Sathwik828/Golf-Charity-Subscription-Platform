const { supabase } = require('../utils/supabase');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    res.status(201).json({ message: 'User created successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    res.status(200).json({ message: 'Login successful', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
