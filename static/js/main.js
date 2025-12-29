// Main functionality for heart disease risk prediction app
document.addEventListener('DOMContentLoaded', function() {
    // Add script tag for particles.js animation
    const particlesScript = document.createElement('script');
    particlesScript.src = '/static/js/particles.js';
    document.body.appendChild(particlesScript);
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize form progress tracking
    initFormProgress();
    
    // Handle form submission
    const heartForm = document.getElementById('heartForm');
    if (heartForm) {
      heartForm.addEventListener('submit', handleHeartFormSubmit);
    }
  });
  
  function initEventListeners() {
    // Add focus and blur event listeners to form inputs for animation
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    
    formInputs.forEach(input => {
      // Add focus and blur event listeners
      input.addEventListener('focus', handleInputFocus);
      input.addEventListener('blur', handleInputBlur);
      
      // Track input changes for form progress
      input.addEventListener('change', updateFormProgress);
      input.addEventListener('input', updateFormProgress);
    });
  }
  
  // Initialize and track form completion progress
  function initFormProgress() {
    // Get progress elements
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressFill && progressPercent) {
      // Initial update
      updateFormProgress();
    }
  }
  
  // Update form progress based on filled fields
  function updateFormProgress() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    if (!progressFill || !progressPercent) return;
    
    let filledInputs = 0;
    formInputs.forEach(input => {
      if (input.value && input.value.trim() !== '') {
        filledInputs++;
      }
    });
    
    const totalInputs = formInputs.length;
    const progressPercentage = Math.round((filledInputs / totalInputs) * 100);
    
    // Update the progress bar
    progressFill.style.width = `${progressPercentage}%`;
    progressPercent.textContent = `${progressPercentage}%`;
    
    // Add animation based on completion percentage
    if (progressPercentage === 100) {
      gsap.to(progressFill, {
        backgroundColor: '#42E695',
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Pulse animation when 100% complete
      gsap.to(progressFill, {
        opacity: 0.7,
        duration: 0.5,
        repeat: 2,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }
  
  // Handle input focus event
  function handleInputFocus(e) {
    const formGroup = e.target.closest('.form-group');
    const highlight = formGroup.querySelector('.input-highlight');
    
    // Animate the highlight
    gsap.to(highlight, {
      width: '100%',
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // Add active class to parent
    formGroup.classList.add('active');
  }
  
  // Handle input blur event
  function handleInputBlur(e) {
    const formGroup = e.target.closest('.form-group');
    const highlight = formGroup.querySelector('.input-highlight');
    
    // If input is empty, shrink the highlight
    if (!e.target.value) {
      gsap.to(highlight, {
        width: '0%',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Remove active class
    formGroup.classList.remove('active');
  }
  
  // Handle heart form submission (form data)
  let formData = {}; // Global variable to store form data for report generation
  let riskScore = 0; // Global variable to store risk score
  
  function handleHeartFormSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const form = document.getElementById('heartForm');
    const formElements = form.elements;
    
    // Create object for API request
    formData = {};
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element.name && element.value) {
        formData[element.name] = element.value;
      }
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.opacity = '0.5';
    btnLoader.classList.remove('hidden');
    
    // Make API request
    fetch('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      // Store risk score
      riskScore = data.prediction;
      
      // Reset button state and show result
      setTimeout(() => {
        btnText.style.opacity = '1';
        btnLoader.classList.add('hidden');
        
        showResultWithAnimation(data.prediction);
      }, 800);
    })
    .catch(error => {
      console.error('Error:', error);
      
      // Reset button state
      btnText.style.opacity = '1';
      btnLoader.classList.add('hidden');
      
      alert('An error occurred while calculating risk. Please try again.');
    });
  }
  
  // Show the result with animations
  function showResultWithAnimation(risk) {
    const heartForm = document.getElementById('heartForm');
    const resultSection = document.getElementById('heartResult');
    const gaugeFill = document.getElementById('gaugeFill');
    const heartPrediction = document.getElementById('heartPrediction');
    
    // Hide form
    gsap.to(heartForm, {
      opacity: 0,
      height: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        heartForm.style.display = 'none';
        
        // Show result section
        resultSection.classList.remove('hidden');
        
        // Animate gauge fill
        gsap.to(gaugeFill, {
          height: `${risk}%`,
          duration: 1.5,
          ease: 'power2.out'
        });
        
        // Animate prediction number count
        gsap.to(heartPrediction, {
          innerHTML: Math.round(risk),
          duration: 1.5,
          snap: { innerHTML: 1 }
        });
        
        // Set risk level
        updateRiskLevel(risk);
      }
    });
  }
  
  // Update risk level text and classes
  function updateRiskLevel(risk) {
    const riskLevelElement = document.getElementById('riskLevel');
    const riskMessageElement = document.getElementById('riskMessage');
    const gaugeElement = document.querySelector('.gauge');
    
    let riskLevel, riskMessage, riskClass;
    
    // Determine risk level
    if (risk < 20) {
      riskLevel = 'Low Risk';
      riskMessage = 'Your heart disease risk appears to be low. Continue maintaining healthy habits!';
      riskClass = 'low-risk';
    } else if (risk < 50) {
      riskLevel = 'Medium Risk';
      riskMessage = 'Your heart disease risk is moderate. Consider lifestyle changes to improve heart health.';
      riskClass = 'medium-risk';
    } else {
      riskLevel = 'High Risk';
      riskMessage = 'Your heart disease risk is high. Please consult with a healthcare provider soon.';
      riskClass = 'high-risk';
    }
    
    // Update text
    riskLevelElement.textContent = riskLevel;
    riskMessageElement.textContent = riskMessage;
    
    // Update gauge color
    gaugeElement.className = 'gauge ' + riskClass;
  }
  
  // Report generation functionality removed as requested
  
  // Reset the form and show it again after viewing results
  function resetForm() {
    const heartForm = document.getElementById('heartForm');
    const resultSection = document.getElementById('heartResult');
    
    // Reset the gauge fill
    const gaugeFill = document.getElementById('gaugeFill');
    gaugeFill.style.height = '0%';
    
    // Hide result section with animation
    gsap.to(resultSection, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        resultSection.classList.add('hidden');
        
        // Reset the actual form
        heartForm.reset();
        
        // Reset progress bar
        if (document.getElementById('progressFill')) {
          document.getElementById('progressFill').style.width = '0%';
        }
        if (document.getElementById('progressPercent')) {
          document.getElementById('progressPercent').textContent = '0%';
        }
        
        // Show form again
        heartForm.style.display = 'block';
        gsap.to(heartForm, {
          opacity: 1,
          height: 'auto',
          duration: 0.5,
          ease: 'power2.out'
        });
        
        // Animate form fields
        gsap.from('.form-group', {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.2
        });
      }
    });
  }