// src/components/CheckInForm.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { getRecommendation, Recommendation } from '../data/recommendations';

// Import the two selector components
import { MoodSelector } from './MoodSelector';
import { ComfortSelector } from './ComfortSelector'; 
import { Results } from './Results'; // Assuming you have a Results component for display
import type { Database } from '../lib/supabase';
//import type { MoodState, ComfortType, CheckIn } from '../lib/database.types'; 
import { Heart } from 'lucide-react'; // Example Icon for the button
import type { MoodState, ComfortType } from '../lib/database.types';

const CheckInForm: React.FC = () => {
    // --- State Management ---
    const [step, setStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState<MoodState | null>(null);
    const [selectedComfort, setSelectedComfort] = useState<ComfortType | null>(null);
    
    // State for API and Results
    const [prescription, setPrescription] = useState<Recommendation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper function to simulate session tracking (as designed before)
    const getSessionId = (): string => {
        let id = localStorage.getItem('session_id');
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem('session_id', id);
        }
        return id;
    };

    // --- Submission Handler ---
    const handleSubmitCheckIn = async () => {
        // Validation check (shouldn't fail if button is disabled correctly, but good practice)
        if (!selectedMood || !selectedComfort) {
            setError("Please complete both steps before submitting.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Generate the prescription
            const generatedRecommendation = getRecommendation(selectedMood, selectedComfort);

            // 2. Prepare the data for Supabase INSERT
            // The 'Insert' type ensures we omit auto-generated fields like id and created_at
            type CheckInInsert = Database['public']['Tables']['check_ins']['Insert'];

            const checkInPayload: CheckInInsert = {
                session_id: getSessionId(),
                mood_state: selectedMood,
                comfort_type: selectedComfort,
                // Note: The CheckIn type *must* allow for a 'session_id' field.
            };
            
            // 3. Insert data into Supabase
            const { error: insertError } = await supabase
                .from('check_ins')
                .insert([checkInPayload]);
            
            if (insertError) {
                // If there's an error here, the table or RLS is still the issue.
                throw new Error(insertError.message || "Failed to log check-in data.");
            }

            // 4. Update the component state to display the result and move to step 3
            setPrescription(generatedRecommendation);
            setStep(3);
            
        } catch (err) {
            console.error("Submission Error:", err);
            // Re-throw or display the error related to the missing table/RLS
            setError("Submission failed. Did you create the 'check_ins' table in Supabase and enable INSERT permissions (RLS)?");
        } finally {
            setLoading(false);
        }
    };

    // --- Render Logic ---
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <MoodSelector 
                            selectedMood={selectedMood} 
                            onSelectMood={(mood) => { 
                                setSelectedMood(mood); 
                                setStep(2); // Auto-advance to next step
                            }} 
                        />
                        <div className="text-center mt-8">
                            {/* Optional back button if needed */}
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <ComfortSelector 
                            selectedComfort={selectedComfort} 
                            onSelectComfort={setSelectedComfort} 
                        />
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Back to Mood
                            </button>

                            <button
                                onClick={handleSubmitCheckIn}
                                disabled={!selectedComfort || loading}
                                className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
                                    selectedComfort && !loading ? 'bg-rose-500 hover:bg-rose-600' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {loading ? 'Getting Prescription...' : 'Get My Prescription'}
                            </button>
                        </div>
                    </>
                );
            case 3:
                // Assuming Results.tsx is a component to display the prescription
                return prescription ? (
                    <Results 
                        recommendation={prescription} 
                        onCheckInAgain={() => { 
                            setStep(1); 
                            setSelectedMood(null); 
                            setSelectedComfort(null);
                            setPrescription(null);
                        }}
                    />
                ) : null;
            default:
                return <p>Start your check-in!</p>;
        }
    };

    return (
        <div className="py-12">
            {/* Display persistent error message */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 max-w-4xl mx-auto" role="alert">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}
            
            <div className="mb-10 text-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-100">
                    <Heart className="w-6 h-6 text-rose-500" />
                </span>
                <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
                    The Comfort Census
                </h1>
                <p className="text-gray-500">Step {step} of 2</p>
            </div>
            
            {renderStepContent()}
        </div>
    );
};

export default CheckInForm;