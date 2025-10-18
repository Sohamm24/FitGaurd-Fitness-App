import React, { useState } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

type WorkoutType = 'CARDIO' | 'STRENGTH' | 'HIIT' | 'YOGA';

type DailyActivity = {
  date: string;
  restBPM: number;
  avgBPM: number;
  maxBPM: number;
  workoutType: WorkoutType;
  caloriesBurnt: number;
  anomalies: string[];
};

type UserAnalytics = {
  userCalories: number;
  avgCalories: number;
  userFrequency: number;
  userEfficiency: number;
  waterIntake: number;
  goodFactors: string[],
  improvementFactors: string[]
};

type PageType = 'activities' | 'analytics';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('activities');

  const activityData: DailyActivity = {
    date: 'October 18, 2025',
    restBPM: 65,
    avgBPM: 135,
    maxBPM: 178,
    workoutType: 'HIIT',
    caloriesBurnt: 420,
    anomalies: [
     "Calorie burnt exceeded for your body physique aspect"
    ]
  };

  const analyticsData: UserAnalytics = {
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
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-4 md:p-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent ${
               currentPage === 'activities' 
                 ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500' 
                 : 'bg-gradient-to-r from-blue-500 to-emerald-500'
             }`}>
               Balex
             </h1>
            
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => setCurrentPage('activities')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'activities'
                    ? 'bg-black'
                    : 'bg-black hover:bg-zinc-900'
                }`}
              >
                <Activity className={`inline-block w-5 h-5 mr-2 ${
                  currentPage === 'activities' ? 'text-pink-500' : 'text-gray-400'
                }`} />
                <span className={currentPage === 'activities' 
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
                }>
                  Activities
                </span>
              </button>
              <button
                onClick={() => setCurrentPage('analytics')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'analytics'
                    ? 'bg-black'
                    : 'bg-black hover:bg-zinc-900'
                }`}
              >
                <TrendingUp className={`inline-block w-5 h-5 mr-2 ${
                  currentPage === 'analytics' ? 'text-emerald-500' : 'text-gray-400'
                }`} />
                <span className={currentPage === 'analytics'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
                }>
                  Analytics
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="p-4 md:p-6 max-w-6xl mx-auto pb-24 md:pb-6">
        {currentPage === 'activities' ? (
          <ActivitiesPage data={activityData} />
        ) : (
          <AnalyticsPage data={analyticsData} />
        )}
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 p-4">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => setCurrentPage('activities')}
            className="flex-1 px-3 py-3 rounded-lg transition-all bg-black"
          >
            <div className="flex flex-col items-center gap-1">
              <Activity className={`w-5 h-5 ${
                currentPage === 'activities' ? 'text-pink-500' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                currentPage === 'activities'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
              }`}>
                Activities
              </span>
            </div>
          </button>
          <button
            onClick={() => setCurrentPage('analytics')}
            className="flex-1 px-3 py-3 rounded-lg transition-all bg-black"
          >
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className={`w-5 h-5 ${
                currentPage === 'analytics' ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                currentPage === 'analytics'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent font-bold'
                  : 'text-gray-400'
              }`}>
                Analytics
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const ActivitiesPage: React.FC<{ data: DailyActivity }> = ({ data }) => {
  return (
    <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-white bg-clip-text text-transparent">Today's Activity</h2>
     <p className="text-gray-500">{data.date}</p>
     
     <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
       <div className="lg:col-span-3 grid grid-cols-2 gap-4">
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
    </div>
  );
};

const AnalyticsPage: React.FC<{ 
  data: UserAnalytics; 
}> = ({ data }) => {
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const efficiencyChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
  // Performance Chart
  if (performanceChartRef.current) {
    const ctx = performanceChartRef.current.getContext('2d');
    if (ctx) {
      const performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Your Performance',
              data: [380, 420, 360, 400, 450, 390, 410],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 2,
              pointHoverRadius: 12,
              pointBackgroundColor: 'rgb(59, 130, 246)',
              pointHoverBackgroundColor: 'yellow',
            },
            {
              label: 'Community Avg',
              data: [320, 310, 330, 315, 325, 320, 318],
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 2,
              pointHoverRadius: 12,
              pointBackgroundColor: 'rgb(16, 185, 129)',
              pointHoverBackgroundColor: 'yellow',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animations: {
            radius: {
              duration: 400,
              easing: 'linear',
              loop: (context) => context.active
            }
          },
          interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          plugins: {
            legend: {
              labels: {
                color: '#fff',
                font: { size: 12 }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { display: false },
              ticks: { color: '#9ca3af' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9ca3af' }
            }
          }
        }
      });

      return () => performanceChart.destroy();
    }
  }
}, []);

useEffect(() => {
  // Efficiency Chart
  if (efficiencyChartRef.current) {
    const ctx = efficiencyChartRef.current.getContext('2d');
    if (ctx) {
      const efficiencyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
          datasets: [{
            label: 'Efficiency %',
            data: [65, 68, 70, 72, 75, 73, 76, 78, 75, 77, 80, 82, 79, 81, 83, 85, 82, 84, 86, 88, 85, 87, 89, 90, 88, 91, 92, 90, 93, 95],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 1,
            pointHoverRadius: 12,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointHoverBackgroundColor: 'yellow',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animations: {
            radius: {
              duration: 400,
              easing: 'linear',
              loop: (context) => context.active
            }
          },
          interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          plugins: {
            legend: {
              labels: {
                color: '#fff',
                font: { size: 12 }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { display: false },
              ticks: { color: '#9ca3af' }
            },
            x: {
              grid: { display: false },
              ticks: { 
                color: '#9ca3af',
                maxTicksLimit: 10
              }
            }
          }
        }
      });

      return () => efficiencyChart.destroy();
    }
  }
}, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
        Analytics crafted for you
      </h2>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left Section - 20% - 3 Vertical Boxes */}
        <div className="lg:col-span-1 flex lg:flex-col flex-row gap-4">
          <div className="flex-1 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100" style={{padding: '2px'}}>
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-xs font-semibold opacity-90">Water Intake</p>
                <svg className="w-5 h-5 text-blue-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{data.waterIntake}L</p>
            </div>
          </div>

          <div className="flex-1 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100" style={{padding: '2px'}}>
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-xs font-semibold opacity-90">Frequency</p>
                <svg className="w-5 h-5 text-emerald-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{data.userFrequency} <span className="text-sm text-gray-400">days</span></p>
            </div>
          </div>

          <div className="flex-1 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100" style={{padding: '2px'}}>
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-xs font-semibold opacity-90">Efficiency</p>
                <svg className="w-5 h-5 text-blue-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{data.userEfficiency}%</p>
            </div>
          </div>
        </div>

        {/* Middle Section - 40% - Performance Chart */}
        <div className="lg:col-span-2 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100" style={{padding: '2px'}}>
            <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
          </div>
          <div className="relative">
            <h3 className="text-sm font-bold mb-4 text-white">Weekly Performance Comparison</h3>
            <div className="h-64">
              <canvas ref={performanceChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Right Section - 40% - Efficiency Chart */}
        <div className="lg:col-span-2 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100" style={{padding: '2px'}}>
            <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
          </div>
          <div className="relative">
            <h3 className="text-sm font-bold mb-4 text-white">30-Day Efficiency Trend</h3>
            <div className="h-64">
              <canvas ref={efficiencyChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 opacity-100" style={{padding: '2px'}}>
          <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
        </div>
        <div className="relative">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-emerald-400">What's Working Well</h4>
            </div>
            <div className="space-y-2">
              {data.goodFactors.map((factor : string , idx : number) => (
                <div key={idx} className="bg-emerald-950/30 rounded-lg p-4 border border-emerald-900/40">
                  <p className="text-gray-200 leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>
          </div>
      
          {/* Improvement Factors Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="text-lg font-semibold text-orange-400">Areas for Improvement</h4>
            </div>
            <div className="space-y-2">
              {data.improvementFactors.map((factor : string, idx : number) => (
                <div key={idx} className="bg-orange-950/30 rounded-lg p-4 border border-orange-900/40">
                  <p className="text-gray-200 leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;