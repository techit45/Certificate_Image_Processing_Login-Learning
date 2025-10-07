// Configuration - Replace with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxoK9jCqNYiEBoc3fDuurTzoues5k5rpczkZZcvH-sOXGHRxyzF-4vpYJtnrDwl6LU/exec';

// Add CSS for enhanced form validation
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15) !important;
    }
    
    .field-error {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .evaluation-item {
        transition: all 0.3s ease;
    }
    
    .evaluation-item.completed {
        border-color: rgba(76, 175, 80, 0.3);
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(129, 199, 132, 0.05));
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('evaluationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', handleFormSubmit);

    // Handle conditional question for course continuation
    initializeCourseContinuationLogic();
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get all necessary DOM elements
    const form = document.getElementById('evaluationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'flex';
    
    try {
        // Collect form data
        const formData = collectFormData();
        
        // Validate required fields
        if (!validateFormData(formData)) {
            throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
        
        // Add average rating to data
        formData.averageRating = calculateAverageRating(formData);
        
        // Send data to Google Apps Script
        const response = await sendToGoogleScript(formData);
        
        if (response.success) {
            // Show success message
            successMessage.style.display = 'block';
            const evaluationForm = document.getElementById('evaluationForm');
            evaluationForm.style.display = 'none';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error(response.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        errorMessage.querySelector('p').textContent = error.message;
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        loading.style.display = 'none';
    }
}

function collectFormData() {
    const form = document.getElementById('evaluationForm');
    const formData = new FormData(form);

    const data = {
        firstName: formData.get('firstName')?.trim(),
        lastName: formData.get('lastName')?.trim(),
        email: formData.get('email')?.trim(),
        gradeLevel: formData.get('gradeLevel')?.trim(),
        contentRating: formData.get('contentRating'),
        instructorRating: formData.get('instructorRating'),
        durationRating: formData.get('durationRating'),
        recommendRating: formData.get('recommendRating'),
        practicalRating: formData.get('practicalRating'),
        toolsRating: formData.get('toolsRating'),
        practicalUseRating: formData.get('practicalUseRating'),
        groupSizeRating: formData.get('groupSizeRating'),
        courseContinuation: formData.get('courseContinuation'),
        notContinueReason: formData.get('notContinueReason')?.trim() || '',
        improvements: formData.get('improvements')?.trim() || '',
        additionalComments: formData.get('additionalComments')?.trim() || '',
        submissionTime: new Date().toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        course: 'Power Supply Design & Analysis'
    };

    // Combine first and last name for certificate
    data.fullName = `${data.firstName} ${data.lastName}`;

    return data;
}

function validateFormData(data) {
    // Required fields validation
    const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'gradeLevel',
        'contentRating',
        'instructorRating',
        'durationRating',
        'recommendRating',
        'practicalRating',
        'toolsRating',
        'practicalUseRating',
        'groupSizeRating',
        'courseContinuation'
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            return false;
        }
    }

    // Validate reason if "ไม่ต่อ" is selected
    if (data.courseContinuation === 'ไม่ต่อ') {
        if (!data.notContinueReason || data.notContinueReason.trim().length === 0) {
            alert('กรุณาระบุเหตุผลที่ไม่ต่อคอร์ส');
            return false;
        }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }

    // Name validation (English characters only)
    const nameRegex = /^[A-Za-z\s-'.]+$/;
    if (!nameRegex.test(data.firstName) || !nameRegex.test(data.lastName)) {
        alert('กรุณากรอกชื่อและนามสกุลเป็นภาษาอังกฤษเท่านั้น');
        return false;
    }

    return true;
}

async function sendToGoogleScript(data) {
    return new Promise((resolve, reject) => {
        try {
            // Create hidden form for form submission
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = GOOGLE_SCRIPT_URL;
            form.target = 'submission_iframe_' + Date.now();
            form.style.display = 'none';
            
            // Add all data fields as individual inputs
            Object.keys(data).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            });
            
            // Create unique iframe for this submission
            const iframe = document.createElement('iframe');
            iframe.name = form.target;
            iframe.style.display = 'none';
            
            // Set up success/error handling
            let responseReceived = false;
            
            const cleanup = () => {
                if (document.body.contains(form)) document.body.removeChild(form);
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
            };
            
            // Handle successful submission
            iframe.onload = function() {
                if (!responseReceived) {
                    responseReceived = true;
                    setTimeout(() => {
                        cleanup();
                        resolve({ success: true });
                    }, 1000);
                }
            };
            
            // Handle errors
            iframe.onerror = function() {
                if (!responseReceived) {
                    responseReceived = true;
                    cleanup();
                    reject(new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง'));
                }
            };
            
            // Set timeout
            setTimeout(() => {
                if (!responseReceived) {
                    responseReceived = true;
                    cleanup();
                    resolve({ success: true }); // Assume success after timeout
                }
            }, 15000); // 15 second timeout
            
            // Add to page and submit
            document.body.appendChild(iframe);
            document.body.appendChild(form);
            
            // Submit after a short delay to ensure iframe is ready
            setTimeout(() => {
                form.submit();
            }, 100);
            
        } catch (error) {
            console.error('Error in form submission method:', error);
            reject(new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง'));
        }
    });
}

// Utility function to handle form reset (if needed)
function resetForm() {
    const form = document.getElementById('evaluationForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    form.reset();
    form.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Add enhanced interactive feedback and form validation
document.addEventListener('DOMContentLoaded', function() {
    const radioGroups = document.querySelectorAll('.rating-group');
    
    // Enhanced radio button interactions
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Remove selected class from all labels in this group
                radios.forEach(r => {
                    r.nextElementSibling.classList.remove('selected');
                });
                
                // Add selected class to the current label
                if (this.checked) {
                    this.nextElementSibling.classList.add('selected');
                }
                
                // Update progress
                updateFormProgress();
            });
        });
    });
    
    // Add input event listeners for text fields and select
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
    textInputs.forEach(input => {
        input.addEventListener('input', updateFormProgress);
        input.addEventListener('change', updateFormProgress);
        input.addEventListener('blur', validateField);
    });
    
    // Add special handling for grade level dropdown with color coding
    const gradeLevelSelect = document.getElementById('gradeLevel');
    if (gradeLevelSelect) {
        gradeLevelSelect.addEventListener('change', function() {
            // Update border color based on grade
            const gradeColors = {
                'M1': '#ff6b6b',
                'M2': '#4ecdc4', 
                'M3': '#45b7d1',
                'M4': '#96ceb4',
                'M5': '#ffeaa7',
                'M6': '#dda0dd'
            };
            
            if (gradeColors[this.value]) {
                this.style.borderLeftColor = gradeColors[this.value];
                this.style.borderLeftWidth = '4px';
                this.style.borderLeftStyle = 'solid';
            } else {
                this.style.borderLeft = '';
            }
        });
    }
    
    // Initialize progress
    updateFormProgress();
});

