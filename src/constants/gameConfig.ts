// Game difficulty and timing constants
export const GAME_CONFIG = {
  // Number of attempts before showing the quote clue
  TRIES_UNTIL_QUOTE: 5,
  // Number of attempts before showing the image clue
  TRIES_UNTIL_IMAGE: 12,
  // Image zoom scale factor
  IMAGE_ZOOM_SCALE: 5,
  // Image blur intensity (in pixels)
  IMAGE_BLUR_INTENSITY: 2,
  // Win animation delay in milliseconds
  WIN_ANIMATION_DELAY: 1800,
  // Confetti colors (MCU red theme)
  CONFETTI_COLORS: ["#ff0d0d", "#ffffff", "#b81414"] as string[]
} as const;

// UI labels and messages
export const GAME_LABELS = {
  TITLE: "Guess today's MCU character!",
  START_MESSAGE: "Type any character to start.",
  WIN_MESSAGE: "🎉 You guessed it! Come back tomorrow for a new challenge.",
  NO_QUOTES_MESSAGE: "No quotes for this character",
  INCORRECT_MESSAGE: "Incorrect! Try again."
} as const;

// Clue configuration
import { ClueType } from "./enums";

export const CLUE_CONFIG = {
  QUOTE: {
    type: ClueType.QUOTE,
    triesUntil: GAME_CONFIG.TRIES_UNTIL_QUOTE
  },
  IMAGE: {
    type: ClueType.IMAGE,
    triesUntil: GAME_CONFIG.TRIES_UNTIL_IMAGE
  }
} as const;
