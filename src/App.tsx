import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Welcome } from './components/Welcome';
import { MoodSelector } from './components/MoodSelector';
import { ComfortSelector } from './components/ComfortSelector';
import { Results } from './components/Results';
import { supabase } from './lib/supabase';
import { getSessionId, hasVisitedBefore } from './lib/session';
import type { MoodState, ComfortType } from './lib/database.types';

type Step = 'welcome' | 'mood' | 'comfort' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedMood, setSelectedMood] = useState<MoodState | null>(null);
  const [selectedComfort, setSelectedComfort] = useState<ComfortType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isReturningUser = hasVisitedBefore();

  const handleStart = () => {
    setCurrentStep('mood');
  };

  const handleMoodSelect = (mood: MoodState) => {
    setSelectedMood(mood);
  };

  const handleComfortSelect = (comfort: ComfortType) => {
    setSelectedComfort(comfort);
  };

  const handleSubmit = async () => {
    if (!selectedMood || !selectedComfort) return;

    setIsSubmitting(true);
    try {
      const sessionId = getSessionId();

      const { error } = await supabase.from('check_ins').insert({
        session_id: sessionId,
        mood_state: selectedMood,
        comfort_type: selectedComfort
      });

      if (error) throw error;

      setCurrentStep('results');
    } catch (error) {
      console.error('Error submitting check-in:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setSelectedMood(null);
    setSelectedComfort(null);
    setCurrentStep('welcome');
  };

  const canProceedFromMood = selectedMood !== null;
  const canSubmit = selectedMood !== null && selectedComfort !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          {currentStep === 'welcome' && (
            <Welcome onStart={handleStart} isReturningUser={isReturningUser} />
          )}

          {currentStep === 'mood' && (
            <div className="w-full">
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={handleMoodSelect}
              />
              {canProceedFromMood && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setCurrentStep('comfort')}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-full hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'comfort' && (
            <div className="w-full">
              <ComfortSelector
                selectedComfort={selectedComfort}
                onSelectComfort={handleComfortSelect}
              />
              {canSubmit && (
                <div className="text-center mt-8 space-x-4">
                  <button
                    onClick={() => setCurrentStep('mood')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-full hover:from-amber-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Getting your comfort...' : 'Get My Comfort Prescription'}
                    {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'results' && selectedMood && selectedComfort && (
            <Results
              mood={selectedMood}
              comfort={selectedComfort}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>The Comfort Census · Your daily sanctuary for emotional check-ins</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