// Update form completion progress
function updateFormProgress() {
    const form = document.getElementById('evaluationForm');
    const formData = new FormData(form);
    
    const requiredFields = [
        'firstName', 'lastName', 'email', 'gradeLevel',
        'contentRating', 'instructorRating', 'durationRating', 'recommendRating',
        'practicalRating', 'toolsRating', 'practicalUseRating', 'groupSizeRating'
    ];
    
    let completedFields = 0;
    requiredFields.forEach(field => {
        const value = formData.get(field);
        if (value && value.trim()) {
            completedFields++;
        }
    });
    
    const progress = (completedFields / requiredFields.length) * 100;
    
    // Update submit button appearance based on progress
    const submitBtn = document.getElementById('submitBtn');
    if (progress === 100) {
        submitBtn.style.opacity = '1';
        submitBtn.style.transform = 'scale(1.02)';
    } else {
        submitBtn.style.opacity = '0.8';
        submitBtn.style.transform = 'scale(1)';
    }
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove previous error styling
    field.classList.remove('error');
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'กรุณากรอกอีเมลที่ถูกต้อง');
            return;
        }
    }
    
    // Name validation (English only)
    if ((field.name === 'firstName' || field.name === 'lastName') && value) {
        const nameRegex = /^[A-Za-z\s-'.]+$/;
        if (!nameRegex.test(value)) {
            field.classList.add('error');
            showFieldError(field, 'กรุณากรอกชื่อเป็นภาษาอังกฤษเท่านั้น');
            return;
        }
    }
    
    // Clear error message if validation passed
    clearFieldError(field);
}

// Show field-specific error message
function showFieldError(field, message) {
    clearFieldError(field); // Clear existing error first
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85em';
    errorDiv.style.marginTop = '5px';
    errorDiv.style.fontStyle = 'italic';
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field-specific error message
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Calculate average rating for display
function calculateAverageRating(data) {
    const ratings = [
        parseInt(data.contentRating),
        parseInt(data.instructorRating),
        parseInt(data.durationRating),
        parseInt(data.recommendRating),
        parseInt(data.practicalRating),
        parseInt(data.toolsRating),
        parseInt(data.practicalUseRating),
        parseInt(data.groupSizeRating)
    ].filter(rating => !isNaN(rating));

    if (ratings.length === 0) return 0;

    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2);
}

// Initialize course continuation conditional logic
function initializeCourseContinuationLogic() {
    const courseRadios = document.querySelectorAll('input[name="courseContinuation"]');
    const reasonSection = document.getElementById('reasonSection');
    const reasonTextarea = document.getElementById('notContinueReason');

    courseRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'ไม่ต่อ') {
                // Show reason section and make it required
                reasonSection.style.display = 'block';
                reasonTextarea.setAttribute('required', 'required');
                // Smooth scroll to reason section
                setTimeout(() => {
                    reasonSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                // Hide reason section and remove required
                reasonSection.style.display = 'none';
                reasonTextarea.removeAttribute('required');
                reasonTextarea.value = ''; // Clear the value
            }
        });
    });
}