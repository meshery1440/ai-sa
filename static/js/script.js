// script.js: جلب وعرض بيانات الذكاء الاصطناعي ديناميكيًا
window.addEventListener('DOMContentLoaded', function() {
    // مثال: عرض البطاقات في قسم معين
    const container = document.getElementById('ai-cards-container');
    if (container && window.aiData) {
        container.innerHTML = '';
        window.aiData.categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'ai-card';
            card.innerHTML = `
                <div class="icon"><i class="fas ${cat.icon}"></i></div>
                <h3>${cat.name}</h3>
                <p>${cat.description}</p>
                <div class="details">${cat.details}</div>
                <div class="trends">${cat.trends.map(t=>`<span class='trend'>${t}</span>`).join(' ')}</div>
            `;
            container.appendChild(card);
        });
    }
});
