// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const resetApiKeyBtn = document.getElementById('reset-api-key');
const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.querySelector('.status-text');

// Loading Screen
window.addEventListener('load', () => {
    // Check API connection status
    updateConnectionStatus();
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);
    }, 2000);
});

// Reset API Key Button
resetApiKeyBtn.addEventListener('click', resetApiKey);

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
});

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Chat Functionality with Groq API Integration
let chatHistory = [];
let conversationHistory = [];

// Initialize Groq API
let groqApi = new GroqAPI();
let isApiKeySet = false;

// Function to check if API key is set and update connection status
function checkApiKey() {
    isApiKeySet = groqApi.hasApiKey();
    updateConnectionStatus();
    // تمت إزالة showApiKeyPrompt لعدم الحاجة إليها الآن
    return isApiKeySet;
}

// Function to update connection status indicator
function updateConnectionStatus() {
    if (isApiKeySet) {
        statusIndicator.classList.remove('offline');
        statusText.textContent = 'متصل بـ Groq API';
    } else {
        statusIndicator.classList.add('offline');
        statusText.textContent = 'غير متصل بـ Groq API';
    }
}

// Function to reset API key
function resetApiKey() {
    // مسح المفتاح المُخزَّن فقط، وسيبقى المفتاح الافتراضي مفعّلاً
    localStorage.removeItem('groqApiKey');
    isApiKeySet = groqApi.hasApiKey();
    conversationHistory = [];
    updateConnectionStatus();
    // إزالة استدعاء showApiKeyPrompt
    // مسح الرسائل وإظهار إشعار
    while (chatMessages.firstChild) chatMessages.removeChild(chatMessages.firstChild);
    addMessage("تم إعادة تعيين مفتاح API إلى المفتاح الافتراضي.", false);
}

// Function to show API key input prompt
function showApiKeyPrompt() {
    const apiKeyPrompt = document.createElement('div');
    apiKeyPrompt.className = 'api-key-prompt';
    apiKeyPrompt.innerHTML = `
        <div class="api-key-container">
            <h3>إدخال مفتاح Groq API</h3>
            <p>يرجى إدخال مفتاح API الخاص بك للاتصال بخدمة Groq:</p>
            <input type="password" id="api-key-input" placeholder="أدخل مفتاح API هنا..." />
            <button id="save-api-key">حفظ</button>
        </div>
    `;
    
    document.body.appendChild(apiKeyPrompt);
    
    // Add event listener to save button
    document.getElementById('save-api-key').addEventListener('click', () => {
        const apiKey = document.getElementById('api-key-input').value.trim();
        if (apiKey) {
            groqApi.setApiKey(apiKey);
            apiKeyPrompt.remove();
            isApiKeySet = true;
            // Show welcome message after setting API key
            addMessage("تم تعيين مفتاح API بنجاح! أنا مساعدك الذكي المدعوم بواسطة Groq. كيف يمكنني مساعدتك اليوم؟", false);
        }
    });
}

// Function to get AI response using Groq API
async function getAIResponse(userMessage) {
    try {
        // نتأكد من أن المفتاح متاح
        if (!checkApiKey()) {
            return "يرجى إدخال مفتاح Groq API أولاً للتمكن من استخدام الدردشة الذكية.";
        }
        
        // Add user message to conversation history
        conversationHistory.push({ role: 'user', content: userMessage });
        
        // Get response from Groq API
        const response = await groqApi.sendMessage(userMessage, conversationHistory);
        
        // Add AI response to conversation history
        conversationHistory.push({ role: 'assistant', content: response });
        
        return response;
    } catch (error) {
        console.error('Error getting AI response:', error);
        return "عذراً، حدث خطأ أثناء الاتصال بـ Groq API. يرجى التحقق من مفتاح API الخاص بك والمحاولة مرة أخرى.";
    }
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = content;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to history
    chatHistory.push({
        content: content,
        isUser: isUser,
        timestamp: new Date()
    });
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Disable input while processing
        chatInput.disabled = true;
        sendButton.disabled = true;
        
        // Add user message to chat
        addMessage(message, true);
        chatInput.value = '';
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            // Get response from Groq API
            const aiResponse = await getAIResponse(message);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add AI response to chat
            addMessage(aiResponse, false);
        } catch (error) {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Show error message
            addMessage("عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.", false);
            console.error('Error in sendMessage:', error);
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }
}

// Send message on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Welcome message and API key check
setTimeout(() => {
    // Check if API key is set
    if (groqApi.hasApiKey()) {
        addMessage("مرحباً! أنا مساعدك الذكي المدعوم بواسطة Groq. كيف يمكنني مساعدتك اليوم؟", false);
    } else {
        addMessage("مرحباً! لاستخدام المحادثة الذكية، يرجى إدخال مفتاح Groq API الخاص بك.", false);
        setTimeout(() => {
            checkApiKey();
        }, 1000);
    }
}, 3000);

// Button Interactions
document.querySelectorAll('.primary-button, .secondary-button, .cta-button, .learn-more-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.feature-card, .report-card, .neural-content, .chat-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.2)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Neural network animation
function animateNeuralNetwork() {
    const neurons = document.querySelectorAll('.neuron');
    neurons.forEach((neuron, index) => {
        setTimeout(() => {
            neuron.style.transform = 'scale(1.5)';
            setTimeout(() => {
                neuron.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Trigger neural animation periodically
setInterval(animateNeuralNetwork, 3000);

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }, 2500);
});

// Theme toggle (if needed)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    document.querySelectorAll('.feature-card, .report-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);