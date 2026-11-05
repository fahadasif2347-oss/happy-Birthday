// ==============================================================================
// BIRTHDAY SURPRISE WEBSITE SCRIPT
// Handles all 10 interactive stages, canvas particles, confetti, audio,
// sliding puzzle, scratch card, live counter, and envelope animations.
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------------------------
    // 1. DOM REFERENCES & STATE
    // --------------------------------------------------------------------------
    let currentStage = 1;
    let passcodeEntered = "";
    let liveCounterTimer = null;
    let balloonsPopped = 0;
    let isMusicPlaying = false;

    const bgAudio = document.getElementById("bg-audio");
    const musicToggle = document.getElementById("music-toggle");
    const particlesCanvas = document.getElementById("particles-canvas");
    const confettiCanvas = document.getElementById("confetti-canvas");

    // Web Audio API for lightweight built-in SFX (pops, chimes, clicks)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    function playTone(freq, type = "sine", duration = 0.15, gainVal = 0.1) {
        try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context blocked or not supported
        }
    }

    function playPopSound() {
        playTone(320, "triangle", 0.1, 0.15);
        setTimeout(() => playTone(540, "sine", 0.08, 0.12), 40);
    }

    function playChimeSound() {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            setTimeout(() => playTone(freq, "sine", 0.35, 0.08), idx * 75);
        });
    }

    // --------------------------------------------------------------------------
    // 2. BACKGROUND MUSIC CONTROLLER
    // --------------------------------------------------------------------------
    if (CONFIG.musicPath) {
        bgAudio.src = CONFIG.musicPath;
        bgAudio.volume = CONFIG.musicVolume || 0.7;
    }

    function startMusic() {
        if (!isMusicPlaying && bgAudio.src) {
            bgAudio.play().then(() => {
                isMusicPlaying = true;
                musicToggle.classList.add("playing");
            }).catch(() => {
                // Autoplay blocked until direct user interaction
            });
        }
    }

    musicToggle.addEventListener("click", () => {
        initAudioContext();
        if (bgAudio.paused) {
            bgAudio.play();
            isMusicPlaying = true;
            musicToggle.classList.add("playing");
        } else {
            bgAudio.pause();
            isMusicPlaying = false;
            musicToggle.classList.remove("playing");
        }
    });

    // --------------------------------------------------------------------------
    // 3. FLOATING PARTICLES (CANVAS EMBER / FIREFLY BACKGROUND)
    // --------------------------------------------------------------------------
    const pCtx = particlesCanvas.getContext("2d");
    let pWidth = (particlesCanvas.width = window.innerWidth);
    let pHeight = (particlesCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        pWidth = particlesCanvas.width = window.innerWidth;
        pHeight = particlesCanvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 45;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * pWidth,
            y: Math.random() * pHeight,
            radius: Math.random() * 2.2 + 0.8,
            speedY: Math.random() * 0.6 + 0.25,
            speedX: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.7 + 0.2,
            pulse: Math.random() * 0.02 + 0.01,
            pulseDir: 1
        });
    }

    function animateParticles() {
        pCtx.clearRect(0, 0, pWidth, pHeight);
        particles.forEach((p) => {
            p.y -= p.speedY;
            p.x += p.speedX;
            p.alpha += p.pulse * p.pulseDir;
            if (p.alpha >= 0.85) p.pulseDir = -1;
            if (p.alpha <= 0.15) p.pulseDir = 1;

            if (p.y < -10) {
                p.y = pHeight + 10;
                p.x = Math.random() * pWidth;
            }
            if (p.x < -10) p.x = pWidth + 10;
            if (p.x > pWidth + 10) p.x = -10;

            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(246, 200, 118, ${p.alpha})`;
            pCtx.shadowBlur = 10;
            pCtx.shadowColor = "rgba(246, 200, 118, 0.8)";
            pCtx.fill();
            pCtx.shadowBlur = 0;
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --------------------------------------------------------------------------
    // 4. CONFETTI BURST SYSTEM
    // --------------------------------------------------------------------------
    const cCtx = confettiCanvas.getContext("2d");
    let cWidth = (confettiCanvas.width = window.innerWidth);
    let cHeight = (confettiCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        cWidth = confettiCanvas.width = window.innerWidth;
        cHeight = confettiCanvas.height = window.innerHeight;
    });

    const activeConfetti = [];
    const CONFETTI_COLORS = ["#ff3b7a", "#f6c876", "#fff", "#ff85a1", "#ffd166", "#06d6a0", "#118ab2"];

    function burstConfetti(originX, originY, count = 55) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 9 + 4;
            activeConfetti.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                size: Math.random() * 7 + 4,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                gravity: 0.28,
                drag: 0.98
            });
        }
    }

    function animateConfetti() {
        cCtx.clearRect(0, 0, cWidth, cHeight);
        for (let i = activeConfetti.length - 1; i >= 0; i--) {
            const c = activeConfetti[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += c.gravity;
            c.vx *= c.drag;
            c.rotation += c.rotSpeed;
            c.opacity -= 0.012;

            if (c.opacity <= 0 || c.y > cHeight + 20) {
                activeConfetti.splice(i, 1);
                continue;
            }

            cCtx.save();
            cCtx.translate(c.x, c.y);
            cCtx.rotate((c.rotation * Math.PI) / 180);
            cCtx.fillStyle = c.color;
            cCtx.globalAlpha = Math.max(0, c.opacity);
            cCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
            cCtx.restore();
        }
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();

    // --------------------------------------------------------------------------
    // 5. STAGE TRANSITION MANAGER
    // --------------------------------------------------------------------------
    function goToStage(nextStage) {
        const currentEl = document.getElementById(`stage-${currentStage}`);
        const nextEl = document.getElementById(`stage-${nextStage}`);

        if (currentEl) {
            currentEl.classList.remove("active");
            setTimeout(() => {
                currentEl.style.display = "none";
            }, 400);
        }

        setTimeout(() => {
            if (nextEl) {
                nextEl.style.display = "block";
                // Trigger reflow for smooth animation
                void nextEl.offsetWidth;
                nextEl.classList.add("active");
                currentStage = nextStage;
                setupStage(nextStage);
            }
        }, 420);
    }

    function setupStage(stageNum) {
        window.scrollTo({ top: 0, behavior: "smooth" });

        switch (stageNum) {
            case 2:
                initStage2();
                break;
            case 3:
                initStage3();
                break;
            case 4:
                initStage4();
                break;
            case 5:
                initStage5();
                break;
            case 6:
                initStage6();
                break;
            case 7:
                initStage7();
                break;
            case 8:
                initStage8();
                break;
            case 9:
                initStage9();
                break;
            case 10:
                initStage10();
                break;
        }
    }

    // --------------------------------------------------------------------------
    // STAGE 1: GIFT BOX INTRO
    // --------------------------------------------------------------------------
    const giftBoxTrigger = document.getElementById("gift-box-trigger");
    if (CONFIG.stage1) {
        document.getElementById("s1-title").textContent = CONFIG.stage1.title;
        document.getElementById("s1-subtitle").textContent = CONFIG.stage1.subtitle;
        document.getElementById("s1-tap").textContent = CONFIG.stage1.tapText;
    }

    giftBoxTrigger.addEventListener("click", () => {
        initAudioContext();
        startMusic();
        playChimeSound();

        giftBoxTrigger.classList.add("opened");
        const rect = giftBoxTrigger.getBoundingClientRect();
        burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

        setTimeout(() => {
            goToStage(2);
        }, 850);
    });

    // --------------------------------------------------------------------------
    // STAGE 2: SECRET PASSCODE LOCK SCREEN
    // --------------------------------------------------------------------------
    function initStage2() {
        passcodeEntered = "";
        updatePasscodeDots();

        // Update clock
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        document.getElementById("s2-clock").textContent = CONFIG.stage2?.clockTime || `${hours}:${minutes}`;

        const options = { weekday: "long", month: "long", day: "numeric" };
        document.getElementById("s2-date").textContent = now.toLocaleDateString("en-US", options);

        if (CONFIG.passcodeHint) {
            document.getElementById("s2-hint").textContent = CONFIG.passcodeHint;
        }
    }

    const dots = document.querySelectorAll("#passcode-dots .dot");
    function updatePasscodeDots() {
        dots.forEach((dot, index) => {
            if (index < passcodeEntered.length) {
                dot.classList.add("filled");
            } else {
                dot.classList.remove("filled");
            }
        });
    }

    const keypad = document.getElementById("keypad");
    keypad.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        playTone(600, "sine", 0.05, 0.08);

        if (btn.dataset.num !== undefined) {
            if (passcodeEntered.length < 4) {
                passcodeEntered += btn.dataset.num;
                updatePasscodeDots();

                if (passcodeEntered.length === 4) {
                    verifyPasscode();
                }
            }
        } else if (btn.id === "key-delete") {
            passcodeEntered = passcodeEntered.slice(0, -1);
            updatePasscodeDots();
        }
    });

    function verifyPasscode() {
        const correctCode = CONFIG.secretPasscode || "1234";
        const lockIcon = document.getElementById("lock-icon");
        const dotsContainer = document.getElementById("passcode-dots");

        if (passcodeEntered === correctCode) {
            lockIcon.textContent = "🔓";
            playChimeSound();
            const rect = dotsContainer.getBoundingClientRect();
            burstConfetti(rect.left + rect.width / 2, rect.top, 40);

            setTimeout(() => {
                goToStage(3);
            }, 600);
        } else {
            playTone(180, "sawtooth", 0.25, 0.2);
            dotsContainer.classList.add("shake");
            setTimeout(() => {
                dotsContainer.classList.remove("shake");
                passcodeEntered = "";
                updatePasscodeDots();
            }, 500);
        }
    }

    // --------------------------------------------------------------------------
    // STAGE 3: THEATER CURTAINS
    // --------------------------------------------------------------------------
    function initStage3() {
        const curtains = document.getElementById("curtains-container");
        const loader = document.getElementById("curtains-loader");
        const btnOpen = document.getElementById("btn-open-curtains");

        curtains.classList.remove("open");
        loader.classList.remove("visible");

        btnOpen.onclick = () => {
            playChimeSound();
            curtains.classList.add("open");
            loader.classList.add("visible");
            burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);

            setTimeout(() => {
                goToStage(4);
            }, 1800);
        };
    }

    // --------------------------------------------------------------------------
    // STAGE 4: SWEET INTERSTITIAL MESSAGE
    // --------------------------------------------------------------------------
    function initStage4() {
        if (CONFIG.stage4) {
            document.getElementById("s4-avatar").textContent = CONFIG.stage4.bearEmoji || "🧸";
            document.getElementById("s4-headline").textContent = CONFIG.stage4.headline;
            document.getElementById("s4-subtext").textContent = CONFIG.stage4.subtext;
            document.getElementById("btn-continue-s4").textContent = CONFIG.stage4.buttonText || "Continue ❤️";
        }
        document.getElementById("btn-continue-s4").onclick = () => {
            playTone(480, "sine", 0.1, 0.1);
            goToStage(5);
        };
    }

    // --------------------------------------------------------------------------
    // STAGE 5: BIRTHDAY CELEBRATION & CAKE
    // --------------------------------------------------------------------------
    function initStage5() {
        if (CONFIG.stage5) {
            document.getElementById("s5-title").textContent = CONFIG.stage5.celebrationTitle;
            document.getElementById("s5-subtitle").textContent = CONFIG.stage5.celebrationSubtitle;
        }

        // Live Counter Calculation
        const birthDate = new Date(CONFIG.birthDate || "2004-11-06T00:00:00");
        function updateCounter() {
            const now = new Date();
            const diffMs = now - birthDate;

            if (diffMs > 0) {
                const totalMinutes = Math.floor(diffMs / (1000 * 60));
                const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
                const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const years = Math.floor(totalDays / 365.25);

                document.getElementById("cnt-years").textContent = years.toLocaleString();
                document.getElementById("cnt-days").textContent = totalDays.toLocaleString();
                document.getElementById("cnt-hours").textContent = totalHours.toLocaleString();
                document.getElementById("cnt-minutes").textContent = totalMinutes.toLocaleString();
            }
        }
        updateCounter();
        clearInterval(liveCounterTimer);
        liveCounterTimer = setInterval(updateCounter, 60000);

        // Candle Blowout
        const btnBlow = document.getElementById("btn-blow-candles");
        const btnSee = document.getElementById("btn-see-memories");
        const flames = [document.getElementById("flame-1"), document.getElementById("flame-2"), document.getElementById("flame-3")];
        const smokes = [document.getElementById("smoke-1"), document.getElementById("smoke-2"), document.getElementById("smoke-3")];

        flames.forEach(f => f.classList.remove("extinguished"));
        btnBlow.classList.remove("hidden");
        btnSee.classList.add("hidden");

        btnBlow.onclick = () => {
            playPopSound();
            flames.forEach((flame, i) => {
                setTimeout(() => {
                    flame.classList.add("extinguished");
                    if (smokes[i]) smokes[i].classList.add("rise");
                }, i * 150);
            });

            const cakeRect = document.getElementById("cake-container").getBoundingClientRect();
            burstConfetti(cakeRect.left + cakeRect.width / 2, cakeRect.top, 70);
            playChimeSound();

            btnBlow.classList.add("hidden");
            btnSee.classList.remove("hidden");
        };

        btnSee.onclick = () => {
            playTone(480, "sine", 0.1, 0.1);
            goToStage(6);
        };
    }

    // --------------------------------------------------------------------------
    // STAGE 6: CUTE MEMORIES CAROUSEL
    // --------------------------------------------------------------------------
    let currentSlide = 0;
    function initStage6() {
        const track = document.getElementById("carousel-track");
        const dotsContainer = document.getElementById("carousel-dots");
        track.innerHTML = "";
        dotsContainer.innerHTML = "";

        const memories = CONFIG.memories || [];
        memories.forEach((mem, index) => {
            // Slide
            const slide = document.createElement("div");
            slide.className = "carousel-slide";
            slide.innerHTML = `
                <div class="polaroid-card">
                    <div class="polaroid-img-wrapper">
                        <img src="${mem.image}" alt="Memory ${index + 1}" loading="lazy">
                    </div>
                    <div class="polaroid-caption">${mem.caption}</div>
                </div>
            `;
            track.appendChild(slide);

            // Dot
            const dot = document.createElement("div");
            dot.className = `carousel-dot ${index === 0 ? "active" : ""}`;
            dot.onclick = () => setSlide(index);
            dotsContainer.appendChild(dot);
        });

        currentSlide = 0;
        updateCarousel();

        document.getElementById("carousel-prev").onclick = () => {
            playTone(400, "sine", 0.05, 0.05);
            setSlide((currentSlide - 1 + memories.length) % memories.length);
        };

        document.getElementById("carousel-next").onclick = () => {
            playTone(400, "sine", 0.05, 0.05);
            setSlide((currentSlide + 1) % memories.length);
        };

        // Touch Swipe
        let startX = 0;
        track.ontouchstart = (e) => { startX = e.touches[0].clientX; };
        track.ontouchend = (e) => {
            const diff = e.changedTouches[0].clientX - startX;
            if (diff > 45) {
                setSlide((currentSlide - 1 + memories.length) % memories.length);
            } else if (diff < -45) {
                setSlide((currentSlide + 1) % memories.length);
            }
        };

        document.getElementById("btn-next-surprise-s6").onclick = () => {
            playTone(480, "sine", 0.1, 0.1);
            goToStage(7);
        };
    }

    function setSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    function updateCarousel() {
        const track = document.getElementById("carousel-track");
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        const dots = document.querySelectorAll("#carousel-dots .carousel-dot");
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentSlide);
        });
    }

    // --------------------------------------------------------------------------
    // STAGE 7: BALLOON POP GAME
    // --------------------------------------------------------------------------
    function initStage7() {
        const cluster = document.getElementById("balloons-cluster");
        const noteBox = document.getElementById("balloon-note-text");
        const progressEl = document.getElementById("balloon-progress");
        const btnContinue = document.getElementById("btn-continue-s7");

        cluster.innerHTML = "";
        balloonsPopped = 0;
        progressEl.textContent = `Popped 0/${CONFIG.balloonWishes.length}`;
        noteBox.textContent = "Tap a balloon above to unlock a sweet note ✨";
        btnContinue.classList.add("hidden");

        const balloonColors = [
            "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
            "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
            "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
        ];

        CONFIG.balloonWishes.forEach((wish, idx) => {
            const b = document.createElement("div");
            b.className = "balloon";
            b.style.background = balloonColors[idx % balloonColors.length];
            b.onclick = () => {
                if (b.classList.contains("pop")) return;

                playPopSound();
                b.classList.add("pop");

                const rect = b.getBoundingClientRect();
                burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);

                noteBox.textContent = wish;
                noteBox.parentElement.style.transform = "scale(1.03)";
                setTimeout(() => { noteBox.parentElement.style.transform = "scale(1)"; }, 200);

                balloonsPopped++;
                progressEl.textContent = `Popped ${balloonsPopped}/${CONFIG.balloonWishes.length}`;

                if (balloonsPopped === CONFIG.balloonWishes.length) {
                    playChimeSound();
                    btnContinue.classList.remove("hidden");
                }
            };
            cluster.appendChild(b);
        });

        btnContinue.onclick = () => {
            playTone(480, "sine", 0.1, 0.1);
            goToStage(8);
        };
    }

    // --------------------------------------------------------------------------
    // STAGE 8: 3X3 SLIDING PHOTO PUZZLE
    // --------------------------------------------------------------------------
    let puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 8 is empty
    let puzzleMoves = 0;

    function initStage8() {
        puzzleMoves = 0;
        document.getElementById("move-counter").textContent = "Moves: 0";
        document.getElementById("puzzle-win-banner").classList.add("hidden");
        document.getElementById("puzzle-board").classList.remove("solved-board");
        shufflePuzzle();
        renderPuzzle();

        document.getElementById("btn-shuffle-puzzle").onclick = () => {
            shufflePuzzle();
            puzzleMoves = 0;
            document.getElementById("move-counter").textContent = "Moves: 0";
            document.getElementById("puzzle-win-banner").classList.add("hidden");
            document.getElementById("puzzle-board").classList.remove("solved-board");
            renderPuzzle();
        };

        document.getElementById("btn-solve-puzzle").onclick = () => {
            puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            renderPuzzle();
            checkPuzzleWin(true);
        };

        document.getElementById("btn-next-surprise-s8").onclick = () => {
            playTone(480, "sine", 0.1, 0.1);
            goToStage(9);
        };
    }

    function shufflePuzzle() {
        // Do 30 random valid moves to ensure solvability
        puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let emptyIdx = 8;
        for (let i = 0; i < 30; i++) {
            const neighbors = getNeighbors(emptyIdx);
            const moveIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
            puzzleTiles[emptyIdx] = puzzleTiles[moveIdx];
            puzzleTiles[moveIdx] = 8;
            emptyIdx = moveIdx;
        }
    }

    function getNeighbors(idx) {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const res = [];
        if (row > 0) res.push(idx - 3);
        if (row < 2) res.push(idx + 3);
        if (col > 0) res.push(idx - 1);
        if (col < 2) res.push(idx + 1);
        return res;
    }

    function renderPuzzle() {
        const board = document.getElementById("puzzle-board");
        board.innerHTML = "";
        const imgSrc = CONFIG.puzzleImage || "assets/images/pic2.jpg";

        puzzleTiles.forEach((tileVal, currentIdx) => {
            const tile = document.createElement("div");
            tile.className = "puzzle-tile";

            if (tileVal === 8) {
                tile.classList.add("empty");
            } else {
                tile.style.backgroundImage = `url("${imgSrc}")`;
                tile.style.backgroundSize = "300% 300%";
                const origRow = Math.floor(tileVal / 3);
                const origCol = tileVal % 3;
                // Positive percentage: Col 0 -> 0%, Col 1 -> 50%, Col 2 -> 100%
                tile.style.backgroundPosition = `${origCol * 50}% ${origRow * 50}%`;

                // Subtle number badge
                const numBadge = document.createElement("span");
                numBadge.className = "tile-num";
                numBadge.textContent = tileVal + 1;
                tile.appendChild(numBadge);

                tile.onclick = () => onTileClick(currentIdx);
            }
            board.appendChild(tile);
        });
    }

    function onTileClick(idx) {
        const emptyIdx = puzzleTiles.indexOf(8);
        const neighbors = getNeighbors(emptyIdx);

        if (neighbors.includes(idx)) {
            puzzleTiles[emptyIdx] = puzzleTiles[idx];
            puzzleTiles[idx] = 8;
            puzzleMoves++;
            document.getElementById("move-counter").textContent = `Moves: ${puzzleMoves}`;
            playTone(450, "sine", 0.04, 0.06);
            renderPuzzle();
            checkPuzzleWin();
        }
    }

    function checkPuzzleWin(force = false) {
        const isWin = force || puzzleTiles.every((val, idx) => val === idx);
        if (isWin) {
            playChimeSound();
            const board = document.getElementById("puzzle-board");
            board.classList.add("solved-board");

            // Fill in the 9th empty tile with the remaining corner of the image
            const emptyTile = board.querySelector(".puzzle-tile.empty");
            if (emptyTile) {
                emptyTile.classList.remove("empty");
                const imgSrc = CONFIG.puzzleImage || "assets/images/pic2.jpg";
                emptyTile.style.backgroundImage = `url("${imgSrc}")`;
                emptyTile.style.backgroundSize = "300% 300%";
                emptyTile.style.backgroundPosition = "100% 100%";
            }

            const boardRect = board.getBoundingClientRect();
            burstConfetti(boardRect.left + boardRect.width / 2, boardRect.top + boardRect.height / 2, 70);
            document.getElementById("puzzle-win-banner").classList.remove("hidden");
        }
    }

    // --------------------------------------------------------------------------
    // STAGE 9: SCRATCH CARD SURPRISE
    // --------------------------------------------------------------------------
    function initStage9() {
        if (CONFIG.scratchCard) {
            document.getElementById("s9-title").textContent = CONFIG.scratchCard.title;
            document.getElementById("s9-subtitle").textContent = CONFIG.scratchCard.subtitle;
            document.getElementById("scratch-img").src = CONFIG.scratchCard.revealImage || "assets/images/pic4.jpg";
            document.getElementById("scratch-rev-title").textContent = CONFIG.scratchCard.revealTitle;
            document.getElementById("scratch-rev-msg").textContent = CONFIG.scratchCard.revealMessage;
            document.getElementById("btn-read-letter").textContent = CONFIG.scratchCard.nextButtonText || "Read My Letter 💌";
        }

        const canvas = document.getElementById("scratch-canvas");
        const ctx = canvas.getContext("2d");
        const btnNext = document.getElementById("btn-read-letter");
        btnNext.classList.add("hidden");

        const wrapper = document.getElementById("scratch-wrapper");
        canvas.width = wrapper.offsetWidth || 310;
        canvas.height = wrapper.offsetHeight || 240;

        // Draw Gold Foil coating
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, "#e5a93b");
        grad.addColorStop(0.3, "#fff2a8");
        grad.addColorStop(0.6, "#df9d28");
        grad.addColorStop(1, "#f7d070");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle glitter texture & hint text
        ctx.fillStyle = "#633c06";
        ctx.font = "bold 17px Poppins, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scratch here 💖", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "13px Poppins, sans-serif";
        ctx.fillText("Reveal your secret surprise", canvas.width / 2, canvas.height / 2 + 18);

        let isScratching = false;
        let scratchedPixels = 0;
        let hasRevealed = false;

        function scratch(x, y) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);
            ctx.fill();

            scratchedPixels += 1;
            if (scratchedPixels % 12 === 0 && !hasRevealed) {
                checkScratchPercent();
            }
        }

        function checkScratchPercent() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let clearCount = 0;
            const total = imageData.data.length / 4;
            // Check sample pixels for performance
            for (let i = 3; i < imageData.data.length; i += 16) {
                if (imageData.data[i] === 0) clearCount++;
            }

            if (clearCount / (total / 4) > 0.45 && !hasRevealed) {
                hasRevealed = true;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                playChimeSound();
                const rect = canvas.getBoundingClientRect();
                burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
                btnNext.classList.remove("hidden");
            }
        }

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            const scaleX = canvas.width / (rect.width || 1);
            const scaleY = canvas.height / (rect.height || 1);
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        canvas.onmousedown = (e) => { isScratching = true; const p = getPos(e); scratch(p.x, p.y); };
        window.onmouseup = () => { isScratching = false; };
        canvas.onmousemove = (e) => { if (isScratching) { const p = getPos(e); scratch(p.x, p.y); } };

        canvas.ontouchstart = (e) => {
            if (e.cancelable) e.preventDefault();
            isScratching = true;
            const p = getPos(e);
            scratch(p.x, p.y);
        };
        window.ontouchend = () => { isScratching = false; };
        canvas.ontouchmove = (e) => {
            if (e.cancelable) e.preventDefault();
            if (isScratching) {
                const p = getPos(e);
                scratch(p.x, p.y);
            }
        };

        btnNext.onclick = () => {
            playTone(480, "sine", 0.1, 0.1);
            goToStage(10);
        };
    }

    // --------------------------------------------------------------------------
    // STAGE 10: ROMANTIC ENVELOPE & LOVE LETTER
    // --------------------------------------------------------------------------
    function initStage10() {
        const envWrapper = document.getElementById("envelope-wrapper");
        const envelope = document.getElementById("envelope-trigger");
        const letterPaper = document.getElementById("letter-paper");
        const letterGreeting = document.getElementById("letter-greeting");
        const letterBody = document.getElementById("letter-body");
        const letterSignoff = document.getElementById("letter-signoff");

        envWrapper.classList.remove("hidden");
        envelope.classList.remove("opened");
        letterPaper.classList.add("hidden");

        const letterData = CONFIG.letter || {};
        letterGreeting.textContent = letterData.greeting || "My dearest,";
        letterSignoff.textContent = letterData.signOff || "Forever yours, with all my heart ❤️";

        envelope.onclick = () => {
            playChimeSound();
            envelope.classList.add("opened");
            burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);

            setTimeout(() => {
                envWrapper.classList.add("hidden");
                letterPaper.classList.remove("hidden");

                // Render paragraphs
                letterBody.innerHTML = "";
                (letterData.paragraphs || []).forEach((pText) => {
                    const p = document.createElement("p");
                    p.textContent = pText;
                    letterBody.appendChild(p);
                });
            }, 750);
        };

        document.getElementById("btn-replay").onclick = () => {
            playTone(400, "sine", 0.1, 0.1);
            goToStage(1);
        };
    }
});
