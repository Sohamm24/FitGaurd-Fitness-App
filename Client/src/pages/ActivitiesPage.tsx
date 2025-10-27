"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"

type WorkoutType = "CARDIO" | "STRENGTH" | "HIIT" | "YOGA"

type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced"

interface UserProfile {
  age?: number
  avg_bpm?: number
  calories_burned?: number
  experience_level?: ExperienceLevel
  gender?: string
  goal?: string
  name?: string
  resting_bpm?: number
  sessionDuration?: number
  top_muscles?: string[]
  workoutFrequency?: number
  workout_frequency?: number
  workout_type?: WorkoutType
  weight?: number
  height?: number
  max_bpm?: number
  fat_percentage?: number
  water_intake?: number
}


type DailyActivity = {
  date: string
  restBPM: number
  avgBPM: number
  maxBPM: number
  workoutType: WorkoutType
  caloriesBurnt: number
}

type RecommendedExercise = {
  avg_bpm: number
  equipment: string
  est_calories: number
  exercise_id: number
  exercise_name: string
  experience_level: string
  form_name: string
  intensity_level: string
  popularity_score: number
  similarity_score: number
}

type RecommendationsResponse = {
  [muscle: string]: RecommendedExercise[]
}

type AnomalyResponse = {
  anomaly: number
  contributing_factors: {
    AvgBPM: number
    CaloriesBurned: number
    Calories_per_Minute: number
    Exertion_Index: number
    MaxBPM: number
  }
  message: string
  score: number
}

interface ActivitiesPageProps {
  data: DailyActivity
}

const API_BASE_URL = "http://localhost:5000/api"

