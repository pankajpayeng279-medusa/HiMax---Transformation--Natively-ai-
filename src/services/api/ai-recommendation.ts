import type { AIRecommendation } from '../../types/dashboard';

const mockRecommendation: AIRecommendation = {
  title: 'Protein & Strength Push',
  description:
    'Based on your progress this week, I recommend increasing your protein intake to 180g and adding an extra day of strength training. Your body fat is trending down nicely — keep it up!',
  actionLabel: 'View Full Plan',
  actionType: 'coach',
};

/**
 * Returns today's AI-generated recommendation.
 * In production, this would call the Gemma/Fireworks AI edge function.
 */
export async function getTodayRecommendation(): Promise<AIRecommendation> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockRecommendation;
}