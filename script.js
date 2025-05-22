// Start with content visible and initialize Three.js in the background
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations for the beranda page immediately
    initAnimation();
    
    // Initialize Three.js in the background with a slight delay
    // to prioritize UI rendering first
    setTimeout(() => {
        initThreeJS();
    }, 300);

    // Load the first question when the page loads
    loadQuizQuestion();
});

// Page navigation with animation
function navigateTo(pageId) {
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.getElementById(pageId);
    
    if (currentPage.id === targetPage.id) return;
    
    // Exit animation for current page
    gsap.to(currentPage, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        onComplete: () => {
            currentPage.classList.remove('active');
            
            // Entry animation for target page
            targetPage.classList.add('active');
            gsap.fromTo(targetPage, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.4 }
            );
            
            // Trigger 3D animation for page transition if Three.js is initialized
            if (typeof particles !== 'undefined') {
                animate3DTransition(currentPage.id, pageId);
            }
        }
    });
}

// THREE.js setup with reduced complexity
let scene, camera, renderer, particles;

function initThreeJS() {
    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1);
        document.getElementById('canvas-container').appendChild(renderer.domElement);
        
        // Create particles with reduced count for better performance
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 300;
        
        const posArray = new Float32Array(particlesCount * 3);
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03,
            color: 0x00c6ff,
            transparent: true,
            opacity: 0.8
        });
        
        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        
        camera.position.z = 5;
        
        animate();
        
        // Throttled resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (camera && renderer) {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
            }, 250);
        });
    } catch (error) {
        console.log("Three.js initialization error. Continuing without 3D background.");
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        // Reduced rotation speed for better performance
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0003;
        
        renderer.render(scene, camera);
    }
}

function animate3DTransition(fromPage, toPage) {
    if (!particles) return;
    
    // Simplified animations for better performance
    if (fromPage === 'beranda' && toPage === 'materi') {
        gsap.to(particles.rotation, {
            x: particles.rotation.x + Math.PI/2,
            duration: 0.8,
            ease: "power2.inOut"
        });
    } 
    else if (fromPage === 'beranda' && toPage === 'anggota') {
        gsap.to(particles.rotation, {
            z: particles.rotation.z + Math.PI,
            duration: 0.8,
            ease: "power2.out"
        });
    }
    else if (fromPage === 'materi' && toPage === 'beranda') {
        gsap.to(particles.rotation, {
            x: particles.rotation.x - Math.PI/4,
            duration: 0.8,
            ease: "power2.out"
        });
    }
    else if (fromPage === 'materi' && toPage === 'anggota') {
        gsap.to(particles.rotation, {
            y: particles.rotation.y + Math.PI/2,
            duration: 0.8,
            ease: "power2.inOut"
        });
    }
    else if (fromPage === 'anggota' && toPage === 'beranda') {
        gsap.to(particles.rotation, {
            z: particles.rotation.z - Math.PI,
            duration: 0.8,
            ease: "power2.out"
        });
    }
    else if (fromPage === 'anggota' && toPage === 'materi') {
        gsap.to(particles.rotation, {
            x: particles.rotation.x + Math.PI/4,
            y: particles.rotation.y - Math.PI/4,
            duration: 0.8,
            ease: "power2.inOut"
        });
    }
}

function initAnimation() {
    // Initial animations for beranda page
    const elements = [
        {selector: '.logo', delay: 0.1},
        {selector: '.nav-links', delay: 0.2},
        {selector: '.hero h1', delay: 0.2},
        {selector: '.hero p', delay: 0.3},
        {selector: '.btn', delay: 0.4}
    ];
    
    elements.forEach(item => {
        gsap.from(item.selector, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: item.delay,
            ease: "power2.out"
        });
    });
    
    // Load feature cards with staggered animation
    gsap.from('.feature-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        stagger: 0.1,
        ease: "power2.out"
    });
}

function showMateri(title, description) {
    const modal = document.getElementById('materi-modal');
    document.getElementById('materi-title').textContent = title;
    document.getElementById('materi-description').textContent = description;
    modal.classList.remove('hidden');
}

function closeMateriModal() {
    const modal = document.getElementById('materi-modal');
    modal.classList.add('hidden');
}

function showMateri(materi) {
    alert(`Menampilkan materi: ${materi}`);
}

