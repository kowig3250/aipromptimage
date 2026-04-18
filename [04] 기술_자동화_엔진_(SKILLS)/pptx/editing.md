# 프레젠테이션 편집

## 템플릿 기반 워크플로우

기존 프레젠테이션을 템플릿으로 사용할 때:

1. **기존 슬라이드 분석**:
   ```bash
   python scripts/thumbnail.py template.pptx
   python -m markitdown template.pptx
   ```
   `thumbnails.jpg`로 레이아웃을 확인하고, markitdown 출력으로 플레이스홀더 텍스트를 확인한다.

2. **슬라이드 매핑 계획**: 각 콘텐츠 섹션에 적합한 템플릿 슬라이드를 선택한다.

   ⚠️ **다양한 레이아웃을 사용할 것** — 단조로운 프레젠테이션은 흔한 실패 사례다. 기본 제목 + 불릿 슬라이드에 안주하지 말고 다음을 적극 활용한다:
   - 다단 레이아웃 (2단, 3단)
   - 이미지 + 텍스트 조합
   - 전면 이미지 + 텍스트 오버레이
   - 인용구 또는 콜아웃 슬라이드
   - 섹션 구분자
   - 통계/숫자 강조
   - 아이콘 그리드 또는 아이콘 + 텍스트 행

   **피할 것:** 모든 슬라이드에 동일한 텍스트 중심 레이아웃 반복.

   콘텐츠 유형에 맞는 레이아웃을 선택한다 (예: 핵심 포인트 → 불릿 슬라이드, 팀 정보 → 다단, 후기 → 인용구 슬라이드).

3. **압축 해제**: `python scripts/office/unpack.py template.pptx unpacked/`

4. **프레젠테이션 구성** (서브에이전트가 아닌 직접 수행):
   - 불필요한 슬라이드 삭제 (`<p:sldIdLst>`에서 제거)
   - 재사용할 슬라이드 복제 (`add_slide.py`)
   - `<p:sldIdLst>`에서 슬라이드 순서 변경
   - **5단계 전에 모든 구조적 변경을 완료할 것**

5. **콘텐츠 편집**: 각 `slide{N}.xml`의 텍스트를 수정한다.
   **서브에이전트를 사용할 수 있다면 여기서 활용** — 슬라이드는 별도의 XML 파일이므로 서브에이전트가 병렬로 편집할 수 있다.

6. **정리**: `python scripts/clean.py unpacked/`

7. **압축**: `python scripts/office/pack.py unpacked/ output.pptx --original template.pptx`

---

## 스크립트

| 스크립트 | 용도 |
|--------|---------|
| `unpack.py` | PPTX 추출 및 XML 정렬 |
| `add_slide.py` | 슬라이드 복제 또는 레이아웃으로부터 생성 |
| `clean.py` | 고아 파일 제거 |
| `pack.py` | 유효성 검사 후 재압축 |
| `thumbnail.py` | 슬라이드 시각적 그리드 생성 |

### unpack.py

```bash
python scripts/office/unpack.py input.pptx unpacked/
```

PPTX를 추출하고, XML을 보기 좋게 정렬하며, 스마트 따옴표를 이스케이프 처리한다.

### add_slide.py

```bash
python scripts/add_slide.py unpacked/ slide2.xml      # 슬라이드 복제
python scripts/add_slide.py unpacked/ slideLayout2.xml # 레이아웃으로부터 생성
```

원하는 위치의 `<p:sldIdLst>`에 추가할 `<p:sldId>`를 출력한다.

### clean.py

```bash
python scripts/clean.py unpacked/
```

`<p:sldIdLst>`에 없는 슬라이드, 참조되지 않는 미디어, 고아 관계 파일을 제거한다.

### pack.py

```bash
python scripts/office/pack.py unpacked/ output.pptx --original input.pptx
```

유효성 검사, 복구, XML 압축, 스마트 따옴표 재인코딩을 수행한다.

### thumbnail.py

```bash
python scripts/thumbnail.py input.pptx [output_prefix] [--cols N]
```

슬라이드 파일명을 레이블로 표시한 `thumbnails.jpg`를 생성한다. 기본 3열, 그리드당 최대 12장.

**템플릿 분석(레이아웃 선택)에만 사용할 것.** 시각적 QA에는 `soffice` + `pdftoppm`으로 고해상도 슬라이드 이미지를 생성한다 — SKILL.md 참고.

---

## 슬라이드 조작

슬라이드 순서는 `ppt/presentation.xml` → `<p:sldIdLst>`에서 관리한다.

**순서 변경**: `<p:sldId>` 요소를 재배열한다.

**삭제**: `<p:sldId>`를 제거한 후 `clean.py`를 실행한다.

**추가**: `add_slide.py`를 사용한다. 슬라이드 파일을 직접 복사하지 말 것 — 스크립트가 노트 참조, Content_Types.xml, 관계 ID를 자동으로 처리한다.

---

## 콘텐츠 편집

