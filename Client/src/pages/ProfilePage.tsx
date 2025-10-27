"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Save, UserIcon } from "lucide-react"

type UserProfile = {
  name: string
  age: number
  height: number 
  gender: "male" | "female"
  top_muscles: string[]
  experience_level: "beginner" | "intermediate" | "advanced"
  resting_bpm: number
  avg_bpm: number
  max_bpm: number
  workout_type: "HIIT" | "Strength" | "Cardio"
  water_intake: number
  fat_percentage: number
  calories_burned: number
  workout_frequency: number
  sessionDuration: number
}

const MUSCLE_OPTIONS = ["Arms", "Back", "Chest", "Core", "Full Body", "Legs", "Shoulders"]
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"]
const WORKOUT_TYPES = ["HIIT", "Strength", "Cardio"]

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: 25,
    height: 1.5,
    gender: "male",
    top_muscles: [],
    experience_level: "beginner",
    resting_bpm: 60,
    avg_bpm: 100,
    max_bpm: 180,
    workout_type: "Strength",
    water_intake: 2,
    fat_percentage: 20,
    calories_burned: 500,
    workout_frequency: 3,
    sessionDuration: 30,
  })

  const [isSaved, setIsSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setProfile(() => ({
          ...parsed,
          top_muscles: parsed.top_muscles || [],
        }))
      } catch (e) {
        console.error("Failed to parse saved profile:", e)
      }
    }
  }, [])

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!profile.name.trim()) newErrors.name = "Name is required"
    if (profile.age < 13 || profile.age > 120) newErrors.age = "Age must be between 13 and 120"
    if (profile.top_muscles.length !== 3) newErrors.top_muscles = "Select exactly 3 muscle groups"
    if (profile.resting_bpm < 40 || profile.resting_bpm > 100)
      newErrors.resting_bpm = "Resting BPM must be between 40-100"
    if (profile.avg_bpm < 60 || profile.avg_bpm > 200) newErrors.avg_bpm = "Average BPM must be between 60-200"
    if (profile.max_bpm < 100 || profile.max_bpm > 220) newErrors.max_bpm = "Max BPM must be between 100-220"
    if (profile.max_bpm <= profile.avg_bpm) newErrors.max_bpm = "Max BPM must be greater than average BPM"
    if (profile.water_intake < 0 || profile.water_intake > 10)
      newErrors.water_intake = "Water intake must be between 0-10 litres"
    if (profile.fat_percentage < 5 || profile.fat_percentage > 50)
      newErrors.fat_percentage = "Fat percentage must be between 5-50%"
    if (profile.calories_burned < 0 || profile.calories_burned > 5000)
      newErrors.calories_burned = "Calories burned must be between 0-5000"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof UserProfile, value: string | number | string[]) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsSaved(false)
  }

  const handleMuscleToggle = (muscle: string) => {
    setProfile((prev) => {
      const updated = prev.top_muscles.includes(muscle)
        ? prev.top_muscles.filter((m) => m !== muscle)
        : [...prev.top_muscles, muscle]
      return { ...prev, top_muscles: updated }
    })
    setIsSaved(false)
  }

  const handleSave = () => {
    if (validateProfile()) {
      localStorage.setItem("userProfile", JSON.stringify(profile))
      console.log("Profile saved:", profile)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <UserIcon className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-bold">
          Your Profile
        </h2>
      </div>
      <p className="text-gray-400">Customize your fitness journey</p>

      <div className="bg-black rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 opacity-100"
          style={{ padding: "2px" }}
        >
          <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
        </div>

        <div className="relative space-y-8">
          {/* Personal Information Section */}
          <div className="border-b border-orange-900/30 pb-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value))}
                  min="13"
                  max="120"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
              </div>

               <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Height</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => handleInputChange("height", Number.parseFloat(e.target.value))}
                  min="1"
                  max="2"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
              </div>
            </div>

            {/* Gender */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profile.gender === "male"}
                    onChange={(e) => handleInputChange("gender", e.target.value as "male" | "female")}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-gray-300">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profile.gender === "female"}
                    onChange={(e) => handleInputChange("gender", e.target.value as "male" | "female")}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-gray-300">Female</span>
                </label>
              </div>
            </div>
          </div>

          {/* Fitness Goals Section */}
          <div className="border-b border-orange-900/30 pb-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Fitness Goals</h3>

            {/* Top Muscles */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Top 3 Muslces you like to work on
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MUSCLE_OPTIONS.map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => handleMuscleToggle(muscle)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      (profile.top_muscles || []).includes(muscle)
                        ? "bg-orange-500 text-white border border-orange-400"
                        : "bg-zinc-900 text-gray-300 border border-orange-900/30 hover:border-orange-500"
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
              {errors.top_muscles && <p className="text-red-400 text-xs mt-2">{errors.top_muscles}</p>}
            </div>

            {/* Experience Level */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Experience Level</label>
              <select
                value={profile.experience_level}
                onChange={(e) =>
                  handleInputChange("experience_level", e.target.value as "beginner" | "intermediate" | "advanced")
                }
                className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level} className="bg-zinc-900">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Health Metrics Section */}
          <div className="border-b border-orange-900/30 pb-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Today's Health Metrics</h3>

             <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Workout Type</label>
              <select
                value={profile.workout_type}
                onChange={(e) => handleInputChange("workout_type", e.target.value as "HIIT" | "Strength" | "Cardio")}
                className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                {WORKOUT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-zinc-900">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              {/* Resting BPM */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Resting BPM</label>
                <input
                  type="number"
                  value={profile.resting_bpm}
                  onChange={(e) => handleInputChange("resting_bpm", Number.parseInt(e.target.value))}
                  min="40"
                  max="100"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.resting_bpm && <p className="text-red-400 text-xs mt-1">{errors.resting_bpm}</p>}
              </div>

              {/* Average BPM */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Average BPM</label>
                <input
                  type="number"
                  value={profile.avg_bpm}
                  onChange={(e) => handleInputChange("avg_bpm", Number.parseInt(e.target.value))}
                  min="60"
                  max="200"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.avg_bpm && <p className="text-red-400 text-xs mt-1">{errors.avg_bpm}</p>}
              </div>

              {/* Max BPM */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Max BPM</label>
                <input
                  type="number"
                  value={profile.max_bpm}
                  onChange={(e) => handleInputChange("max_bpm", Number.parseInt(e.target.value))}
                  min="100"
                  max="220"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.max_bpm && <p className="text-red-400 text-xs mt-1">{errors.max_bpm}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Fat Percentage */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Fat Percentage (%)</label>
                <input
                  type="number"
                  value={profile.fat_percentage}
                  onChange={(e) => handleInputChange("fat_percentage", Number.parseFloat(e.target.value))}
                  min="5"
                  max="50"
                  step="0.1"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.fat_percentage && <p className="text-red-400 text-xs mt-1">{errors.fat_percentage}</p>}
              </div>

              {/* Water Intake */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Water Intake (litres)</label>
                <input
                  type="number"
                  value={profile.water_intake}
                  onChange={(e) => handleInputChange("water_intake", Number.parseFloat(e.target.value))}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Calories Burned */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Calories Burned</label>
                <input
                  type="number"
                  value={profile.calories_burned}
                  onChange={(e) => handleInputChange("calories_burned", Number.parseInt(e.target.value))}
                  min="0"
                  max="5000"
                  className="w-full bg-zinc-900 border border-orange-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                {errors.calories_burned && <p className="text-red-400 text-xs mt-1">{errors.calories_burned}</p>}
              </div>
            </div>
          </div>

          {/* Workout Schedule Section */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Workout Schedule</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workout Frequency */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Workout Frequency for this week
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={profile.workout_frequency}
                    onChange={(e) => handleInputChange("workout_frequency", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #eab308 0%, #eab308 ${((profile.workout_frequency - 1) / (7 - 1)) * 100}%, #27272a ${((profile.workout_frequency - 1) / (7 - 1)) * 100}%, #27272a 100%)`,
                    }}
                  />
                  <div className="w-20 bg-zinc-900 border border-orange-900/30 rounded-lg px-3 py-2 text-center">
                    <span className="text-yellow-500 font-bold">{profile.workout_frequency}</span>
                    <span className="text-gray-400 text-xs ml-1">days</span>
                  </div>
                </div>
              </div>

              {/* Session Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Average session duration for this week</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    value={profile.sessionDuration}
                    onChange={(e) => handleInputChange("sessionDuration", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${((profile.sessionDuration - 15) / (120 - 15)) * 100}%, #27272a ${((profile.sessionDuration - 15) / (120 - 15)) * 100}%, #27272a 100%)`,
                    }}
                  />
                  <div className="w-20 bg-zinc-900 border border-orange-900/30 rounded-lg px-3 py-2 text-center">
                    <span className="text-orange-500 font-bold">{profile.sessionDuration}</span>
                    <span className="text-gray-400 text-xs ml-1">min</span>
                  </div>
                </div>
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
  )
}

export default ProfilePage
