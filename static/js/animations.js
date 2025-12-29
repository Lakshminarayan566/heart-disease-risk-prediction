// Animations for heart disease risk prediction app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations
    initializeAnimations();
    
    // Handle heart disease form submission
    const heartForm = document.getElementById('heartForm');
    if (heartForm) {
      heartForm.addEventListener('submit', handleHeartFormSubmit);
    }
  });
  
  function initializeAnimations() {
    // Animate form fields on load
    gsap.from('.form-group', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.5
    });
    
    // Animate floating of elements with hover-float class
    const floatingElements = document.querySelectorAll('.hover-float');
    floatingElements.forEach(element => {
      gsap.to(element, {
        y: -3, // Reduced movement from -5 to -3
        duration: 3, // Increased duration from 1.5 to 3
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2 // More varied delays
      });
    });
  }
  
  // Handle heart disease risk prediction form submission
  function handleHeartFormSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.opacity = '0.5';
    btnLoader.classList.remove('hidden');
    
    // Collect form data
    const formData = new FormData(e.target);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    // Send API request
    fetch('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObject)
    })
    .then(response => response.json())
    .then(data => {
      // Reset button state
      btnText.style.opacity = '1';
      btnLoader.classList.add('hidden');
      
      // Display results with animation
      showResultWithAnimation(data.prediction);
    })
    .catch(error => {
      console.error('Error:', error);
      
      // Reset button state
      btnText.style.opacity = '1';
      btnLoader.classList.add('hidden');
      
      // Show error message
      alert('An error occurred. Please try again.');
    });
  }
  
  // Display the heart disease risk prediction result with animation
  function showResultWithAnimation(risk) {
    const resultSection = document.getElementById('heartResult');
    const heartForm = document.getElementById('heartForm');
    const riskLevel = document.getElementById('riskLevel');
    const riskMessage = document.getElementById('riskMessage');
    const gaugeFill = document.getElementById('gaugeFill');
    const heartPrediction = document.getElementById('heartPrediction');
    
    // Update risk percentage with animation
    const riskPercentage = Math.round(risk);
    
    // Show result section
    resultSection.classList.remove('hidden');
    resultSection.classList.add('animate__fadeIn');
    
    // Hide form
    gsap.to(heartForm, {
      opacity: 0,
      height: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        heartForm.style.display = 'none';
        
        // Animate result appearance
        gsap.from('.result-header', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
        
        gsap.from('.result-visual', {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'back.out(1.7)'
        });
        
        // Animate the gauge fill
        gaugeFill.style.height = `${riskPercentage}%`;
        
        // Animate the risk percentage number
        gsap.to(heartPrediction, {
          innerHTML: riskPercentage,
          duration: 2,
          snap: { innerHTML: 1 }
        });
        
        // Update risk level and apply appropriate class
        updateRiskLevel(riskPercentage);
      }
    });
  }
  
  // Update risk level text and styling based on percentage
  function updateRiskLevel(risk) {
    const riskLevel = document.getElementById('riskLevel');
    const riskMessage = document.getElementById('riskMessage');
    const gaugeContainer = document.querySelector('.gauge-container');
    
    let level, message, className;
    
    // Determine risk level
    if (risk < 30) {
      level = 'Low Risk';
      message = 'Great job! Your heart disease risk is relatively low. Continue your healthy lifestyle.';
      className = 'low-risk';
    } else if (risk < 60) {
      level = 'Medium Risk';
      message = 'Your heart disease risk is moderate. Consider lifestyle changes to improve your heart health.';
      className = 'medium-risk';
    } else {
      level = 'High Risk';
      message = 'Your heart disease risk is high. Please consult with a healthcare professional.';
      className = 'high-risk';
    }
    
    // Update text content
    riskLevel.textContent = level;
    riskMessage.textContent = message;
    
    // Remove existing classes and add the appropriate one
    gaugeContainer.classList.remove('low-risk', 'medium-risk', 'high-risk');
    gaugeContainer.classList.add(className);
    
    // Animate the risk message
    gsap.from(riskMessage, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 1,
      ease: 'power2.out'
    });
  }