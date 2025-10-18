import React from 'react';

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

interface ActivitiesPageProps {
  data: DailyActivity;
}

const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-white bg-clip-text text-transparent">Today's Activity</h2>
      <p className="text-gray-500">{data.date}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          {/* Rest BPM Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100" style={{padding: '2px'}}>
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Rest BPM</p>
                <svg className="w-6 h-6 text-purple-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.restBPM}</p>
            </div>
          </div>
          
          {/* Average BPM Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-pink-500/10 hover:shadow-pink-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100" style={{padding: '2px'}}>
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Average BPM</p>
                <svg className="w-6 h-6 text-pink-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.avgBPM}</p>
            </div>
          </div>
          
          {/* Max BPM Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-orange-500/10 hover:shadow-orange-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100" style={{padding: '2px'}}>
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Max BPM</p>
                <svg className="w-6 h-6 text-orange-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.maxBPM}</p>
            </div>
          </div>
          
          {/* Calories Burnt Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100" style={{padding: '2px'}}>
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Calories Burnt</p>
                <svg className="w-6 h-6 text-pink-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.caloriesBurnt}</p>
            </div>
          </div>
        </div>
      
        {/* Workout Type Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col justify-center items-center">
          <svg className="w-12 h-12 text-white opacity-90 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white text-sm mb-3 font-semibold opacity-90">Workout Type</p>
          <span className="text-2xl font-bold text-white text-center">
            {data.workoutType}
          </span>
        </div>
      </div>
      
      {/* Anomalies Section */}
      {data.anomalies.length > 0 ? (
        <div className="bg-zinc-900 rounded-lg p-6 border border-red-900">
          <h3 className="text-xl font-bold mb-4 text-red-500">⚠️ Anomalies Detected</h3>
          <div className="space-y-3">
            {data.anomalies.map((anomaly, idx) => (
              <div key={idx} className="bg-black rounded-lg p-4 border border-red-900/30">
                <p className="text-gray-300">{anomaly}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 opacity-100" style={{padding: '2px'}}>
            <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
          </div>
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              All Clear!
            </h3>
            <p className="text-gray-400 text-sm">
              No anomalies detected - Keep up the great work!
            </p>
          </div>
        </div>
      )}

      {/* Recommended Workout Forms Section */}
      <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100" style={{padding: '2px'}}>
          <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Recommended Workout Forms
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recommendedForms.map((form, idx) => (
              <div key={idx} className="bg-zinc-900/50 rounded-lg p-5 border border-purple-900/30 hover:border-pink-500/50 transition-all duration-300">
                <h4 className="text-lg font-bold text-white mb-3">{form.form}</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Calories (3 sets)</span>
                    <span className="text-orange-400 font-semibold">{form.caloriesPer3Sets} cal</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Target Muscle</span>
                    <span className="text-pink-400 font-semibold">{form.targetMuscle}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Difficulty</span>
                    <span className={`font-semibold px-2 py-1 rounded text-xs ${
                      form.difficulty === 'Easy' ? 'bg-green-950/50 text-green-400' :
                      form.difficulty === 'Medium' ? 'bg-yellow-950/50 text-yellow-400' :
                      'bg-red-950/50 text-red-400'
                    }`}>
                      {form.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;