const ActivitiesPage: React.FC<ActivitiesPageProps> = () => {
  const [recommendations, setRecommendations] = useState<RecommendationsResponse>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [anomalyData, setAnomalyData] = useState<AnomalyResponse | null>(null)
  const [anomalyLoading, setAnomalyLoading] = useState(false)
  const [anomalyError, setAnomalyError] = useState<string | null>(null)

  const [data, setData] = useState<DailyActivity>({
    date: new Date().toLocaleDateString(),
    restBPM: 0,
    avgBPM: 0,
    maxBPM: 0,
    workoutType: "HIIT",
    caloriesBurnt: 0,
  })

  const prepareAnomalyPayload = (userProfile: UserProfile) => {
    const age = userProfile.age || 30
    const weight = userProfile.weight || 70
    const height = userProfile.height || 1.75
    const avgBPM = userProfile.avg_bpm || 110
    const maxBPM = userProfile.max_bpm || 220
    const restingBPM = userProfile.resting_bpm || 70
    const sessionDuration = userProfile.sessionDuration || 0.75
    const caloriesBurned = userProfile.calories_burned || 300
    const fatPercentage = userProfile.fat_percentage || 15
    const waterIntake = userProfile.water_intake || 0.5
    const workoutFrequency = userProfile.workout_frequency || 3

    // Compute BMI
    const bmi = weight / (height * height)

    // Compute derived metrics
    const maxBPM_to_AvgBPM = maxBPM / avgBPM
    const avgBPM_minus_RestingBPM = avgBPM - restingBPM
    const exertion_Index = 300
    const calories_per_Minute = 10.67
    const calories_per_Weight = 5.08
    const bmi_to_FatPercentage = 1.47
    const waterIntake_per_Minute = 0.013

    // Determine gender (1 for male, 0 for female)
    const gender_Male = userProfile.gender?.toLowerCase() === "male" ? 1 : 0
    const gender_Female = 1 - gender_Male

    // Determine workout type
    const workoutType = (userProfile.workout_type || "HIIT").toUpperCase()
    const workoutType_Cardio = workoutType === "CARDIO" ? 1 : 0
    const workoutType_HIIT = workoutType === "HIIT" ? 1 : 0
    const workoutType_Strength = workoutType === "STRENGTH" ? 1 : 0
    const workoutType_Yoga = workoutType === "YOGA" ? 1 : 0

    // Determine experience level
    const experienceLevel = userProfile.experience_level || "Intermediate"
    const experienceLevel_1 = experienceLevel === "Beginner" ? 1 : 0
    const experienceLevel_2 = experienceLevel === "Intermediate" ? 1 : 0
    const experienceLevel_3 = experienceLevel === "Advanced" ? 1 : 0

    return {
      Age: age,
      Weight: weight,
      Height: height,
      MaxBPM: maxBPM,
      AvgBPM: avgBPM,
      RestingBPM: restingBPM,
      SessionDuration: sessionDuration,
      CaloriesBurned: caloriesBurned,
      FatPercentage: fatPercentage,
      WaterIntake: waterIntake,
      WorkoutFrequency: workoutFrequency,
      BMI: bmi,
      MaxBPM_to_AvgBPM: maxBPM_to_AvgBPM,
      AvgBPM_minus_RestingBPM: avgBPM_minus_RestingBPM,
      Exertion_Index: exertion_Index,
      Calories_per_Minute: calories_per_Minute,
      Calories_per_Weight: calories_per_Weight,
      BMI_to_FatPercentage: bmi_to_FatPercentage,
      WaterIntake_per_Minute: waterIntake_per_Minute,
      Gender_Female: gender_Female,
      Gender_Male: gender_Male,
      WorkoutType_Cardio: workoutType_Cardio,
      WorkoutType_HIIT: workoutType_HIIT,
      WorkoutType_Strength: workoutType_Strength,
      WorkoutType_Yoga: workoutType_Yoga,
      ExperienceLevel_1: experienceLevel_1,
      ExperienceLevel_2: experienceLevel_2,
      ExperienceLevel_3: experienceLevel_3,
    }
  }

  useEffect(() => {
    const userProfile: UserProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    const activityData: DailyActivity = {
      date: new Date().toLocaleDateString(),
      restBPM: userProfile.resting_bpm || 70,
      avgBPM: userProfile.avg_bpm || 120,
      maxBPM: userProfile.max_bpm || 150,
      workoutType: (userProfile.workout_type || "HIIT") as WorkoutType,
      caloriesBurnt: userProfile.calories_burned || 250,
    }

    setData(activityData)

    const fetchAnomalyData = async () => {
      try {
        setAnomalyLoading(true)
        const payload = prepareAnomalyPayload(userProfile)
        const response = await axios.post(`${API_BASE_URL}/anomaly`, payload)
        console.log(response)
        setAnomalyData(response.data)
        setAnomalyError(null)
      } catch (err) {
        console.error("Error fetching anomaly data:", err)
        setAnomalyError("Failed to load anomaly detection")
      } finally {
        setAnomalyLoading(false)
      }
    }

    fetchAnomalyData()
  }, [])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userProfile") || "{}")
        const topMuscles = userData.top_muscles || ["Chest", "Core", "Legs"]
        console.log(topMuscles)
        const experienceLevel = userData.experience_level || "Intermediate"
        const avgBpm = userData.avg_bpm || 110

        const response = await axios.post(`${API_BASE_URL}/recommend`, {
          top_muscles: topMuscles,
          experience_level: experienceLevel,
          avg_bpm: avgBpm,
        })
        console.log(response)

        setRecommendations(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError("Failed to load recommendations")
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [data.avgBPM])

  const getDifficultyColor = (intensity: string) => {
    switch (intensity) {
      case "Low":
        return "bg-green-950/50 text-green-400"
      case "Medium":
        return "bg-yellow-950/50 text-yellow-400"
      case "High":
        return "bg-red-950/50 text-red-400"
      default:
        return "bg-gray-950/50 text-gray-400"
    }
  }

  const getAnomalyStatusColor = (isAnomalous: boolean) => {
    return isAnomalous ? "from-red-500 via-orange-500 to-red-600" : "from-green-500 via-emerald-500 to-teal-500"
  }

const getContributingFactorInsights = (factors: AnomalyResponse["contributing_factors"]) => {
  const insights: { label: string; insight: string}[] = []

  if (factors.AvgBPM > 120) {
    insights.push({
      label: "Heart Rate",
      insight: "Your average heart rate was unusually high. Consider monitoring your pacing or hydration."
    })
  }

  if (factors.MaxBPM > 180) {
    insights.push({
      label: "Peak Intensity",
      insight: "Your peak heart rate reached a risky level. Take adequate rest before your next session."
    })
  }

  if (factors.Exertion_Index > 300) {
    insights.push({
      label: "Exertion Level",
      insight: "You exerted yourself more than normal. Ensure proper recovery and avoid overtraining."
    })
  }

  if (factors.Calories_per_Minute > 60) {
    insights.push({
      label: "Calorie Burn Rate",
      insight: "Calorie burn rate was higher than typical. Slow down intensity if you feel fatigue or strain."
    })
  }

  if (factors.CaloriesBurned > 400) {
    insights.push({
      label: "Total Calories",
      insight: "Overall calorie expenditure was higher than your usual pattern. Check nutrition and rest balance."
    })
  }
  return insights
}


  const getAnomalyMessage = (isAnomalous: boolean) => {
    if (isAnomalous) {
      return {
        title: "Ooh, Your Workout Had Some Overexertion!",
        description:
          "We detected some unusual patterns in your workout metrics. Check out what pushed your limits today:",
      }
    } else {
      return {
        title: "Wow, Your Routine Was Perfect for You! ",
        description:
          "Your workout metrics are perfectly aligned with your fitness profile. Great job maintaining consistency!",
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-white bg-clip-text text-transparent">Today's Activity</h2>
      <p className="text-gray-500">{data.date}</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          {/* Rest BPM Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100"
              style={{ padding: "2px" }}
            >
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Rest BPM</p>
                <svg
                  className="w-6 h-6 text-purple-500 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.restBPM}</p>
            </div>
          </div>

          {/* Average BPM Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-pink-500/10 hover:shadow-pink-500/30 transition-all duration-300 relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100"
              style={{ padding: "2px" }}
            >
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Average BPM</p>
                <svg className="w-6 h-6 text-pink-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.avgBPM}</p>
            </div>
          </div>

          {/* Max BPM Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-orange-500/10 hover:shadow-orange-500/30 transition-all duration-300 relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100"
              style={{ padding: "2px" }}
            >
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Max BPM</p>
                <svg
                  className="w-6 h-6 text-orange-500 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.maxBPM}</p>
            </div>
          </div>

          {/* Calories Burnt Card */}
          <div className="bg-black rounded-2xl p-6 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100"
              style={{ padding: "2px" }}
            >
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold opacity-90">Calories Burnt</p>
                <svg className="w-6 h-6 text-pink-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-bold text-white">{data.caloriesBurnt}</p>
            </div>
          </div>
        </div>

        {/* Workout Type Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col justify-center items-center">
          <svg className="w-12 h-12 text-white opacity-90 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-white text-sm mb-3 font-semibold opacity-90">Workout Type</p>
          <span className="text-2xl font-bold text-white text-center">{data.workoutType}</span>
        </div>
      </div>

      {anomalyLoading ? (
        <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100"
            style={{ padding: "2px" }}
          >
            <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
          </div>
          <div className="relative text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="text-gray-400 mt-4">Analyzing workout data...</p>
          </div>
        </div>
      ) : anomalyError ? (
        <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 opacity-100"
            style={{ padding: "2px" }}
          >
            <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
          </div>
          <div className="relative">
            <p className="text-red-400">{anomalyError}</p>
          </div>
        </div>
      ) : anomalyData ? (
        <div className="space-y-4">
          <div className={`bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden`}>
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getAnomalyStatusColor(anomalyData.anomaly === 1)} opacity-100`}
              style={{ padding: "2px" }}
            >
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {anomalyData.anomaly === 1 ? (
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-500/20">
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/20">
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-2xl font-bold mb-2 ${anomalyData.anomaly === 1 ? "text-red-400" : "text-green-400"}`}
                  >
                    {getAnomalyMessage(anomalyData.anomaly === 1).title}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    {getAnomalyMessage(anomalyData.anomaly === 1).description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {anomalyData.anomaly===1 && getContributingFactorInsights(anomalyData.contributing_factors).length > 0 && (
            <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100"
                style={{ padding: "2px" }}
              >
                <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
              </div>
              <div className="relative">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-6 rounded"></span>
                  What we found out
                </h4>
                <div className="space-y-3">
                  {getContributingFactorInsights(anomalyData.contributing_factors).map((insight, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-900/50 rounded-lg p-4 border border-purple-900/30 hover:border-pink-500/50 transition-all duration-300 flex items-start gap-3"
                    >
                      <div className="flex-1">
                        <p className="text-purple-400 font-semibold text-sm mb-1">{insight.label}</p>
                        <p className="text-gray-300 text-sm">{insight.insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Recommended Workout Forms Section */}
      <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-100"
          style={{ padding: "2px" }}
        >
          <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Recommended Workout Forms based on your activities
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="text-gray-400 mt-4">Loading recommendations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(recommendations).map(([muscle, exercises]) => (
                <div key={muscle}>
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-6 rounded"></span>
                    Workouts for {muscle}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-900/50 rounded-lg p-5 border border-purple-900/30 hover:border-pink-500/50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="text-lg font-bold text-white">{exercise.exercise_name}</h5>
                          <span className="text-xs text-gray-500 bg-zinc-800 px-2 py-1 rounded">
                            {exercise.equipment}
                          </span>
                        </div>
                        <p className="text-sm text-purple-400 mb-3">{exercise.form_name} Form</p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Est. Calories</span>
                            <span className="text-orange-400 font-semibold">{exercise.est_calories} cal</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Avg BPM</span>
                            <span className="text-pink-400 font-semibold">{exercise.avg_bpm}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Intensity</span>
                            <span
                              className={`font-semibold px-2 py-1 rounded text-xs ${getDifficultyColor(exercise.intensity_level)}`}
                            >
                              {exercise.intensity_level}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Popularity</span>
                            <div className="flex items-center gap-1">
                              <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                  style={{ width: `${exercise.popularity_score * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {Math.round(exercise.popularity_score * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivitiesPage
