# 🎂 Personalized Birthday Surprise Website

A viral, interactive, and beautifully animated **Happy Birthday Surprise Website** created for your social media online business!

---

## 🌟 Features Included (Just Like the Video)

1. **Magical Ambience**: Warm dark background with floating golden fireflies/embers and romantic background song.
2. **Stage 1 — 3D Gift Box Intro**: Interactive 3D gift box that shakes and bursts open with confetti upon tapping.
3. **Stage 2 — Secret Passcode Lock Screen**: Sleek phone keypad with digital clock, hint (`1234`), and unlock sound effects.
4. **Stage 3 — Theater Velvet Curtains**: Luxurious red velvet curtains that part smoothly when clicking the "Open" button.
5. **Stage 4 — Interstitial Note**: Cute bear avatar with a heartfelt intro message.
6. **Stage 5 — Birthday Celebration & Interactive Cake**:
   - Live time counter dynamically calculating Years, Days, Hours, and Minutes lived.
   - 3-tier birthday cake with lit candles that you can blow out with real smoke and confetti.
7. **Stage 6 — Cute Memories Carousel**: Polaroid-style photo slideshow featuring your client's photos (`pic1.jpg` to `pic4.jpg`) with sweet captions and mobile swipe support.
8. **Stage 7 — Balloon Pop Wishes Game**: 5 colorful floating balloons that pop with confetti when tapped to reveal secret notes.
9. **Stage 8 — 3x3 Photo Puzzle Game**: Sliding tile puzzle using their photo, with move counter, shuffle button, and quick-solve option.
10. **Stage 9 — Golden Scratch Card**: Interactive touch/mouse scratch-off card that reveals a hidden surprise photo and birthday wish.
11. **Stage 10 — Romantic Love Letter**: Animated envelope with wax heart seal that unfolds a parchment love letter with typewriter text.

---

## 🚀 How to Run the Website Locally

You can open the website right now:
* Simply double-click **`index.html`** in this folder, and it will open in Chrome, Edge, Safari, or your preferred browser!

---

## ⚙️ How to Customize for Each New Client (Takes 1 Minute!)

Open **`config.js`** in any text editor (Notepad, VS Code, etc.). Everything is clearly labeled:

```javascript
const CONFIG = {
    // 1. Change recipient name & birth date:
    recipientName: "Cutiepie",
    birthDate: "2004-11-06T00:00:00",

    // 2. Change the secret passcode:
    secretPasscode: "1234",
    passcodeHint: "Hint: 1234",

    // 3. Put new photos into assets/images/ and update captions:
    memories: [
        { image: "assets/images/pic1.jpg", caption: "Our first adventure together 🚗" },
        { image: "assets/images/pic2.jpg", caption: "Stargazing at midnight ✨" },
        // ...
    ],

    // 4. Change balloon wishes & love letter text freely!
};
```

---

## 🌐 How to Host & Send Live Links to Your Clients (Free & Fast)

To give your paying social media clients a real website link (e.g. `birthday-surprise.netlify.app` or custom domain):

### Option 1: Netlify Drop (Easiest — 30 seconds, no coding needed)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
2. Drag and drop this whole **`birthday-website`** folder onto the page.
3. Done! It immediately gives you a live link to send to your client on WhatsApp or Instagram!

### Option 2: Vercel or GitHub Pages
You can also push this folder to GitHub and deploy in one click to Vercel or GitHub Pages for free.
