import type { MoodState, ComfortType } from '../lib/database.types';

export interface Recommendation {
  title: string;
  description: string;
  suggestions: string[];
}

export const recommendations: Record<MoodState, Record<ComfortType, Recommendation>> = {
  energized: {
    warmth: {
      title: "Energizing Nourishment",
      description: "You're buzzing with energy! Let's fuel that spark with something vibrant.",
      suggestions: [
        "Try a citrus-ginger smoothie with honey and turmeric",
        "Whip up avocado toast with everything bagel seasoning",
        "Make a colorful Buddha bowl with roasted chickpeas",
        "Brew some green tea with mint and lemon"
      ]
    },
    stillness: {
      title: "Channeled Energy",
      description: "Your energy is high, but you're seeking focus. Let's create centered vibrancy.",
      suggestions: [
        "Try a 10-minute walking meditation in nature",
        "Listen to uplifting instrumental music (try lo-fi beats)",
        "Practice energizing yoga flows like sun salutations",
        "Journal about your current goals and aspirations"
      ]
    },
    distraction: {
      title: "Creative Outlet",
      description: "Your mind is ready for action! Channel that energy into something fun.",
      suggestions: [
        "Start a quick origami project",
        "Try your hand at speed sketching or doodling",
        "Organize and redecorate a small space in your home",
        "Learn a new card trick or puzzle"
      ]
    }
  },
  calm: {
    warmth: {
      title: "Cozy Comfort",
      description: "You're in a peaceful place. Let's enhance that gentle warmth.",
      suggestions: [
        "Make chamomile tea with honey and a splash of vanilla",
        "Try warm milk with cinnamon and nutmeg",
        "Bake simple honey cookies or banana bread",
        "Prepare a comforting bowl of oatmeal with berries"
      ]
    },
    stillness: {
      title: "Deep Tranquility",
      description: "You're centered and calm. Let's deepen that beautiful peace.",
      suggestions: [
        "Try a guided meditation (15 minutes of body scan)",
        "Listen to nature sounds or ambient music",
        "Practice gentle stretching or restorative yoga",
        "Read poetry or a calming short story"
      ]
    },
    distraction: {
      title: "Gentle Engagement",
      description: "You're calm and ready for something soothing to focus on.",
      suggestions: [
        "Work on a simple puzzle or coloring book",
        "Browse cozy home decor inspiration online",
        "Curate a relaxing playlist for future use",
        "Try beginner-friendly knitting or crochet patterns"
      ]
    }
  },
  neutral: {
    warmth: {
      title: "Comfort Exploration",
      description: "You're in a neutral space. Let's discover what feels good right now.",
      suggestions: [
        "Try a new herbal tea blend you haven't tasted before",
        "Make a simple grilled cheese with tomato soup",
        "Bake mug brownies (ready in 5 minutes!)",
        "Prepare a warm beverage bar with multiple options"
      ]
    },
    stillness: {
      title: "Mindful Reset",
      description: "Sometimes neutral is perfect. Let's create a gentle moment of presence.",
      suggestions: [
        "Try a 5-minute breathing exercise (box breathing)",
        "Listen to binaural beats or soundscapes",
        "Practice mindful observation of your surroundings",
        "Do a short progressive muscle relaxation"
      ]
    },
    distraction: {
      title: "Easy Discovery",
      description: "You're open to possibilities. Let's explore something new and simple.",
      suggestions: [
        "Try a simple craft tutorial on YouTube",
        "Play a calming mobile puzzle game",
        "Rearrange your bookshelf or photo collection",
        "Watch a short documentary about something interesting"
      ]
    }
  },
  tired: {
    warmth: {
      title: "Gentle Nourishment",
      description: "You need extra softness right now. Let's provide easy, warming comfort.",
      suggestions: [
        "Make instant hot chocolate with marshmallows",
        "Heat up easy soup (no-cook comfort)",
        "Warm milk with honey and lavender",
        "Keep it simple: toast with butter and jam"
      ]
    },
    stillness: {
      title: "Restorative Rest",
      description: "Your body is asking for deep rest. Let's create the perfect sanctuary.",
      suggestions: [
        "Try a 20-minute guided meditation for sleep",
        "Listen to soft piano music or rain sounds",
        "Practice legs-up-the-wall yoga pose (10 minutes)",
        "Do a gentle body scan meditation lying down"
      ]
    },
    distraction: {
      title: "Low-Energy Comfort",
      description: "You need something engaging but effortless. Let's keep it easy.",
      suggestions: [
        "Watch feel-good comedy clips or sitcom episodes",
        "Browse comforting images (cozy cabins, cute animals)",
        "Listen to a relaxing podcast or audiobook",
        "Play a simple, meditative game like Tetris or Sudoku"
      ]
    }
  }
};

export function getRecommendation(mood: MoodState, comfort: ComfortType): Recommendation {
  return recommendations[mood][comfort];
}
