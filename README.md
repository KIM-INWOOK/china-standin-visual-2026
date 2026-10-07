# 중국 대행 경제 비주얼뉴스

최종 승인본: 2026-10-07. 기사 내용과 인용을 유지한 스크롤 스토리.

## 파일
- index.html: 기사와 장면 구성
- style.css: PC / 모바일 레이아웃, 무료 MaruBuri 폰트, 인터랙션
- story.js: 스크롤 장면 제어와 의견 입력
- assets/: 전체 이미지·폰트·라이선스
- worker/index.js, db/, drizzle/: 공개 의견 저장 API와 데이터베이스 마이그레이션
- article-embed.txt: 현재 배포본을 가리키는 한 줄 iframe. 실제 CMS 삽입 확인 필요.

## GitHub Pages
저장소의 Settings > Pages > Source를 GitHub Actions로 선택합니다. main 푸시 시 정적 파일이 배포됩니다.

## 공개 의견 기능
GitHub Pages는 정적 호스팅이므로 /api/opinions를 직접 실행할 수 없습니다. 현재 공개 의견은 Sites의 D1 서버에 저장됩니다. GitHub Pages에서 같은 기능을 쓰려면 외부 의견 서버와 API 주소·CORS·접근 설정을 연결해야 합니다. 정적 배포만으로 공개 의견이 동작한다고 간주하지 마세요.

## 출처와 재연
SCMP 2026-10-04 보도 / 아시아경제 허미담 기자 2026-10-06 기사. 인물 독백은 가상 재연이며 이미지는 AI 연출입니다. 직접 인용은 원문을 유지합니다.
