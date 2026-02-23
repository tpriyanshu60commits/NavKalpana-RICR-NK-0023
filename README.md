FitAI – Adaptive Fitness Intelligence Platform
Team Details

Team Name: NavKalpana-RICR-NK-0001
Team Leader: Priyanshu Tiwari
Total Members: 3

Members & Roles:

Priyanshu Tiwari – System Architecture & Core Logic

Member 2 – Frontend Development

Member 3 – Backend Integration & Firebase Database

Problem Statement

Develop an adaptive fitness intelligence platform that generates personalized workout and diet plans, tracks adherence, analyzes behavioral patterns, and dynamically adjusts recommendations based on performance and fatigue levels.

Project Overview

FitAI is a web-based adaptive fitness system built using Next.js and Firebase.

It operates on a closed-loop adaptive model:

Profile → Plan → Execute → Track → Analyze → Adjust → Coach → Repeat

The system is not a static template generator.
It dynamically adapts based on user progress, habit score, and energy levels.

Core Features

Secure User Authentication (Firebase Auth)

Health & Goal Profile Setup

Weekly Workout Plan Generator

Weekly Diet Plan Generator (Calorie & Macro Based)

Progress Tracking (Weight & Adherence)

Body Measurement Tracking

Habit Intelligence Engine

Energy & Recovery Adjustment Logic

Progressive Overload Implementation

Goal Timeline Forecast System

Rule-Based AI Coaching Assistant

Tech Stack

Frontend:

Next.js (App Router)

TypeScript

Tailwind CSS

Backend / Cloud Services:

Firebase Authentication

Firebase Firestore (NoSQL Database)

State & Logic Handling:

React Hooks

Custom Adaptive Calculation Logic

Deployment:

Vercel

System Architecture

Frontend:

UI Components (Next.js App Router)

Dynamic Plan Rendering

Real-time Data Sync with Firestore

Backend Services:

Firebase Auth for secure login

Firestore for user profile, progress logs, and adherence tracking

Data Flow:
User Input → Firebase Storage → Adaptive Logic Processing → Updated Plan Rendering