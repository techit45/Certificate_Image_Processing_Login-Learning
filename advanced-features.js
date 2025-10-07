// 🚀 Advanced Features JavaScript - Ultra Detailed Enhancement

document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedFeatures();
});

function initializeAdvancedFeatures() {
    addProgressIndicator();
    addRealtimeFeedback();
    enhanceFormValidation();
    addRatingVisualizations();
    addCharacterCounters();
    addTooltips();
    addAutoSave();
    addTypingEffects();
    addAdvancedAnimations();
}

// 📊 Progress Indicator
function addProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'form-progress';
    document.body.appendChild(progressBar);
    
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'progress-indicator';
    progressIndicator.innerHTML = `
        <div class="progress-text">การทำแบบฟอร์ม: 0%</div>
        <div class="progress-details">กรอกข้อมูลเพิ่มเติมเพื่อดำเนินการต่อ</div>
    `;
    
    const form = document.getElementById('evaluationForm');
    form.insertBefore(progressIndicator, form.firstChild);
    
    updateProgress();
}

function updateProgress() {
    const form = document.getElementById('evaluationForm');
    const requiredFields = form.querySelectorAll('[required], input[type="radio"]');
    const radioGroups = {};
    let totalFields = 0;
    let completedFields = 0;
    
    // Count radio groups
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            if (!radioGroups[field.name]) {
                radioGroups[field.name] = false;
                totalFields++;
            }
            if (field.checked) {
                radioGroups[field.name] = true;
            }
        } else {
            totalFields++;
            if (field.value.trim()) completedFields++;
        }
    });
    
    // Count completed radio groups
    Object.values(radioGroups).forEach(completed => {
        if (completed) completedFields++;
    });
    
    const progress = Math.round((completedFields / totalFields) * 100);
    
    // Update progress bar
    const progressBar = document.querySelector('.form-progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
    
    // Update indicator
    const progressText = document.querySelector('.progress-text');
    const progressDetails = document.querySelector('.progress-details');
    
    if (progressText) {
        progressText.textContent = `การทำแบบฟอร์ม: ${progress}%`;
    }
    
    if (progressDetails) {
        if (progress === 100) {
            progressDetails.textContent = '🎉 เสร็จสิ้น! พร้อมส่งแบบฟอร์ม';
            progressDetails.style.color = '#27ae60';
        } else if (progress >= 75) {
            progressDetails.textContent = '⚡ เกือบเสร็จแล้ว!';
            progressDetails.style.color = '#f39c12';
        } else if (progress >= 50) {
            progressDetails.textContent = '📝 ทำไปได้ครึ่งหนึ่งแล้ว';
            progressDetails.style.color = '#3498db';
        } else {
            progressDetails.textContent = '👋 เริ่มต้นกรอกแบบฟอร์ม';
            progressDetails.style.color = '#7f8c8d';
        }
    }
}

// 📈 Real-time Feedback Panel
function addRealtimeFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'realtime-feedback';
    feedback.innerHTML = `
        <div class="feedback-title">📊 สถิติการกรอก</div>
        <div class="feedback-stats">
            <div class="stat-item">
                <span class="stat-value" id="completedCount">0</span>
                <span class="stat-label">เสร็จแล้ว</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="remainingCount">12</span>
                <span class="stat-label">เหลือ</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="averageRating">0.0</span>
                <span class="stat-label">คะแนนเฉลี่ย</span>
            </div>
            <div class="stat-item">
                <span class="stat-value" id="timeSpent">0</span>
                <span class="stat-label">นาที</span>
            </div>
        </div>
    `;
    document.body.appendChild(feedback);
    
    // Start timer
    const startTime = Date.now();
    setInterval(() => {
        const minutes = Math.floor((Date.now() - startTime) / 60000);
        document.getElementById('timeSpent').textContent = minutes;
    }, 60000);
}

function updateRealtimeFeedback() {
    const form = document.getElementById('evaluationForm');
    const requiredFields = form.querySelectorAll('[required], input[type="radio"]');
    const radioGroups = {};
    let totalFields = 0;
    let completedFields = 0;
    let totalRating = 0;
    let ratingCount = 0;
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            if (!radioGroups[field.name]) {
                radioGroups[field.name] = { completed: false, value: 0 };
                totalFields++;
            }
            if (field.checked) {
                radioGroups[field.name].completed = true;
                radioGroups[field.name].value = parseInt(field.value) || 0;
            }
        } else {
            totalFields++;
            if (field.value.trim()) completedFields++;
        }
    });
    
    Object.values(radioGroups).forEach(group => {
        if (group.completed) {
            completedFields++;
            if (group.value > 0) {
                totalRating += group.value;
                ratingCount++;
            }
        }
    });
    
    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '0.0';
    
    document.getElementById('completedCount').textContent = completedFields;
    document.getElementById('remainingCount').textContent = totalFields - completedFields;
    document.getElementById('averageRating').textContent = averageRating;
}

// ⭐ Rating Visualizations
function addRatingVisualizations() {
    const ratingGroups = document.querySelectorAll('.rating-group');
    
    ratingGroups.forEach(group => {
        const visualization = document.createElement('div');
        visualization.className = 'rating-visualization';
        visualization.innerHTML = `
            <div class="rating-stars"></div>
            <div class="rating-text">เลือกคะแนน</div>
        `;
        group.appendChild(visualization);
        
        const radios = group.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateRatingVisualization(group, parseInt(radio.value));
                updateRealtimeFeedback();
            });
        });
    });
}

