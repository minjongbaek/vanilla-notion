# Vanilla Notion

Vanilla JS로 노션의 일부 기능을 구현한 미니 프로젝트입니다.

## 구현 내용

- 문서 생성, 수정, 삭제
- 하위 문서 생성, 수정, 삭제
  - 하위 문서 목록을 dropdown 형태로 렌더링
  - 하위 문서의 열림 상태를 localStorage에 저장
  - 현재 보고있는 문서에서 하위 문서로 이동 가능한 링크 렌더링
- 문서 편집 시 API 요청 횟수를 줄이기 위한 디바운싱 처리
  - 에디터에서 focusout 될 때는 작성한 내용 바로 저장
- 사이드바를 드래그하여 크기 조절
