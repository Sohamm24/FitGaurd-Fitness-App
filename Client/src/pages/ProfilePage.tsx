import React, { useState, useEffect } from 'react';
import { Save, User as UserIcon } from 'lucide-react';

type UserProfile = {
  goal: string;
  sessionDuration: number;
  workoutFrequency: number;
};

const ProfilePage: React.FC = () => {
  // Initialize state with default values or from in-memory storage
  const [profile, setProfile] = useState<UserProfile>({
    goal: '',
    sessionDuration: 30,
    workoutFrequency: 3
  });

  const [isSaved, setIsSaved] = useState(false);

   useEffect(() => {
     const savedProfile = localStorage.getItem('userProfile');
     if (savedProfile) {
       setProfile(JSON.parse(savedProfile));
     }
   }, []);

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    console.log('Profile saved:', profile);
    setIsSaved(true); 
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <UserIcon className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Your Profile
        </h2>
      </div>
      <p className="text-gray-400">Customize your fitness journey</p>

      <div className="bg-black rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 opacity-100" style={{padding: '2px'}}>
          <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
        </div>
        
        <div className="relative space-y-6">
          {/* Goal Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Fitness Goal
            </label>
            <input
              type="text"
              value={profile.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              placeholder="e.g., Lose weight, Build muscle, Stay fit"
              className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Session Duration Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Session Duration (minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={profile.sessionDuration}
                onChange={(e) => handleInputChange('sessionDuration', parseInt(e.target.value))}
                className="flex-1 h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${((profile.sessionDuration - 15) / (120 - 15)) * 100}%, #27272a ${((profile.sessionDuration - 15) / (120 - 15)) * 100}%, #27272a 100%)`
                }}
              />
              <div className="w-20 bg-zinc-900 border border-orange-900/30 rounded-lg px-3 py-2 text-center">
                <span className="text-orange-500 font-bold">{profile.sessionDuration}</span>
                <span className="text-gray-400 text-xs ml-1">min</span>
              </div>
            </div>
          </div>

          {/* Workout Frequency Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Workout Frequency (days per week)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={profile.workoutFrequency}
                onChange={(e) => handleInputChange('workoutFrequency', parseInt(e.target.value))}
                className="flex-1 h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #eab308 0%, #eab308 ${((profile.workoutFrequency - 1) / (7 - 1)) * 100}%, #27272a ${((profile.workoutFrequency - 1) / (7 - 1)) * 100}%, #27272a 100%)`
                }}
              />
              <div className="w-20 bg-zinc-900 border border-orange-900/30 rounded-lg px-3 py-2 text-center">
                <span className="text-yellow-500 font-bold">{profile.workoutFrequency}</span>
                <span className="text-gray-400 text-xs ml-1">days</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Profile
            </button>
          </div>

          {/* Success Message */}
          {isSaved && (
            <div className="bg-green-950/50 border border-green-900/50 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400 font-medium">Profile saved successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;