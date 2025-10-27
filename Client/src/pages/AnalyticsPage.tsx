"use client"

import React, { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface AnalyticsData {
  userCalories: number
  avgCalories: number
  userFrequency: number
  userEfficiency: number
  waterIntake: number
  goodFactors: string[]
  improvementFactors: string[]
}

interface UserWorkoutData {
  age?: number
  gender?: string
  workout_type?: string
  workoutType?: string
  avg_bpm?: number
  avgBpm?: number
  resting_bpm?: number
  restingBpm?: number
  calories_burned?: number
  caloriesBurned?: number
  fat_percentage?: number
  fatPercentage?: number
  experience_level?: string
  experienceLevel?: string
  bmi?: number
  workout_frequency?: number
  workoutFrequency?: number
  water_intake?: number
  waterIntake?: number
  workout_efficiency?: number
  userEfficiency?: number
}

const AnalyticsPage = () => {
  const performanceChartRef = useRef<HTMLCanvasElement>(null)
  const efficiencyChartRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const storedData = localStorage.getItem("userProfile")
        const userData: UserWorkoutData = storedData ? JSON.parse(storedData) : {}

        // Map localStorage fields to API requirements
        const apiPayload = {
          age: userData.age || 30,
          gender: userData.gender || "male",
          workout_type: userData.workout_type || userData.workoutType || "HIIT",
          avg_bpm: userData.avg_bpm || userData.avgBpm || 140,
          resting_bpm: userData.resting_bpm || userData.restingBpm || 70,
          calories_burned: userData.calories_burned || userData.caloriesBurned || 400,
          fat_percentage: userData.fat_percentage || userData.fatPercentage || 18,
          experience_level: userData.experience_level || userData.experienceLevel || "beginner",
          bmi: userData.bmi || 24.5,
          workout_frequency: userData.workout_frequency || userData.workoutFrequency || 4,
          water_intake: userData.water_intake || userData.waterIntake || 2.0,
          workout_efficiency: userData.workout_efficiency || userData.userEfficiency || 80,
        }

        // Call Flask API
        const response = await fetch("http://localhost:5000/api/optimizeWorkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiPayload),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch optimization data")
        }

        const result: { goodFactors: string[]; improvementFactors: string[] } = await response.json()

        setData({
          userCalories: apiPayload.calories_burned,
          avgCalories: 320,
          userFrequency: apiPayload.workout_frequency,
          userEfficiency: apiPayload.workout_efficiency,
          waterIntake: apiPayload.water_intake,
          goodFactors: result.goodFactors || [],
          improvementFactors: result.improvementFactors || [],
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        console.error("[v0] Error fetching data:", errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Performance Chart
    let performanceChart: Chart | null = null
    if (performanceChartRef.current && data) {
      const ctx = performanceChartRef.current.getContext("2d")
      if (ctx) {
        performanceChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Your Performance",
                data: [380, 420, 360, 400, 450, 390, 410],
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 2,
                pointHoverRadius: 12,
                pointBackgroundColor: "rgb(59, 130, 246)",
                pointHoverBackgroundColor: "yellow",
              },
              {
                label: "Community Avg",
                data: [320, 310, 330, 315, 325, 320, 318],
                borderColor: "rgb(16, 185, 129)",
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 2,
                pointHoverRadius: 12,
                pointBackgroundColor: "rgb(16, 185, 129)",
                pointHoverBackgroundColor: "yellow",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animations: {
              radius: {
                duration: 400,
                easing: "linear",
                loop: (context) => context.active,
              },
            },
            interaction: {
              mode: "nearest",
              intersect: false,
              axis: "x",
            },
            plugins: {
              legend: {
                labels: {
                  color: "#fff",
                  font: { size: 12 },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { display: false },
                ticks: { color: "#9ca3af" },
              },
              x: {
                grid: { display: false },
                ticks: { color: "#9ca3af" },
              },
            },
          },
        })
      }
    }

    return () => {
      if (performanceChart) {
        performanceChart.destroy()
      }
    }
  }, [data])

  useEffect(() => {
    // Efficiency Chart
    let efficiencyChart: Chart | null = null
    if (efficiencyChartRef.current && data) {
      const ctx = efficiencyChartRef.current.getContext("2d")
      if (ctx) {
        efficiencyChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
            datasets: [
              {
                label: "Efficiency %",
                data: [
                  65, 68, 70, 72, 75, 73, 76, 78, 75, 77, 80, 82, 79, 81, 83, 85, 82, 84, 86, 88, 85, 87, 89, 90, 88,
                  91, 92, 90, 93, 95,
                ],
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 1,
                pointHoverRadius: 12,
                pointBackgroundColor: "rgb(59, 130, 246)",
                pointHoverBackgroundColor: "yellow",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animations: {
              radius: {
                duration: 400,
                easing: "linear",
                loop: (context) => context.active,
              },
            },
            interaction: {
              mode: "nearest",
              intersect: false,
              axis: "x",
            },
            plugins: {
              legend: {
                labels: {
                  color: "#fff",
                  font: { size: 12 },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: { display: false },
                ticks: { color: "#9ca3af" },
              },
              x: {
                grid: { display: false },
                ticks: {
                  color: "#9ca3af",
                  maxTicksLimit: 10,
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (efficiencyChart) {
        efficiencyChart.destroy()
      }
    }
  }, [data])

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Analytics crafted for you</h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400">Loading your personalized analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Analytics crafted for you</h2>
        <div className="flex items-center justify-center py-12">
          <p className="text-red-400">{error || "Unable to load analytics data"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold ">Analytics crafted for you</h2>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left Section - 3 Vertical Boxes */}
        <div className="lg:col-span-1 flex lg:flex-col flex-row gap-4">
          {/* Water Intake Card */}
          <div className="flex-1 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100"
              style={{ padding: "2px" }}
            >
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-xs font-semibold opacity-90">Water Intake</p>
                <svg className="w-5 h-5 text-blue-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{data.waterIntake}L</p>
            </div>
          </div>

          {/* Frequency Card */}
          <div className="flex-1 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100"
              style={{ padding: "2px" }}
            >
              <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-xs font-semibold opacity-90">Frequency</p>
                <svg
                  className="w-5 h-5 text-emerald-500 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">
                {data.userFrequency} <span className="text-sm text-gray-400">days</span>
              </p>
            </div>
          </div>

          {/* Efficiency Card */}
          <div className="flex-1 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100"
              style={{ padding: "2px" }}
            >
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

        {/* Middle Section - Performance Chart */}
        <div className="lg:col-span-2 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100"
            style={{ padding: "2px" }}
          >
            <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
          </div>
          <div className="relative">
            <h3 className="text-sm font-bold mb-4 text-white">Weekly Performance Comparison</h3>
            <div className="h-64">
              <canvas ref={performanceChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Right Section - Efficiency Chart */}
        <div className="lg:col-span-2 bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 opacity-100"
            style={{ padding: "2px" }}
          >
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

      {/* Insights Section */}
      <div className="bg-black rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 opacity-100"
          style={{ padding: "2px" }}
        >
          <div className="absolute inset-[2px] rounded-2xl bg-black"></div>
        </div>
        <div className="relative">
          {/* Good Factors Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 className="text-lg font-semibold text-emerald-400">What's Working Well</h4>
            </div>
            <div className="space-y-2">
              {data.goodFactors.map((factor, idx) => (
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
              {data.improvementFactors.map((factor, idx) => (
                <div key={idx} className="bg-orange-950/30 rounded-lg p-4 border border-orange-900/40">
                  <p className="text-gray-200 leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
