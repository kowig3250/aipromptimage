document.addEventListener('DOMContentLoaded', () => {
    const briefingText = document.getElementById('briefing-text');
    const welcomeMsg = document.getElementById('welcome-msg');
    const text = briefingText.innerText;
    briefingText.innerText = '';
    
    let i = 0;
    function typeEffect() {
        if (i < text.length) {
            briefingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeEffect, 50);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeEffect, 1000);

    // Update current date with premium formatting
    const dateEl = document.getElementById('current-date');
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
    dateEl.innerText = new Date().toLocaleDateString('ko-KR', options).toUpperCase();

    // Interaction for Nav items (Exclusive Nav)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // Premium response for navigation
            const areaName = item.querySelector('span:last-child').innerText;
            updateBriefing(`💎 '${areaName}' 영역으로 즉시 전환하겠습니다. 대표님을 위한 최상의 정보를 준비 중입니다. ✨`);
        });
    });

    // Command Input Handling
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const personaImg = document.getElementById('persona-img');

    function updateBriefing(newText, emotion = 'salute') {
        briefingText.textContent = '';
        briefingText.classList.remove('typing-text');
        void briefingText.offsetWidth; // Trigger reflow
        
        let j = 0;
        function typing() {
            if (j < newText.length) {
                briefingText.textContent += newText.charAt(j);
                j++;
                setTimeout(typing, 30);
            }
        }
        typing();
        
        // Switch Emotion
        if (emotion === 'wow') personaImg.src = 'assets/choi_assets/choi-wow.png';
        else if (emotion === 'idea') personaImg.src = 'assets/choi_assets/choi-idea.png';
        else if (emotion === 'coffee') personaImg.src = 'assets/choi_assets/choi-coffee.png';
        else if (emotion === 'surprise') personaImg.src = 'assets/choi_assets/choi-surprise.png';
        else personaImg.src = 'assets/choi_assets/choi-salute.png';

        // Add a soft glow flash on emotion change
        personaImg.style.filter = 'drop-shadow(0 0 50px var(--accent-gold))';
        setTimeout(() => {
            personaImg.style.filter = 'drop-shadow(0 0 30px var(--primary-glow))';
        }, 500);
    }

    sendBtn.addEventListener('click', () => {
        const cmd = userInput.value;
        if (!cmd) return;

        if (cmd.includes('커피')) {
            updateBriefing('☕ 대표님, 최상급 원두로 내린 향긋한 커피 한 잔 금방 준비해 올리겠습니다. 잠시만 여유를 즐겨주세요~ 💕', 'coffee');
        } else if (cmd.includes('고마워') || cmd.includes('최고')) {
            updateBriefing('💕 대표님의 칭찬 한 마디에 저 최실장, 보람과 행복을 느낍니다! 최고의 파트너가 되어드릴게요! ✨', 'wow');
        } else if (cmd.includes('아이디어') || cmd.includes('생각')) {
            updateBriefing('💡 와! 대표님, 정말 혁신적인 통찰이십니다. 이 아이디어가 사업화될 수 있도록 제가 상세 기획을 시작할까요?', 'idea');
        } else {
            updateBriefing(`📝 "${cmd}" 지시사항 즉시 접수했습니다. 대표님의 비전을 현실로 만들기 위해 시스템 리소스를 집중 배치하겠습니다. ✨`, 'salute');
        }

        userInput.value = '';
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    // Persona image click reaction
    personaImg.addEventListener('click', () => {
        updateBriefing('💎 대표님, 무엇을 도와드릴까요? 저 최실장과 김양 실장이 24시간 대표님을 지원합니다. ✨', 'wow');
    });
});