**서브에이전트:** 사용 가능하다면 여기서 활용한다 (4단계 완료 후). 각 슬라이드는 별도의 XML 파일이므로 병렬 편집이 가능하다. 서브에이전트 프롬프트에 다음을 포함한다:
- 편집할 슬라이드 파일 경로
- **"모든 변경에 Edit 툴을 사용할 것"**
- 아래의 포맷 규칙 및 주의사항

각 슬라이드별 작업:
1. 슬라이드 XML 읽기
2. 모든 플레이스홀더 콘텐츠 식별 — 텍스트, 이미지, 차트, 아이콘, 캡션
3. 각 플레이스홀더를 최종 콘텐츠로 교체

**sed나 Python 스크립트가 아닌 Edit 툴을 사용할 것.** Edit 툴은 무엇을 어디서 교체할지 명확히 지정하게 하여 신뢰성이 높다.

### 포맷 규칙

- **모든 헤더, 소제목, 인라인 레이블은 볼드 처리**: `<a:rPr>`에 `b="1"` 적용. 포함 대상:
  - 슬라이드 제목
  - 슬라이드 내 섹션 헤더
  - 줄 앞의 인라인 레이블 (예: "상태:", "설명:")
- **유니코드 불릿(•) 사용 금지**: `<a:buChar>` 또는 `<a:buAutoNum>`으로 올바른 목록 포맷 사용
- **불릿 일관성**: 레이아웃에서 상속받는다. `<a:buChar>` 또는 `<a:buNone>`만 지정한다.

---

## 주요 주의사항

### 템플릿 적용

소스 콘텐츠의 항목이 템플릿보다 적을 때:
- **초과 요소를 완전히 제거** (이미지, 도형, 텍스트 박스) — 텍스트만 지우지 말 것
- 텍스트 삭제 후 남은 시각 요소 확인
- 시각적 QA로 수량 불일치 검토

텍스트를 다른 길이의 콘텐츠로 교체할 때:
- **짧은 교체**: 대개 안전
- **긴 교체**: 넘치거나 줄 바꿈이 발생할 수 있음
- 텍스트 변경 후 시각적 QA로 확인
- 템플릿 디자인 제약에 맞게 콘텐츠를 줄이거나 분할할 것

**템플릿 슬롯 ≠ 소스 항목 수**: 템플릿에 팀원이 4명인데 소스에 3명이라면, 4번째 팀원의 전체 그룹(이미지 + 텍스트 박스)을 삭제한다 — 텍스트만 지우지 말 것.

### 다중 항목 콘텐츠

소스에 여러 항목(번호 목록, 여러 섹션)이 있으면 각각 별도의 `<a:p>` 요소로 만든다 — **하나의 문자열로 합치지 말 것**.

**❌ 잘못된 예** — 모든 항목을 하나의 단락에:
```xml
<a:p>
  <a:r><a:rPr .../><a:t>1단계: 첫 번째 작업. 2단계: 두 번째 작업.</a:t></a:r>
</a:p>
```

**✅ 올바른 예** — 볼드 헤더와 함께 별도 단락으로:
```xml
<a:p>
  <a:pPr algn="l"><a:lnSpc><a:spcPts val="3919"/></a:lnSpc></a:pPr>
  <a:r><a:rPr lang="ko-KR" sz="2799" b="1" .../><a:t>1단계</a:t></a:r>
</a:p>
<a:p>
  <a:pPr algn="l"><a:lnSpc><a:spcPts val="3919"/></a:lnSpc></a:pPr>
  <a:r><a:rPr lang="ko-KR" sz="2799" .../><a:t>첫 번째 작업.</a:t></a:r>
</a:p>
<a:p>
  <a:pPr algn="l"><a:lnSpc><a:spcPts val="3919"/></a:lnSpc></a:pPr>
  <a:r><a:rPr lang="ko-KR" sz="2799" b="1" .../><a:t>2단계</a:t></a:r>
</a:p>
<!-- 패턴 계속 -->
```

줄 간격 유지를 위해 원본 단락의 `<a:pPr>`을 복사한다. 헤더에는 `b="1"`을 사용한다.

### 스마트 따옴표

unpack/pack이 자동으로 처리한다. 단, Edit 툴은 스마트 따옴표를 ASCII로 변환한다.

**따옴표가 포함된 새 텍스트를 추가할 때는 XML 엔티티를 사용한다:**

```xml
<a:t>&#x201C;계약&#x201D;의 내용</a:t>
```

| 문자 | 이름 | 유니코드 | XML 엔티티 |
|-----------|------|---------|------------|
| `"` | 왼쪽 큰따옴표 | U+201C | `&#x201C;` |
| `"` | 오른쪽 큰따옴표 | U+201D | `&#x201D;` |
| `'` | 왼쪽 작은따옴표 | U+2018 | `&#x2018;` |
| `'` | 오른쪽 작은따옴표 | U+2019 | `&#x2019;` |

### 기타

- **공백**: 앞뒤 공백이 있는 `<a:t>`에는 `xml:space="preserve"` 사용
- **XML 파싱**: `xml.etree.ElementTree` 대신 `defusedxml.minidom` 사용 (네임스페이스 손상 방지)
