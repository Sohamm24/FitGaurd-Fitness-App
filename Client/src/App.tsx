import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import ActivitiesPage from './pages/ActivitiesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

type WorkoutType = 'CARDIO' | 'STRENGTH' | 'HIIT' | 'YOGA';

type WorkoutForm = {
  form: string;
  caloriesPer3Sets: number;
  targetMuscle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

type DailyActivity = {
  date: string;
  restBPM: number;
  avgBPM: number;
  maxBPM: number;
  workoutType: WorkoutType;
  caloriesBurnt: number;
  anomalies: string[];
  recommendedForms: WorkoutForm[];
};

type UserAnalytics = {
  userCalories: number;
  avgCalories: number;
  userFrequency: number;
  userEfficiency: number;
  waterIntake: number;
  goodFactors: string[];
  improvementFactors: string[];
};

const API_BASE_URL = 'http://localhost:5000/api';

const App: React.FC = () => {
  const [activityData, setActivityData] = useState<DailyActivity | null>(null);
  const [analyticsData, setAnalyticsData] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch activities and analytics data
        const [activitiesResponse, analyticsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/activities`),
          axios.get(`${API_BASE_URL}/analytics`)
        ]);

        setActivityData(activitiesResponse.data);
        setAnalyticsData(analyticsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Using fallback data.');
        
        // Fallback to dummy data if API fails
        setActivityData({
          date: 'October 18, 2025',
          restBPM: 65,
          avgBPM: 135,
          maxBPM: 178,
          workoutType: 'HIIT',
          caloriesBurnt: 420,
          anomalies: [
            "Calorie burnt exceeded for your body physique aspect"
          ],
          recommendedForms: [
            {
              form: 'Push-ups',
              caloriesPer3Sets: 45,
              targetMuscle: 'Chest, Triceps',
              difficulty: 'Easy'
            },
            {
              form: 'Burpees',
              caloriesPer3Sets: 85,
              targetMuscle: 'Full Body',
              difficulty: 'Hard'
            },
            {
              form: 'Mountain Climbers',
              caloriesPer3Sets: 60,
              targetMuscle: 'Core, Cardio',
              difficulty: 'Medium'
            },
            {
              form: 'Squats',
              caloriesPer3Sets: 50,
              targetMuscle: 'Legs, Glutes',
              difficulty: 'Easy'
            },
            {
              form: 'Plank Hold',
              caloriesPer3Sets: 30,
              targetMuscle: 'Core',
              difficulty: 'Medium'
            },
            {
              form: 'Jump Squats',
              caloriesPer3Sets: 75,
              targetMuscle: 'Legs, Cardio',
              difficulty: 'Hard'
            }
          ]
        });

        setAnalyticsData({
          userCalories: 380,
          avgCalories: 320,
          userFrequency: 3,
          userEfficiency: 75,
          waterIntake: 1.5,
          goodFactors: [
            "Your workout efficiency of 75% is above average, showing good form and technique",
            "Calorie burn of 380 per session exceeds community average by 18.75%",
            "Your heart rate zones indicate excellent cardiovascular engagement during workouts"
          ],
          improvementFactors: [
            "Increase workout frequency to 4-5 days per week for optimal results",
            "Boost water intake to 2.5-3L daily to enhance recovery and performance",
            "Consider adding strength training to complement your HIIT routine",
            "Focus on post-workout nutrition within 30 minutes to maximize muscle recovery"
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-xl font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Loading Balex...
          </p>
        </div>
      </div>
    );
  }

  // Error state with fallback data
  if (error) {
    console.warn(error);
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        {/* Error notification */}
        {error && (
          <div className="bg-yellow-950/50 border-b border-yellow-900/50 p-3">
            <div className="max-w-6xl mx-auto px-4">
              <p className="text-yellow-400 text-sm">
                ⚠️ {error}
              </p>
            </div>
          </div>
        )}

        <main className="p-4 md:p-6 max-w-6xl mx-auto pb-24 md:pb-6">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route 
              path="/activities" 
              element={activityData ? <ActivitiesPage data={activityData} /> : null} 
            />
            <Route 
              path="/analytics" 
              element={analyticsData ? <AnalyticsPage /> : null} 
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;