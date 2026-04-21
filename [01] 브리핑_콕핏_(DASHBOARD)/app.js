// ============================================================
// 홍프로 프로젝트 대시보드 V3 - app.js (Dynamic Version)
// 작전 사령부 직원 호출 & 업무 현황 시스템
// ============================================================

// ── 데이터 상태 ──────────────────────────────────────────────
let CREW = {};
let currentCrew = 'choi';

// ── 퍼스널리티 기본값 (매니페스트에 없는 UI용 데이터) ─────────────
const PERSONALITY_DEFAULTS = {
    choi: {
        id: 'choi',
        crewColor: '#ff4d6d',
        greeting: '💕 대표님~ 저 최실장 왔습니다아~ 무엇이든 척척! 지시만 내려주세요! ✨',
        placeholder: '대표님, 지시를 내려주세요...',
        tasks: [
            { name: '대시보드 실구동 엔진 탑재', progress: 100, status: '완료' },
            { name: '매니페스트 동적 연동', progress: 100, status: '완료' },
            { name: '프로젝트 운영 체계 수립', progress: 80, status: '진행중' },
        ]
    },
    kodari: {
        id: 'kodari',
        crewColor: '#3b82f6',
        greeting: '충성! 🕵️‍♂️ 코다리 부장, 대표님의 명을 기다리고 있었습니다! 어떤 첩보를 입수해 올까요?',
        placeholder: '대표님, 어떤 정보가 필요하십니까?',
        tasks: [
            { name: '시장 트렌드 상시 모니터링', progress: 100, status: '완료' },
            { name: '기술 가공 자동화 시스템', progress: 40, status: '진행중' },
        ]
    },
    jenny: {
        id: 'jenny',
        crewColor: '#a855f7',
        greeting: '📈 제니가 왔어요, 대표님! 최실장님 지휘 아래 피그마로 마케팅 마법을 부려볼게요! 💖',
        placeholder: '제니에게 마케팅 지시를 내려주세요~',
        tasks: [
            { name: '브랜드 비주얼 가이드', progress: 60, status: '진행중' },
            { name: 'SNS 채널별 마케팅 전략', progress: 30, status: '진행중' },
        ]
    },
    yang: {
        id: 'yang',
        crewColor: '#fbbf24',
        greeting: '🎨 디자인 실장 김양이 나설 차례인가요? 대표님의 감성을 Stitch로 예쁘게 빚어드릴게요! 💖',
        placeholder: '김양 실장에게 디자인 지시를 내려주세요~',
        tasks: [
            { name: 'Stitch 기반 신규 스크린 설계', progress: 100, status: '완료' },
            { name: '대시보드 UI 고도화 지원', progress: 90, status: '진행중' },
        ]
    },
    man: {
        id: 'man',
        crewColor: '#22c55e',
        greeting: '충성! 대표님, 막내 만득이! 명을 받들겠습니다! 열심히 하겠습니다! 🐣🚀',
        placeholder: '만득이 막내에게 개발 지시를 내려주세요!',
        tasks: [
            { name: 'Vite 기반 로컬 서버 구축', progress: 100, status: '완료' },
            { name: '기술 자동화 엔진 고도화', progress: 40, status: '진행중' },
        ]
    }
};

// ── DOM 요소 ─────────────────────────────────────────────────
const personaImg       = document.getElementById('persona-img');
const activeCrewName   = document.getElementById('active-crew-name');
const activeCrewTitle  = document.getElementById('active-crew-title');
const activeCrewStatus = document.getElementById('active-crew-status');
const briefingText     = document.getElementById('briefing-text');
const taskPanelName    = document.getElementById('task-panel-name');
const taskList         = document.getElementById('task-list');
const userInput        = document.getElementById('user-input');
const sendBtn          = document.getElementById('send-btn');

// ── 1. 매니페스트 기반 엔진 초기화 ─────────────────────────────
async function initDashboard() {
    try {
        console.log('🚀 홍프로 작전 사령부 기동 중...');
        // 매니페스트 데이터 로드 (Vite 서버 루트 기준)
        const response = await fetch('./FAST_SUMMON_MANIFEST.json');
        const manifest = await response.json();
        
        // CREW 객체 생성
        const personas = manifest.personas;
        
        // 매니페스트 키(c, j, k, m, y)를 대시보드 키(choi, jenny, kodari, man, yang)로 맵핑
        const keyMap = {
            c: 'choi',
            j: 'jenny',
            k: 'kodari',
            m: 'man',
            y: 'yang'
        };

        Object.keys(personas).forEach(key => {
            const p = personas[key];
            const dashKey = keyMap[key];
            if (!dashKey) return;

            const defaults = PERSONALITY_DEFAULTS[dashKey];
            
            CREW[dashKey] = {
                name: p.nickname || p.name.split(' ')[0],
                title: p.role,
                status: 'ACTIVE',
                statusColor: 'var(--status-active)',
                crewColor: defaults.crewColor,
                img_base: `assets_v2/${p.image_folder}/`,
                img_prefix: p.prefix,
                // 이미지 맵 동적 생성
                images: Object.keys(p.states).reduce((map, state) => {
                    map[state] = `assets_v2/${p.image_folder}/${p.prefix}${p.states[state]}`;
                    return map;
                }, {}),
                greeting: defaults.greeting,
                placeholder: defaults.placeholder,
                tasks: defaults.tasks
            };
        });

        console.log('✅ 보좌진 지능형 데이터 로드 완료:', CREW);
        setupEventListeners();
        // 초기 로드 (최실장)
        refreshDashboard('choi');

    } catch (error) {
        console.error('❌ 대시보드 로드 실패:', error);
        briefingText.textContent = '⚠️ 시스템 리소스(매니페스트)를 불러오는 데 실패했습니다. 파일 경로를 확인해 주세요.';
    }
}