function updateRatingVisualization(group, rating) {
    const starsContainer = group.querySelector('.rating-stars');
    const ratingText = group.querySelector('.rating-text');
    
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
    }
    starsContainer.innerHTML = stars;
    
    const ratingTexts = {
        1: 'ไม่พอใจมาก',
        2: 'ไม่พอใจ', 
        3: 'ปานกลาง',
        4: 'พอใจ',
        5: 'พอใจมาก'
    };
    
    ratingText.textContent = ratingTexts[rating] || 'เลือกคะแนน';
    ratingText.style.color = rating >= 4 ? '#27ae60' : rating >= 3 ? '#f39c12' : '#e74c3c';
}

// 🔤 Character Counters
function addCharacterCounters() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;
        
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0/${maxLength} อักขระ`;
        
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            const current = this.value.length;
            counter.textContent = `${current}/${maxLength} อักขระ`;
            
            // Color coding
            counter.className = 'char-counter';
            if (current > maxLength * 0.9) {
                counter.classList.add('danger');
            } else if (current > maxLength * 0.7) {
                counter.classList.add('warning');
            }
            
            updateProgress();
        });
    });
}

// 💡 Enhanced Tooltips
function addTooltips() {
    const questions = document.querySelectorAll('.question');
    const tooltipData = {
        'เนื้อหาของหลักสูตร': 'ประเมินความเหมาะสม ความทันสมัย และความครอบคลุมของเนื้อหา',
        'วิทยากร': 'ประเมินความเชี่ยวชาญ การนำเสนอ และการตอบคำถาม',
        'ระยะเวลาการอบรม': 'ประเมินความเหมาะสมของเวลาที่ใช้ในการอบรม',
        'การแนะนำให้ผู้อื่น': 'ระดับความน่าจะเป็นที่จะแนะนำหลักสูตรนี้ให้คนอื่น',
        'การทำ Hands-on': 'ประเมินกิจกรรมปฏิบัติและการฝึกทักษะ',
        'เครื่องมือและ Software': 'ประเมินความเหมาะสมของเครื่องมือที่ใช้',
        'การนำไปใช้ในงานจริง': 'ประเมินความสามารถในการประยุกต์ใช้',
        'จำนวนผู้เข้าร่วม': 'ประเมินความเหมาะสมของขนาดกลุ่ม'
    };
    
    questions.forEach(question => {
        const text = question.textContent.trim();
        for (const [key, tooltip] of Object.entries(tooltipData)) {
            if (text.includes(key)) {
                const tooltipSpan = document.createElement('span');
                tooltipSpan.className = 'tooltip';
                tooltipSpan.innerHTML = ` ❓<span class="tooltiptext">${tooltip}</span>`;
                question.appendChild(tooltipSpan);
                break;
            }
        }
    });
}

// 💾 Auto-save functionality
function addAutoSave() {
    const form = document.getElementById('evaluationForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Load saved data
    inputs.forEach(input => {
        const saved = localStorage.getItem(`form_${input.name}`);
        if (saved && input.type !== 'radio') {
            input.value = saved;
        } else if (saved && input.type === 'radio' && input.value === saved) {
            input.checked = true;
        }
    });
    
    // Save on change
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            localStorage.setItem(`form_${this.name}`, this.value);
            
            // Show save indicator
            showSaveIndicator();
        });
    });
    
    // Clear saved data on successful submit
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`form_${input.name}`);
        });
    });
}

function showSaveIndicator() {
    let indicator = document.getElementById('saveIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'saveIndicator';
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        indicator.textContent = '💾 บันทึกแล้ว';
        document.body.appendChild(indicator);
    }
    
    indicator.style.opacity = '1';
    setTimeout(() => {
        indicator.style.opacity = '0';
    }, 2000);
}

// ⌨️ Typing Effects
function addTypingEffects() {
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    
    textInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// 🎭 Advanced Animations
function addAdvancedAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    const sections = document.querySelectorAll('.section, .evaluation-item');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Enhanced validation with real-time feedback
function enhanceFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
            updateProgress();
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    // Check if field exists and has a value property
    if (!field || !field.value) {
        return;
    }

    const value = field.value.trim();
    const fieldContainer = field.closest('.form-group') || field.parentNode;
    
    // Remove previous states
    field.classList.remove('valid', 'error');
    
    // Validation logic
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    if ((field.name === 'firstName' || field.name === 'lastName') && value) {
        const nameRegex = /^[A-Za-z\s-'.]+$/;
        isValid = nameRegex.test(value);
    }
    
    // Apply validation state
    if (value) {
        field.classList.add(isValid ? 'valid' : 'error');
    }
    
    return isValid;
}

// Initialize all event listeners
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        updateProgress();
        updateRealtimeFeedback();
    }
});

document.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        updateProgress();
        updateRealtimeFeedback();
    }
});

// Mobile-specific enhancements
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', function() {
        // Hide feedback panel on mobile by default
        const feedback = document.querySelector('.realtime-feedback');
        if (feedback) {
            feedback.classList.add('hidden');
            
            // Show on scroll up
            let lastScrollY = window.scrollY;
            window.addEventListener('scroll', function() {
                if (window.scrollY < lastScrollY) {
                    feedback.classList.remove('hidden');
                } else {
                    feedback.classList.add('hidden');
                }
                lastScrollY = window.scrollY;
            });
        }
    });
}