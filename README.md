# 수학 문제지 업로더 ‘매스업’

## 수학 문제지를 체계적으로 관리하자! **수학 문제지 업로더 ‘매스업’**

![](https://raw.githubusercontent.com/gmgmgun/github-user-content/main/math-up/main.png)

🚀 **프로젝트 소개**

- 수학 문제지를 DB화하여 관리하기 위해 구글 드라이브에 PDF 파일을 업로드 하는 어플리케이션입니다.

🙋 **역할**

- 전반적인 프론트엔드 기능 수행
- 부수적인 백엔드 코드 수정

⏳ **기간**

- 2023.03.13 ~ 2023.03.24 (총 12일)

🧰 **구현 기능 및 주요 코드**

## 파일 스테이징

![](https://raw.githubusercontent.com/gmgmgun/github-user-content/main/math-up/pdf-staging1-ezgif.com-video-to-gif-converter.gif)

1. 파일 시스템 또는 드래그 앤 드롭으로 파일을 스테이징하도록 구현
2. pdf 외 다른 유형의 파일이 선택된 경우 알림창을 띄우고 이를 제외하고 스테이징하도록 구현
3. 스테이징된 파일들을 파일 이름과 용량을 표시해서 보여주고, 파일 이름을 포매팅하기 위해 우측에 드롭박스를 구현

## 파일 업로드

![](https://raw.githubusercontent.com/gmgmgun/github-user-content/main/math-up/pdf-upload1-ezgif.com-video-to-gif-converter.gif)

1. 드롭박스 메뉴를 선택할 때 키보드 이벤트와 상호작용하도록 구현
2. 학교명 드롭박스의 경우 가짓수가 많아 자동완성 기능을 사용
3. 인풋의 내용을 채워야 업로드 버튼이 활성화되도록 구현
4. 업로드 시 각 파일마다의 프로그래스 바와 전체 프로그래스바가 연동되도록 구현
5. 업로드 시 파일에 대한 정보는 서버 DB로 보내고, 실제 파일은 드롭박스를 통해 포매팅한대로 연동된 구글 드라이브에 올라가도록 구현

🔥 **트러블 슈팅**

문제 배경

- 복수의 파일을 업로드하는 경우 각각의 진행률이 실시간으로 반영되지 않음

문제 원인

- 파일 개수에 상관 없이 한번의 Request 만 수행하도록 처리해 전체 진행률만 확인하고 있었음

해결 방법

- 파일 개수만큼 요청하도록 수정
- onUploadProgress 속성의 인자를 전체 진행률 상태와 개별 진행률 상태에 전달해 정상적으로 반영되도록 수정

더 생각할 점

- 클라이언트 단 → 서버 단 → 구글 드라이브의 순서로 업로드가 진행
- 클라이언트 단에서 표시되는 프로그래스 바는 요청할 때 발생하는 클라이언트 ↔ 서버의 통신의 결과
- 구글 드라이브 업로드는 고려하지 않음 → 실질적인 진행 상태와 간극이 존재
- 해결 방안 1. 클라이언트에서 바이패스로 구글 드라이브에 업로드 → 이 경우 구글 드라이브와 서버 간 데이터 불일치가 발생할 수 있음
- 해결 방안 2. 진행 상태를 서버에서 확인하고 클라이언트에 전달함 → 추가적인 네트워크 통신 필요 → 사용자 경험이 저하될 수 있음
- 실무에서 이와 같은 상황이 발생할 경우 어떠한 방안이 더 효과적인지, 더 좋은 방안이 있는지 테스트가 필요
