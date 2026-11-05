// ==============================================================================
// BIRTHDAY SURPRISE WEBSITE CONFIGURATION
// You can customize all texts, photos, dates, and secrets here for each client!
// ==============================================================================

const CONFIG = {
    // Basic Details
    recipientName: "Cutiepie",          // Name shown in headers and titles
    birthDate: "2004-11-06T00:00:00",    // Birth Date (YYYY-MM-DD) for the live counter
    secretPasscode: "1234",             // Secret 4-digit code to unlock the surprise
    passcodeHint: "Hint: 1234",         // Hint displayed under the keypad

    // Audio Settings
    musicPath: "audio/song.mp4", // Path to the background song
    musicVolume: 0.7,                   // Default volume (0.0 to 1.0)

    // Stage 1: Gift Box Intro
    stage1: {
        title: "A surprise awaits you...",
        subtitle: "🎁 Something special, just for you 🎁",
        tapText: "Tap the gift to open 💖"
    },

    // Stage 2: Secret Passcode
    stage2: {
        title: "Enter the secret passcode 🔑",
        clockTime: "02:44"              // Digital clock display
    },

    // Stage 3: Curtains
    stage3: {
        openButtonText: "🎬 Open",
        loadingText: "Loading something special..."
    },

    // Stage 4: Interstitial Note
    stage4: {
        bearEmoji: "🧸",
        headline: "There's something special I want to tell you...",
        subtext: "And I hope it makes your day a little brighter ✨",
        buttonText: "Continue ❤️"
    },

    // Stage 5: Birthday Celebration & Live Counter
    stage5: {
        celebrationTitle: "Happy Birthday Cutiepie 🎂",
        celebrationSubtitle: "The world has been sweeter since 🌸",
        cakeButtonText: "Blow out the candles 💨",
        cakeBlownText: "Wish granted! ✨",
        nextButtonText: "See Our Memories 💖"
    },

    // Stage 6: Cute Memories Carousel (4 Photos)
    memories: [
        {
            image: "images/pic1.jpg",
            caption: "Our first adventure together 🚗"
        },
        {
            image: "images/pic2.jpg",
            caption: "Stargazing at midnight ✨"
        },
        {
            image: "images/pic3.jpg",
            caption: "You make me smile every single day 🥰"
        },
        {
            image: "images/pic4.jpg",
            caption: "Loving you more with every heartbeat ❤️"
        }
    ],

    // Stage 7: Balloon Pop Wishes (5 Balloons)
    balloonWishes: [
        "You are my favorite person, always 💖",
        "I am the luckiest, because of you 🌟",
        "You make my whole world brighter ✨",
        "Your smile is my absolute favorite view 🥰",
        "Every moment with you is pure magic 💫"
    ],

    // Stage 8: 3x3 Puzzle Photo
    puzzleImage: "images/pic2.jpg",

    // Stage 9: Scratch Card Surprise
    scratchCard: {
        title: "One Last Surprise ✨",
        subtitle: "Scratch the golden card to reveal it 💖",
        scratchHint: "Scratch here 💖\nReveal your secret surprise",
        revealImage: "images/pic4.jpg",
        revealTitle: "Happy Birthday!",
        revealMessage: "You mean the absolute world to me ✨",
        nextButtonText: "Read My Letter 💌"
    },

    // Stage 10: Romantic Love Letter
    letter: {
        envelopeTitle: "A Letter Just For You 💌",
        envelopeHint: "Tap to open 💖",
        greeting: "My dearest,",
        paragraphs: [
            "On this very special day, I want you to know how deeply you are loved. Every single moment I spend with you feels like a beautiful dream I never want to wake up from.",
            "You make every ordinary day feel extraordinary. Your smile is my favorite thing in the entire world, and your laugh is the sweetest sound I have ever heard.",
            "Thank you for being you. Thank you for choosing me every single day. I promise to always be there to hold your hand through every storm, and to celebrate every joy with you.",
            "Happy Birthday, my love. You deserve every good thing the universe has to offer, today and always. 💫"
        ],
        signOff: "Forever yours, with all my heart ❤️"
    }
};
