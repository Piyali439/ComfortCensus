import { useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import type { MoodState, ComfortType } from '../lib/database.types';
import { getRecommendation } from '../data/recommendations';
import { supabase } from '../lib/supabase';
import type { Recommendation } from '../data/recommendations';


interface ResultsProps {
  mood: MoodState;
  comfort: ComfortType;
  recommendation: Recommendation;
  onStartOver: () => void;
  onCheckInAgain: () => void;
}

export function Results({ recommendation, onStartOver }: ResultsProps) {
  const [communityCount, setCommunityCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

 // const recommendation = getRecommendation(mood, comfort);

  useEffect(() => {
    fetchCommunityMetrics();
  }, []);

  const fetchCommunityMetrics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_metrics')
        .select('total_check_ins')
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setCommunityCount(data?.total_check_ins || 0);
    } catch (error) {
      console.error('Error fetching community metrics:', error);
      setCommunityCount(0);
    } finally {
      setLoading(false);
    }
  };

  if (!recommendation) {
        // This is a minimal check. You could return a loading spinner or null.
        return <div className="text-center p-10 text-rose-500">Calculating comfort...</div>;
    }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-md">
            <Heart className="w-10 h-10 text-rose-500" fill="currentColor" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {recommendation.title}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {recommendation.description}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Personalized Comfort Prescription:
          </h3>
          <ul className="space-y-3">
            {recommendation.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/70 rounded-2xl p-6 mb-6 border-2 border-amber-200">
          <div className="flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-400 mr-2" />
            <p className="text-gray-700">
              {loading ? (
                'Loading community stats...'
              ) : (
                <>
                  Together, our Sanctuary has shared{' '}
                  <span className="font-bold text-rose-600">{communityCount}</span>{' '}
                  {communityCount === 1 ? 'moment' : 'moments'} of comfort today
                </>
              )}
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStartOver}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-full hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Take Another Census
          </button>
        </div>
      </div>
    </div>
  );
}
