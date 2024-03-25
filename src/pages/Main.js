import React, {useState, useCallback} from "react";
import styled from "styled-components";
import moment from "moment/moment";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import UploadBox from "../components/UploadBox";
import StageBox from "../components/StageBox";
import SubmitBox from "../components/SubmitBox";
import {ToastContainer, toast} from "react-toastify";
import {API} from "../config";

const Main = () => {
  const [contactInput, setContactInput] = useState("010");
  const [stagedFileList, setStagedFileList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [modifiedFileNameList, setModifiedFileNameList] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isAbort, setIsAbort] = useState(false);

  // 전체 상태를 초기화하는 함수
  const initializeState = () => {
    setProgressList(Array(stagedFileList.length).fill(0));
    setTotalProgress(0);
    setTotalSize(0);
  };

  // 발송 완료시 초기화 함수
  const onReset = () => {
    setIsAbort(false);
    setContactInput("010", "");
    toast.success("발송되었습니다.");
  };

  // 전화번호 입력값을 숫자만 받도록 하는 함수
  const onChangeInput = useCallback(
    (e) => {
      const regex = /^[0-9\b]{0,13}$/;
      if (regex.test(e.target.value)) {
        setContactInput(e.target.value);
      }
    },
    [contactInput]
  );

  // 전송 버튼 클릭시 실행되는 함수
  const onSubmit = () => {
    sendFormData();
  };

  // 파일 업로드 함수
  const sendFormData = async () => {
    let fileUploadedCount = 0;
    for (let i = 0; i < stagedFileList.length; i++) {
      const file = stagedFileList[i];
      const modifiedFileName = modifiedFileNameList[i];
      const formData = new FormData();

      formData.append("contact", contactInput);
      formData.append("date", moment().format("YYYY-MM-DD-ddd h:mm:ss a"));
      formData.append("file", file, `${modifiedFileName}.pdf`);

      const axiosConfig = {
        url: `${API.postFileList}`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        maxContentLength: 10000000,
        maxBodyLength: 10000000,
        onUploadProgress: (progressEvent) => {
          setTotalProgress((prev) => prev + progressEvent.bytes);
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgressList((prev) => {
            const newList = [...prev];
            newList[i] = percentCompleted;
            return newList;
          });
        },
      };
      try {
        await axios(axiosConfig);
        fileUploadedCount++;
      } catch (error) {
        if (error.code === "ERR_NETWORK") {
          toast.error("네트워크 연결을 확인해주세요.");
          return;
        } else if (error.code === "ERR_CONNECTION_REFUSED") {
          toast.error("서버에 연결할 수 없습니다.");
          return;
        }
      }
    }

    if (fileUploadedCount === stagedFileList.length) {
      setStagedFileList([]);
      onReset();
      initializeState();
    }
  };

  return (
    <MainWrap>
      <ToastContainer
        position="top-center"
        limit={2}
        closeButton={false}
        autoClose={800}
      />
      <UploadBox
        stagedFileList={stagedFileList}
        setStagedFileList={setStagedFileList}
        setProgressList={setProgressList}
        setTotalSize={setTotalSize}
      />
      {stagedFileList && (
        <StageBox
          stagedFileList={stagedFileList}
          setStagedFileList={setStagedFileList}
          progressList={progressList}
          totalProgress={totalProgress}
          totalSize={totalSize}
          setModifiedFileNameList={setModifiedFileNameList}
          setIsAllSelected={setIsAllSelected}
        />
      )}
      <SubmitBox
        contactInput={contactInput}
        onChangeInput={onChangeInput}
        onSubmit={onSubmit}
        stagedFileList={stagedFileList}
        setProgressList={setProgressList}
        setTotalProgress={setTotalProgress}
        setTotalSize={setTotalSize}
        isAllSelected={isAllSelected}
        isAbort={isAbort}
        setIsAbort={setIsAbort}
      />
    </MainWrap>
  );
};

const MainWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
  margin: 10px;
`;

export default Main;