function calculateComplex(operation) {
    const complex1 = document.getElementById('complex1').value.trim();
    const complex2 = document.getElementById('complex2').value.trim();

    const parseComplex = (str) => {
        const match = str.match(/^([-+]?\d*\.?\d+)?([-+]\d*\.?\d+)?i$/);
        if (!match) return null;
        return {
            real: parseFloat(match[1]) || 0,
            imag: parseFloat(match[2]) || 0,
        };
    };

    const c1 = parseComplex(complex1);
    const c2 = parseComplex(complex2);

    if (!c1 || !c2) {
        document.getElementById('complex-result').textContent = 'Format bilangan kompleks tidak valid! Gunakan format seperti "3+4i" atau "-2-5i".';
        return;
    }

    let result;
    switch (operation) {
        case 'add':
            result = { real: c1.real + c2.real, imag: c1.imag + c2.imag };
            break;
        case 'subtract':
            result = { real: c1.real - c2.real, imag: c1.imag - c2.imag };
            break;
        case 'multiply':
            result = {
                real: c1.real * c2.real - c1.imag * c2.imag,
                imag: c1.real * c2.imag + c1.imag * c2.real,
            };
            break;
        case 'divide':
            const denominator = c2.real ** 2 + c2.imag ** 2;
            if (denominator === 0) {
                document.getElementById('complex-result').textContent = 'Pembagian dengan nol tidak valid!';
                return;
            }
            result = {
                real: (c1.real * c2.real + c1.imag * c2.imag) / denominator,
                imag: (c1.imag * c2.real - c1.real * c2.imag) / denominator,
            };
            break;
        default:
            document.getElementById('complex-result').textContent = 'Operasi tidak valid!';
            return;
    }

    const resultText = `${result.real.toFixed(2)} ${result.imag >= 0 ? '+' : ''} ${result.imag.toFixed(2)}i`;
    document.getElementById('complex-result').textContent = `Hasil: ${resultText}`;
}

const quizQuestions = [
    { question: "Apa hasil dari (3 + 4i) + (1 - 2i)?", answer: "4+2i" },
    { question: "Apa hasil dari (5 + 6i) - (2 + 3i)?", answer: "3+3i" },
    { question: "Apa hasil dari (2 + 3i) * (1 - 4i)?", answer: "14-5i" },
    { question: "Apa hasil dari (6 + 8i) / (2 + 2i)?", answer: "3+1i" },
    { question: "Apa hasil dari (4 + 5i) + (6 - 7i)?", answer: "10-2i" },
    { question: "Apa hasil dari (7 + 3i) - (4 + 6i)?", answer: "3-3i" },
    { question: "Apa hasil dari (1 + 2i) * (3 + 4i)?", answer: "-5+10i" },
    { question: "Apa hasil dari (8 + 6i) / (4 + 2i)?", answer: "2+1i" },
    { question: "Apa hasil dari (2 + 3i) + (5 - 4i)?", answer: "7-1i" },
    { question: "Apa hasil dari (9 + 2i) - (3 + 7i)?", answer: "6-5i" },
];

let currentQuestionIndex = 0;
let incorrectAnswers = [];

function loadQuizQuestion() {
    const questionElement = document.getElementById('question');
    const feedbackElement = document.getElementById('quiz-feedback');
    const answerInput = document.getElementById('answer');

    if (currentQuestionIndex < quizQuestions.length) {
        questionElement.textContent = quizQuestions[currentQuestionIndex].question;
        feedbackElement.textContent = "";
        answerInput.value = "";
    } else {
        displayQuizSummary();
    }
}

function checkQuizAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    const correctAnswer = quizQuestions[currentQuestionIndex].answer;

    if (userAnswer === correctAnswer) {
        document.getElementById('quiz-feedback').textContent = "Jawaban Anda benar! 🎉";
        document.getElementById('quiz-feedback').style.color = "green";
    } else {
        document.getElementById('quiz-feedback').textContent = `Jawaban Anda salah. Jawaban yang benar adalah: ${correctAnswer}`;
        document.getElementById('quiz-feedback').style.color = "red";
        incorrectAnswers.push({
            question: quizQuestions[currentQuestionIndex].question,
            correctAnswer: correctAnswer,
            userAnswer: userAnswer || "Tidak dijawab",
        });
    }

    currentQuestionIndex++;
    setTimeout(loadQuizQuestion, 1500);
}

function displayQuizSummary() {
    const questionElement = document.getElementById('question');
    const feedbackElement = document.getElementById('quiz-feedback');
    const answerInput = document.getElementById('answer');
    const submitButton = document.querySelector('.quiz button');

    questionElement.textContent = "Selamat! Anda telah menyelesaikan semua soal.";
    feedbackElement.textContent = "";
    answerInput.style.display = "none";
    submitButton.style.display = "none";

    if (incorrectAnswers.length > 0) {
        const summaryElement = document.createElement('div');
        summaryElement.innerHTML = "<h3>Jawaban yang Salah:</h3>";
        incorrectAnswers.forEach((item, index) => {
            const itemElement = document.createElement('p');
            itemElement.innerHTML = `${index + 1}. ${item.question}<br>Jawaban Anda: ${item.userAnswer}<br>Jawaban Benar: ${item.correctAnswer}`;
            summaryElement.appendChild(itemElement);
        });
        document.querySelector('.quiz').appendChild(summaryElement);
    } else {
        feedbackElement.textContent = "Semua jawaban Anda benar! 🎉";
        feedbackElement.style.color = "green";
    }
}

// Load the first question when the page loads
document.addEventListener('DOMContentLoaded', loadQuizQuestion);