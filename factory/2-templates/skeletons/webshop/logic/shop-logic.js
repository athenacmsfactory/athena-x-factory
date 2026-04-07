import { loadStripe } from '@stripe/stripe-js';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Athena V9.2 Standard: Stripe Integration
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * createCheckoutSession
 * Redirects the user to a Stripe Checkout page.
 * Requires a backend endpoint (Cloud Function / Next.js API) to create the session.
 */
export async function createCheckoutSession(items) {
  const stripe = await getStripe();
  
  // 1. Log the intent in Firestore (Pending Order)
  const user = auth.currentUser;
  const orderRef = await addDoc(collection(db, 'orders'), {
    uid: user?.uid || 'guest',
    items: items,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  // 2. Call backend to get Stripe Session ID
  // Note: Replace with actual backend URL
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      items, 
      orderId: orderRef.id,
      successUrl: `${window.location.origin}/success?id=${orderRef.id}`,
      cancelUrl: `${window.location.origin}/cart`
    }),
  });

  const session = await response.json();

  // 3. Redirect to Stripe
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    console.error(result.error.message);
    throw new Error('Stripe redirect failed');
  }
}

/**
 * trackShopEvent
 * Utility for shop-related analytics
 */
export function trackShopEvent(eventName, data) {
  console.log(`[ShopAnalytics] ${eventName}:`, data);
  // Integration with Firebase Analytics can be added here
}
