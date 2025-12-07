import type { MoodState } from '../lib/database.types';

interface MoodOption {
  value: MoodState;
  label: string;
  description: string;
  emoji: string;
}

const moodOptions: MoodOption[] = [
  {
    value: 'energized',
    label: 'Wide-Awake Bear',
    description: 'Energized, excited, happy',
    emoji: '🐻'
  },
  {
    value: 'calm',
    label: 'Contentedly Sitting Bear',
    description: 'Calm, cozy, peaceful',
    emoji: '🧸'
  },
  {
    value: 'neutral',
    label: 'Pouting Bear',
    description: 'Neutral, bored, unfocused',
    emoji: '🐻‍❄️'
  },
  {
    value: 'tired',
    label: 'Tucked-in Bear',
    description: 'Tired, stressed, low energy',
    emoji: '😴'
  }
];

interface MoodSelectorProps {
  selectedMood: MoodState | null;
  onSelectMood: (mood: MoodState) => void;
}

export function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
        How's your snuggle quotient today?
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Choose the bear that best represents how you're feeling right now
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moodOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelectMood(option.value)}
            className={`p-6 rounded-2xl border-3 transition-all duration-300 transform hover:scale-105 ${
              selectedMood === option.value
                ? 'border-amber-500 bg-amber-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div className="text-6xl mb-3">{option.emoji}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {option.label}
            </h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
