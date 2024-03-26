import React from 'react';
import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

const SubmitBox = ({
  contactInput,
  onSubmit,
  stagedFileList,
  isAllSelected,
  isAbort,
  setIsAbort,
}) => {
  //미구현: 파일 업로드 취소 시 중단 기능
  const onAbort = () => {};

  //업로드 버튼 클릭시 텍스트를 바꿔주는 함수. 업로드 버튼을 누르면 취소 버튼으로 바뀌고, 취소 버튼을 누르면 업로드 버튼으로 바뀐다. 업로드 실패 시 처리 추가 구현해야 함.
  const handleBtnChange = (e) => {
    e.target.name === 'submit' ? setIsAbort(true) : setIsAbort(false);
  };

  //추가 구현 필요: 업로드 버튼 활성화 조건. 현재 isAllSelected가 단일 변수이기 때문에 리스트로 관리하도록 변경해야 제대로 작동함.
  const onCheck =
    (stagedFileList && stagedFileList.length) !== 0 && isAllSelected;

  return (
    <SubmitWrap>
      {!isAbort ? (
        <SubmitButton
          name="submit"
          disabled={!onCheck}
          onClick={(e) => {
            handleBtnChange(e);
            onSubmit();
          }}
        >
          업로드
        </SubmitButton>
      ) : (
        <AbortButton
          name="abort"
          disabled={!onCheck}
          onClick={(e) => {
            handleBtnChange(e);
            onAbort();
          }}
        >
          취소
        </AbortButton>
      )}
    </SubmitWrap>
  );
};

//하단 (연락처입력, 업로드버튼)
const SubmitWrap = styled.div`
  ${({ theme }) => theme.mixin.flex('flex', 'flex-end', 'center')};
  width: 100%;
  max-width: 700px;
  min-width: 300px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c4c4c4;
  @media (max-width: 650px) {
    display: grid;
    justify-content: stretch;
  }
`;

const SubmitButton = styled.button`
  width: 109px;
  height: 34px;
  margin: 0px 10px;
  border-radius: 6px;
  background: #006064;
  color: #ffffff;
  font-weight: 550;
  font-size: 17px;
  border-style: none;
  cursor: pointer;
  :disabled {
    background-color: #dcdcdc;
  }
  @media (max-width: 650px) {
    width: 220px;
    height: 28px;
    font-size: 13px;
    margin: auto;
  }
`;

const AbortButton = styled.button`
  width: 109px;
  height: 34px;
  margin: 0px 10px;
  border-radius: 6px;
  background: #006064;
  color: #ffffff;
  font-weight: 550;
  font-size: 17px;
  border-style: none;
  cursor: pointer;
  :disabled {
    background-color: #dcdcdc;
  }
  @media (max-width: 650px) {
    width: 220px;
    height: 28px;
    font-size: 13px;
    margin: auto;
  }
`;

export default SubmitBox;
