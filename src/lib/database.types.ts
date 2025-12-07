export type MoodState = 'energized' | 'calm' | 'neutral' | 'tired';
export type ComfortType = 'warmth' | 'stillness' | 'distraction';

export interface CheckIn {
  id: string;
  session_id: string;
  mood_state: MoodState;
  comfort_type: ComfortType;
  created_at: string;
}

export interface DailyMetrics {
  id: string;
  date: string;
  total_check_ins: number;
  mood_breakdown: Record<MoodState, number>;
  comfort_breakdown: Record<ComfortType, number>;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      check_ins: {
        Row: CheckIn;
        Insert: Omit<CheckIn, 'id' | 'created_at'>;
        Update: Partial<Omit<CheckIn, 'id' | 'created_at'>>;
      };
      daily_metrics: {
        Row: DailyMetrics;
        Insert: Omit<DailyMetrics, 'id' | 'updated_at'>;
        Update: Partial<Omit<DailyMetrics, 'id' | 'updated_at'>>;
      };
    };
  };
}
