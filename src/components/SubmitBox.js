import React from "react";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import contact from "../assets/images/contact.png";

const SubmitBox = ({
  contactInput,
  onChangeInput,
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
    e.target.name === "submit" ? setIsAbort(true) : setIsAbort(false);
  };

  //추가 구현 필요: 업로드 버튼 활성화 조건. 현재 isAllSelected가 단일 변수이기 때문에 리스트로 관리하도록 변경해야 제대로 작동함.
  const onCheck =
    (stagedFileList && stagedFileList.length) !== 0 &&
    contactInput.length === 11 &&
    isAllSelected;

  return (
    <SubmitWrap>
      <Contact>
        <ContactIcon src={contact} alt="contact icon" />
        <ContactTitle>전화번호</ContactTitle>
        <ContactInput
          type="text"
          value={contactInput}
          onChange={onChangeInput}
          maxLength="11"
        ></ContactInput>
        <ContactSample>하이폰(-)을 빼고 입력해주세요.</ContactSample>
      </Contact>
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
  ${({theme}) => theme.mixin.flex("flex", "space-between", "center")};
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

const Contact = styled.div`
  ${({theme}) => theme.mixin.flex("flex", "space-flex-start", "center")};
  width: 100%;
  position: relative;
  @media (max-width: 650px) {
    margin-bottom: 10px;
    width: 100%;
    padding: 0px 0px 10px 0px;
    border-bottom: 1px solid #dcdcdc;
  }
`;
const ContactIcon = styled.img`
  padding: 0px 10px 5px 15px;
  width: 40px;
  @media (max-width: 650px) {
    width: 20px;
  }
`;
const ContactTitle = styled.div`
  margin-left: 11px;
  font-weight: 700;
  font-size: 17px;
  line-height: 10px;
  @media (max-width: 650px) {
    font-size: 14px;
  }
`;

const ContactSample = styled.div`
  font-size: 14px;
  @media (max-width: 500px) {
    position: absolute;
    right: 1%;
    bottom: 55%;
    font-size: 10px;
  }
`;

const ContactInput = styled.input`
  height: 30px;
  width: 140px;
  margin: 0px 10px;
  padding: 0px 20px;
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  text-align: center;
  font-size: 17px;
  font-weight: 550;
  text-align: left;

  cursor: pointer;
  :focus {
    outline: none;
  }
  @media (max-width: 400px) {
    font-size: 14px;
    width: 90px;
    height: 26px;
    padding: 0px 9px;
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