// ── 2. 대시보드 화면 갱신 ──────────────────────────────────────
function refreshDashboard(crewId) {
    const crew = CREW[crewId];
    if (!crew) return;

    // 사이드바 업데이트
    personaImg.src = crew.images.salute || crew.images.default || Object.values(crew.images)[0];
    activeCrewName.textContent = crew.name;
    activeCrewTitle.textContent = crew.title;
    activeCrewStatus.textContent = '● ' + crew.status;
    activeCrewStatus.style.color = crew.statusColor;

    // 브리핑 & 텍스트
    typeText(briefingText, crew.greeting);
    userInput.placeholder = crew.placeholder;

    // 색상 테마 적용
    applyTheme(crew.crewColor, crewId);
    
    // 업무 현황
    renderTasks(crewId);
}

// ── 유틸: 타이핑 효과 ────────────────────────────────────────
function typeText(el, text, speed = 25) {
    el.textContent = '';
    el.classList.add('typing-text');
    let i = 0;
    function tick() {
        if (i < text.length) {
            el.textContent += text.charAt(i++);
            setTimeout(tick, speed);
        }
    }
    setTimeout(tick, 200);
}

// ── 유틸: 업무 현황 렌더링 ───────────────────────────────────
function renderTasks(crewId) {
    const crew = CREW[crewId];
    taskPanelName.textContent = crew.name + ' 업무 현황';
    taskList.innerHTML = '';

    crew.tasks.forEach(task => {
        const statusClass = task.status === '완료'   ? 'status-done'
                          : task.status === '진행중'  ? 'status-wip'
                          : 'status-waiting';
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-top">
                <span class="task-name">${task.name}</span>
                <span class="task-status ${statusClass}">${task.status}</span>
            </div>
            <div class="task-bar-bg">
                <div class="task-bar-fill" style="width: 0%"></div>
            </div>
            <span class="task-pct">${task.progress}%</span>
        `;
        taskList.appendChild(li);
        requestAnimationFrame(() => {
            setTimeout(() => {
                li.querySelector('.task-bar-fill').style.width = task.progress + '%';
            }, 50);
        });
    });
}

// ── 유틸: 테마 색상 적용 ──────────────────────────────────────
function applyTheme(color, crewId) {
    document.querySelector('.response-area').style.borderLeftColor = color;
    activeCrewName.style.color = color;
    activeCrewName.style.textShadow = `0 0 10px ${color}66`;

    document.querySelectorAll('.crew-card-name').forEach(el => el.style.color = '');
    const activeCard = document.getElementById('card-' + crewId);
    if (activeCard) activeCard.querySelector('.crew-card-name').style.color = color;

    document.querySelectorAll('.call-btn').forEach(btn => {
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
    });
    const activeBtn = document.getElementById('btn-' + crewId);
    if (activeBtn) {
        activeBtn.style.background = color;
        activeBtn.style.color = '#000';
        activeBtn.style.borderColor = color;
    }
}

// ── 3. 직원 호출 (Public) ────────────────────────────────────
window.callCrew = function(crewId) {
    if (currentCrew === crewId) return;
    currentCrew = crewId;
    
    document.querySelectorAll('.crew-card').forEach(card => {
        card.classList.toggle('active', card.id === 'card-' + crewId);
    });

    personaImg.classList.add('swapping');
    setTimeout(() => {
        refreshDashboard(crewId);
        personaImg.classList.remove('swapping');
    }, 350);
};

// ── 4. 감정/상황 업데이트 ─────────────────────────────────────
function setEmotion(emotion) {
    const crew = CREW[currentCrew];
    const targetImg = crew.images[emotion] || Object.values(crew.images)[0];
    personaImg.src = targetImg;
}

// ── 5. 이벤트 설정 ────────────────────────────────────────────
function setupEventListeners() {
    sendBtn.onclick = () => {
        const cmd = userInput.value.trim();
        if (!cmd) return;
        handleCommand(cmd);
        userInput.value = '';
    };

    userInput.onkeypress = e => { if (e.key === 'Enter') sendBtn.onclick(); };

    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const navId = item.getAttribute('data-nav');

            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            const area = item.querySelector('span:last-child').innerText;
            typeText(briefingText, `💎 '${area}' 영역으로 즉시 전환하겠습니다. 대표님을 위한 정보를 준비 중입니다. ✨`);
        };
    });
}

// ── 6. 커맨드 핸들러 ──────────────────────────────────────────
function handleCommand(cmd) {
    const lower = cmd.toLowerCase();
    
    if (lower === 'c' || lower.includes('최실장')) { callCrew('choi'); return; }
    if (lower === 'k' || lower.includes('코다리')) { callCrew('kodari'); return; }
    if (lower === 'j' || lower.includes('제니')) { callCrew('jenny'); return; }
    if (lower === 'm' || lower.includes('만득')) { callCrew('man'); return; }
    if (lower === 'y' || lower.includes('김양')) { callCrew('yang'); return; }

    if (lower.includes('커피')) {
        setEmotion('coffee');
        typeText(briefingText, '☕ 대표님, 최상급 원두로 내린 향긋한 커피 한 잔 준비하겠습니다! 💕');
        return;
    }
    
    setEmotion('work');
    typeText(briefingText, `📝 "${cmd}" 지시사항 확인했습니다. 즉시 실행에 착수하겠습니다! ✨`);
}

// 실행!
document.addEventListener('DOMContentLoaded', () => {
    // 날짜 업데이트
    const dateEl = document.getElementById('current-date');
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
    dateEl.innerText = new Date().toLocaleDateString('ko-KR', options).toUpperCase();

    initDashboard();
});
