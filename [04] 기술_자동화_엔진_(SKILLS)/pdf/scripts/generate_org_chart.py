import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors

# 폰트 등록 (한글 지원을 위해 맑은 고딕 사용)
FONT_PATH = "C:/Windows/Fonts/malgun.ttf"
pdfmetrics.registerFont(TTFont('MalgunGothic', FONT_PATH))

def create_org_chart_v1_2():
    dest_path = r"d:\agent\홍프로 프로젝트\[02] 비밀_금고_(DELIVERABLES)\홍프로_공식_조직도_v1.2.pdf"
    
    # 폴더가 없으면 생성
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    c = canvas.Canvas(dest_path, pagesize=A4)
    width, height = A4

    # 제목
    c.setFont('MalgunGothic', 26)
    c.drawCentredString(width / 2, height - 70, "홍프로 프로젝트 정예 조직도")
    c.setFont('MalgunGothic', 10)
    c.drawCentredString(width / 2, height - 90, "v1.2 (2026-04-19) - 보좌진 전공 기술 및 서열 2위(EO) 체계 강화")
    
    c.setStrokeColor(colors.gold)
    c.line(50, height - 110, width - 50, height - 110)

    # 조직도 데이터 (성함/닉네임, 직함, 핵심 직무, 전용 기술)
    data = [
        ("대표님 (CEO)", "사용자", "프로젝트 소유자 및 최종 의사결정", "Decision Making, Strategic Vision"),
        ("최실장 (General Manager)", "실무 총괄 실장", "보좌진 조율, 일정 관리, 대표님 밀착 보필", "Project Orchestration, Schedule Mgmt"),
        ("코다리 부장 (Executive Officer)", "감찰 총괄 / 서열 2위", "전 직원 근태 감독, 시장 조사, 데이터 가공", "Personnel Audit, Market Research, Python"),
        ("제니 (Marketing Lead)", "마케팅 실장", "브랜드 수립, SNS 콘텐츠, 마케팅 퍼널 설계", "Figma, Branding, Copywriting"),
        ("김양 실장 (Design Lead)", "디자인 실장", "UI/UX 디자인, Stitch 프로토타이핑, 비주얼 시스템", "UI/UX Design, Stitch MCP, Prototyping"),
        ("만득이 (Junior Maknae)", "회사의 막내 (Trainee)", "기술 개발 보조, 디버깅, 선배 보좌진 전원 감독", "Claude API, Coding Assist, Web Testing")
    ]

    y_pos = height - 160
    
    for i, (name, title, role, skills) in enumerate(data):
        # 상자 그리기
        box_height = 80
        box_width = 480
        x_start = (width - box_width) / 2
        
        # 색상 지정
        if i == 0:
            c.setFillColor(colors.lightgoldenrodyellow) # Gold for CEO
        elif i == 2:
            c.setFillColor(colors.lavender) # Special Lavender for Rank 2 (EO)
        elif i == 1:
            c.setFillColor(colors.aliceblue) # Light Blue for GM
        elif i == 5:
            c.setFillColor(colors.whitesmoke) # Grey for Maknae
        else:
            c.setFillColor(colors.white)
            
        c.rect(x_start, y_pos - box_height, box_width, box_height, fill=1)
        c.setFillColor(colors.black)
        
        # 텍스트 배치
        # 1. 성함/직함
        c.setFont('MalgunGothic', 15)
        c.drawString(x_start + 20, y_pos - 25, f"{name} | {title}")
        
        # 2. 핵심 직무 (Bold 느낌을 위해 폰트 크기 조절)
        c.setFont('MalgunGothic', 10)
        c.setFillColor(colors.darkslategray)
        c.drawString(x_start + 20, y_pos - 45, f"▶ 직무: {role}")
        
        # 3. 전용 기술 (Italic 느낌은 지원 안되므로 색상으로 구분)
        c.setFont('MalgunGothic', 9)
        c.setFillColor(colors.grey)
        c.drawString(x_start + 20, y_pos - 65, f"◈ 전용 기술: {skills}")
        
        c.setFillColor(colors.black)
        
        # 연결선
        if i < len(data) - 1:
            c.setStrokeColor(colors.lightgrey)
            c.line(width / 2, y_pos - box_height, width / 2, y_pos - box_height - 10)
            c.setStrokeColor(colors.black)
        
        y_pos -= (box_height + 10)

    # 하단 멘트 및 팁
    c.setFont('MalgunGothic', 9)
    c.setStrokeColor(colors.grey)
    c.drawCentredString(width / 2, 70, "💡 AI 쾌속 호출 단축키: c(최실장), j(제니), k(코다리), m(만득이), y(김양), a(전원)")
    c.setFont('MalgunGothic', 8)
    c.drawCentredString(width / 2, 55, "※ 본 문서는 홍프로 프로젝트의 핵심 인력 정보이며, 대표님의 승인 없이 수정이 불가합니다.")
    c.drawCentredString(width / 2, 40, "ⓒ 2026 HongPro Project. All Staff Supervise Mandueki.")
    
    c.save()
    print(f"Success: Updated PDF created at {dest_path}")

if __name__ == "__main__":
    create_org_chart_v1_2()
