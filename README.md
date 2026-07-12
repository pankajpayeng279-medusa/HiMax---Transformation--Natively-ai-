# HiMax – AI Personal Transformation Coach 💪🤖

HiMax is an AI-powered fitness coach that provides personalized workout guidance, real-time exercise tracking using computer vision, and intelligent fitness recommendations through an interactive AI Coach.

Built for the **AMD Developer + Fireworks AI Hackathon (Track 3)**.

---

# 🚀 Problem Statement

Many people struggle to maintain proper exercise form, stay consistent with workouts, and receive personalized fitness guidance without hiring an expensive personal trainer.

HiMax solves this problem by combining AI conversation, pose estimation, and workout tracking into a single platform.

---

# ✨ Features

## 🤖 AI Coach

- AI-powered fitness assistant
- Personalized workout recommendations
- Answers fitness-related questions
- Exercise guidance and motivation
- Powered using **Fireworks AI API**

---

## 🎥 Real-Time Pose Detection

Built using **MediaPipe Pose Landmarker**

Supports:

- ✅ Push-Up Tracking
- ✅ Squat Tracking

Features:

- Automatic rep counting
- Set tracking
- Real-time pose validation
- Live camera feedback

---

## 🏋️ Workout System

- Upper Body Workout
- Lower Body Workout
- Dynamic workout cards
- Exercise progress tracking
- Workout completion flow

---

## 👤 User System

- Secure Authentication
- Supabase Login
- User Profile
- Personalized Dashboard

---

## 📊 Dashboard

- Workout overview
- AI Coach access
- Nutrition section
- Progress tracking

---

# 🛠 Tech Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

Backend / Services

- Supabase
- Fireworks AI API
- MediaPipe Pose Landmarker

---

# 🔥 AI Technologies Used

## Fireworks AI

Used for:

- AI Coach
- Fitness conversation
- Personalized workout recommendations

---

## MediaPipe

Used for:

- Human pose estimation
- Real-time exercise tracking
- Rep counting
- Form detection

---

# ☁️ Compute Platform

This project utilizes:

- Fireworks AI API (approved compute)
- AMD AI Developer Program resources

---

# 📂 Project Structure

```
src/
 ├── components/
 │    ├── coach/
 │    ├── dashboard/
 │    └── ui/
 │
 ├── pages/
 │    ├── CoachPage.tsx
 │    ├── DashboardPage.tsx
 │    ├── ProgressPage.tsx
 │    └── NutritionPage.tsx
 │
 ├── services/
 │    ├── ai/
 │    ├── supabase/
 │    └── trackingService.ts
 │
 └── hooks/
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

```
SUPABASE_URL=https://supabase.com/dashboard/project/geueqrnnvmuugffviarq
FIREWORKS_API_KEY=fw_CtqT4DkrZd3HAYYEw1ZnE6
```

---

# 📦 External Services

- Supabase Authentication
- Supabase Database
- Fireworks AI API
- MediaPipe Pose Landmarker

---

# 🎯 Main Implementation

Primary AI workflow:

```
src/pages/CoachPage.tsx
```

AI Services:

```
src/services/ai/
```

Pose Detection:

```
src/components/coach/CameraView.tsx
```

---

# 👨‍💻 Team

## Pankaj Payeng

- Full-stack Development
- Website Architecture
- AI Coach UI
- Camera Tracking
- Pose Detection
- Dashboard
- Frontend & Backend Integration

## Ankur Payeng

- Documentation (README)
- Presentation Preparation
- Project Submission
- Team Coordination
- Testing & Quality Assurance

---

# 🔮 Future Improvements

- Additional exercise tracking
- Nutrition personalization
- Workout history
- Progress calendar
- Advanced analytics
- More AI-powered coaching

---

# 📜 License

Created for the AMD Developer + Fireworks AI Hackathon.