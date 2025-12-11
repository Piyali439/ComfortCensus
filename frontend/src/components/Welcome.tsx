import { Heart, TrendingUp } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
  isReturningUser: boolean;
}

export function Welcome({ onStart, isReturningUser }: WelcomeProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 text-center">
      <div className="bg-gradient-to-br from-amber-100 to-rose-100 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center shadow-xl">
        <span className="text-7xl">🧸</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Welcome to the Comfort Census
      </h1>

      {isReturningUser && (
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full mb-6">
          <TrendingUp className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Welcome back, friend!</span>
        </div>
      )}

      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        A simple, interactive check-in to measure your daily "Snuggle Quotient."
        <br />
        Share how you're feeling, and we'll offer you a personalized comfort tip.
      </p>

      <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg max-w-xl mx-auto">
        <div className="flex items-start text-left space-x-4">
          <Heart className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
            <ol className="text-gray-600 space-y-2 text-sm">
              <li>1. Choose your current mood from our bear friends</li>
              <li>2. Tell us what type of comfort you need</li>
              <li>3. Receive your personalized comfort prescription</li>
            </ol>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-12 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-lg font-semibold rounded-full hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Start Your Check-In
      </button>

      <p className="text-sm text-gray-500 mt-6">
        Takes less than 30 seconds · Completely anonymous
      </p>
    </div>
  );
}
