# Purpose animations

별도 설치나 빌드 없이 HTML 파일을 열어 확인할 수 있습니다.

```text
purpose-01.html             첫 번째 완성 작업
purpose-02.html             두 번째 완성 작업
purpose-03.html             세 번째 완성 작업
shared/
  renderer.js              WebGL, 자동 재생, 크기 변경, 오류·자원 처리
  shader.js                반대 방향의 웜그레이 그라데이션, 인쇄 질감, 디더링
  style.css                독립 실행 페이지의 스타일
works/
  purpose-01.js            첫 번째 도형과 움직임
  purpose-02.js            두 번째 타원의 회전과 형태 변화
  purpose-03.js            세 번째 원·링의 교차와 크기 변화
```

## 홈페이지 삽입

HTML 3개와 `shared`, `works` 폴더를 같은 위치에 업로드합니다. README는 업로드하지 않아도 됩니다.
예를 들어 `/animations/`에 업로드했다면 홈페이지 섹션에 다음을 넣습니다.

```html
<iframe
  src="/animations/purpose-01.html"
  title="Purpose 01 애니메이션"
  loading="lazy"
  style="display:block;width:100%;aspect-ratio:4/3;border:0;background:#fff"
></iframe>
```

다른 섹션은 파일명과 제목을 `purpose-02.html` / `Purpose 02`, `purpose-03.html` / `Purpose 03`으로 바꿉니다.
첫 화면에 바로 보이는 섹션은 `loading="lazy"`를 생략해도 됩니다.
파일명이 변경되었으므로 기존 `index.html` 삽입 주소는 `purpose-01.html`로 수정합니다.
홈페이지에 HTML 전체나 `shared/style.css`를 직접 붙이지 않고 iframe으로 격리합니다.

## 수정 위치

- 각 작업의 도형·배치·움직임은 해당 `works/purpose-XX.js` 하나에서 수정합니다.
- 오브젝트는 기존 크기보다 15% 크게 표시합니다.
- 공통 질감은 `shared/shader.js`에서 수정하면 모든 완성 작업에 적용됩니다.
- 배경은 밝은 종이색에서 짙은 웜그레이로, 오브젝트는 반대 방향으로 밝아집니다. 미세 입자와 종이 질감은 시간에 따라 변하지 않습니다.
- 오브젝트의 기본 팔레트는 흰색(1단계)부터 검정(10단계) 중 4~10단계입니다. 윤곽선은 배경과 부드럽게 혼합해 계단 현상을 줄입니다.
- 작업은 `size`(기준 크기), `scene`(GLSL 도형), `frame(time)`(밀리초 기준 움직임)을 전달합니다.
- `frame`의 반환 값은 float(숫자), bool(참/거짓), vec4(숫자 4개 배열)이며 `scene`의 uniform 이름과 일치해야 합니다.
- 01은 2.8초 회전, 02는 영상의 정지·회전·복귀를 재현한 5초 타원 애니메이션, 03은 1.83초 원·링 교차 애니메이션입니다.

완성 작업은 클릭과 관계없이 자동으로 반복됩니다. 요청에 따라 동작 줄이기 설정에서도 재생됩니다.
화면 밖이나 비활성 탭에서는 렌더링을 쉬고 돌아오면 이어집니다. 해상도는 최대 2배·긴 변 1600px로 제한합니다.
WebGL 지원이 필요합니다. 실제 휴대폰의 성능은 별도로 측정하지 않았습니다.
