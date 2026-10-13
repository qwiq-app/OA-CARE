// Exercise steps and precautions mirrored from backend/app/routers/exercises.py so the
// help assistant can explain exercises without a server round trip.
export const exerciseGuides = {
  "Straight Leg Raise": {
    "instructions": [
      "Lie flat on back.",
      "Tighten quads.",
      "Lift one leg about 1 foot while keeping knee locked.",
      "Hold 3 seconds.",
      "Lower down.",
      "Perform both legs, 2 sets of 15 reps."
    ],
    "precautions": "Keep lower back flat on floor.",
    "description": "Beginner knee strengthening exercise for quadriceps control.",
    "hold_seconds": 3
  },
  "Quad Set": {
    "instructions": [
      "Lie on back with one knee bent on a towel roll and the other leg straight.",
      "Squeeze thigh muscles while pushing knee into towel.",
      "Keep back flat.",
      "Perform both legs, 2 sets of 15 reps."
    ],
    "precautions": null,
    "description": "Gentle isometric quadriceps activation.",
    "hold_seconds": null
  },
  "Lying Quad Stretch": {
    "instructions": [
      "Lie near edge of bed.",
      "Bend right leg with foot flat on bed.",
      "Hang left leg over edge with thigh resting on bed.",
      "Hold 10-15 seconds.",
      "Repeat opposite leg, 2-3 times each."
    ],
    "precautions": null,
    "description": "Gentle front-thigh stretch.",
    "hold_seconds": 15
  },
  "Side-Lying Leg Raise": {
    "instructions": [
      "Lie on side with hips, knees, and feet stacked.",
      "Place top arm in front for balance.",
      "Lift top leg to hip height.",
      "Hold 2-3 seconds.",
      "Lower slowly.",
      "Perform both legs, 2 sets of 15 reps."
    ],
    "precautions": null,
    "description": "Hip and thigh strengthening exercise that supports knee mechanics.",
    "hold_seconds": 3
  },
  "Bridging": {
    "instructions": [
      "Lie on back.",
      "Tighten core and squeeze glutes.",
      "Raise butt off floor while keeping back straight.",
      "Hold 5 seconds.",
      "Perform 2 sets of 15 reps."
    ],
    "precautions": "Do not overarch lower back.",
    "description": "Glute and posterior chain strengthening.",
    "hold_seconds": 5
  },
  "Step-Ups": {
    "instructions": [
      "Stand at bottom of step and hold handrail.",
      "Lift one foot and step onto step.",
      "Bring other foot up.",
      "Step back down in reverse.",
      "Perform 1-2 sets of 10 reps.",
      "Can also do laterally."
    ],
    "precautions": "Always hold handrail for safety.",
    "description": "Functional strengthening for stairs and daily activity.",
    "hold_seconds": null
  },
  "Sit-to-Stand": {
    "instructions": [
      "Sit upright in chair with back straight.",
      "Cross arms on chest.",
      "Lean torso forward.",
      "Press into feet to stand.",
      "Slowly sit back.",
      "Distribute weight evenly.",
      "Perform 3 sets of 5 reps."
    ],
    "precautions": "Hold another chair for support if needed.",
    "description": "Functional lower-limb strengthening from a chair.",
    "hold_seconds": null
  },
  "Mini Squats at Countertop": {
    "instructions": [
      "Stand feet shoulder-width apart with hands on countertop.",
      "Slowly bend knees into mini squat.",
      "Hold a couple seconds.",
      "Return to standing.",
      "Keep heels on ground and knees not past toes.",
      "Perform 3 sets of 5 reps."
    ],
    "precautions": null,
    "description": "Supported mini squat for lower-limb strength.",
    "hold_seconds": 2
  },
  "Tandem Balance": {
    "instructions": [
      "Stand upright with arms at sides.",
      "Place one foot directly in front heel-to-toe.",
      "Maintain balance with back straight and arms at sides.",
      "Work toward 30-second holds.",
      "Alternate feet."
    ],
    "precautions": null,
    "description": "Heel-to-toe balance drill.",
    "hold_seconds": 30
  },
  "Single-Leg Balance": {
    "instructions": [
      "Stand feet together.",
      "Lift one foot and balance on other leg.",
      "Do not shift weight side to side.",
      "Extend arms or hold rail if needed.",
      "Work toward 15-second holds each foot."
    ],
    "precautions": "Stand near wall or chair for safety.",
    "description": "Single-leg stance balance training.",
    "hold_seconds": 15
  },
  "Calf Stretch with Towel": {
    "instructions": [
      "Sit on floor with one leg stretched out.",
      "Secure towel around foot.",
      "Pull foot toward you until calf stretch is felt.",
      "Keep knee straight.",
      "Hold 10-15 seconds.",
      "Alternate legs."
    ],
    "precautions": null,
    "description": "Seated calf stretch using a towel.",
    "hold_seconds": 15
  },
  "Seated Hamstring Stretch": {
    "instructions": [
      "Sit upright on edge of bench.",
      "Place one leg straight on surface and other foot flat on floor.",
      "Lean forward hinging at hips until stretch is felt behind leg.",
      "Keep knees straight, toes up, and back straight.",
      "Hold 10-15 seconds.",
      "Alternate legs."
    ],
    "precautions": null,
    "description": "Seated hamstring stretch for posterior thigh flexibility.",
    "hold_seconds": 15
  },
  "Plank": {
    "instructions": [
      "Lie on stomach with elbows under shoulders and palms down.",
      "Push up keeping elbows and forearms on floor.",
      "Keep legs and torso straight with back flat.",
      "Hold 30 seconds to 1 minute.",
      "Easier option: keep knees on floor."
    ],
    "precautions": "Keep hips level, do not let back sag.",
    "description": "Core strengthening exercise supporting hip control.",
    "hold_seconds": 60
  },
  "Lunges": {
    "instructions": [
      "Stand feet hip-width apart with hands on hips.",
      "Keep back straight and step forward with right leg.",
      "Bend both knees with left knee pointing down and right knee above right foot.",
      "Push back to standing.",
      "Alternate legs.",
      "Easier option: reverse lunges stepping backward."
    ],
    "precautions": "Do not let front knee go past toes.",
    "description": "Lower-limb strengthening exercise for hip and knee control.",
    "hold_seconds": null
  },
  "Squats": {
    "instructions": [
      "Stand feet slightly wider than hip-width with toes slightly outward.",
      "Shift weight to heels and brace core with chest out and back straight.",
      "Lower hips until thighs are parallel.",
      "Keep head forward and heels flat.",
      "Push through feet to stand.",
      "Support option: hold chair or countertop."
    ],
    "precautions": "Keep knees aligned over second toes, do not cave inward.",
    "description": "Compound lower-limb strengthening exercise.",
    "hold_seconds": null
  },
  "Push-Ups": {
    "instructions": [
      "Kneel on all fours with palms flat, fingers forward, and hands shoulder-width apart.",
      "Easier option: keep knees on floor.",
      "Harder option: straighten legs.",
      "Bend elbows and lower until chest nearly touches floor.",
      "Keep elbows close to sides.",
      "Press up.",
      "Wall push-ups are an easier option."
    ],
    "precautions": "Do not let hips sag or back arch.",
    "description": "Upper-body and core strengthening option for whole-body conditioning.",
    "hold_seconds": null
  },
  "Burpees": {
    "instructions": [
      "Stand hip-width.",
      "Drop into squat and place hands in front of feet.",
      "Kick legs back to plank.",
      "Do a push-up.",
      "Return to plank.",
      "Jump feet forward to hands.",
      "Jump up with arms toward ceiling.",
      "Beginner option: skip push-up and use chair for plank."
    ],
    "precautions": "Not recommended during active joint flare-up.",
    "description": "Advanced cardio and conditioning exercise.",
    "hold_seconds": null
  },
  "Suspension Plank": {
    "instructions": [
      "Get into plank position with tops of feet in suspension straps.",
      "Hold for as long as comfortable.",
      "Keep body in a straight line."
    ],
    "precautions": "Only use with proper suspension equipment.",
    "description": "Advanced plank variation using suspension straps.",
    "hold_seconds": 30
  },
  "Suspension Side Plank": {
    "instructions": [
      "Get into side plank.",
      "Stack feet on top of each other with insides touching.",
      "Put both feet in strap and cradle outside of bottom foot in strap.",
      "Hold as long as comfortable.",
      "Repeat other side."
    ],
    "precautions": null,
    "description": "Advanced side plank variation using suspension straps.",
    "hold_seconds": 30
  },
  "Mountain Climber (Suspension)": {
    "instructions": [
      "Get into plank with feet in suspension straps.",
      "Keep back straight and engage core.",
      "Pull knees toward chest keeping shoulders over hands.",
      "Return to start and repeat."
    ],
    "precautions": null,
    "description": "Advanced suspension cardio and core exercise.",
    "hold_seconds": null
  }
};
