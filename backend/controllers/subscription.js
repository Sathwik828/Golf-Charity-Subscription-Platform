const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('../utils/supabase');

exports.createCheckoutSession = async (req, res) => {
  const { planType, userId, email } = req.body;
  
  // Replace these with your actual Stripe Price IDs from the dashboard
  const priceIds = {
    monthly: 'price_monthly_id_here',
    yearly: 'price_yearly_id_here',
  };

  const selectedPriceId = priceIds[planType];

  if (!selectedPriceId) {
    return res.status(400).json({ error: 'Invalid plan type' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscriptions`,
      customer_email: email,
      metadata: {
        userId: userId,
        planType: planType,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
