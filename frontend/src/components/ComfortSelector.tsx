import { Coffee, Heart, Sparkles } from 'lucide-react';
import type { ComfortType } from '../lib/database.types';

interface ComfortOption {
  value: ComfortType;
  label: string;
  description: string;
  icon: typeof Coffee;
}

const comfortOptions: ComfortOption[] = [
  {
    value: 'warmth',
    label: 'Warmth',
    description: 'I need something to eat or drink',
    icon: Coffee
  },
  {
    value: 'stillness',
    label: 'Stillness',
    description: 'I need quiet time',
    icon: Heart
  },
  {
    value: 'distraction',
    label: 'Distraction',
    description: 'I need something to do',
    icon: Sparkles
  }
];

interface ComfortSelectorProps {
  selectedComfort: ComfortType | null;
  onSelectComfort: (comfort: ComfortType) => void;
}

export function ComfortSelector({ selectedComfort, onSelectComfort }: ComfortSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
        What kind of comfort do you need?
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Let us know how we can help you feel better
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comfortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => onSelectComfort(option.value)}
              className={`p-6 rounded-2xl border-3 transition-all duration-300 transform hover:scale-105 ${
                selectedComfort === option.value
                  ? 'border-rose-500 bg-rose-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-md'
              }`}
            >
              <Icon
                className={`w-12 h-12 mx-auto mb-3 ${
                  selectedComfort === option.value ? 'text-rose-500' : 'text-gray-400'
                }`}
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {option.label}
              </h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
