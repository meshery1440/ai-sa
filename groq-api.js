// Groq API Integration

class GroqAPI {
    constructor(apiKey) {
        // إعادة المفتاح الافتراضي ليُستخدم تلقائياً عند غياب قيمة مُمرَّرة
        this.apiKey = apiKey || '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';
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'llama3-70b-8192'; // Default model
    }

    // Set API Key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        // Save API key to localStorage for persistence
        localStorage.setItem('groqApiKey', apiKey);
        return this;
    }

    // Get API Key from localStorage
    getApiKey() {
        // إرجاع المفتاح المُخزَّن أو المفتاح الافتراضي
        return this.apiKey || localStorage.getItem('groqApiKey') || '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';
    }

    // Check if API Key is set
    hasApiKey() {
        return !!this.getApiKey();
    }

    // Set model
    setModel(model) {
        this.model = model;
        return this;
    }

    // Send message to Groq API
    async sendMessage(message, conversationHistory = []) {
        if (!this.hasApiKey()) {
            throw new Error('API Key is not set');
        }

        // Prepare messages array for API
        const messages = [
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getApiKey()}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Error communicating with Groq API');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Groq API Error:', error);
            throw error;
        }
    }
}

// Export the GroqAPI class
window.GroqAPI = GroqAPI;