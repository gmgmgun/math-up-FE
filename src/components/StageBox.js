import React from "react";
import styled from "styled-components";
import ProgressBar from "react-bootstrap/ProgressBar";
import "react-toastify/dist/ReactToastify.css";
import pdf from "../assets/images/pdf.png";
import DropDownBox from "./DropDownBox";

const StageBox = ({
  stagedFileList,
  setStagedFileList,
  progressList,
  totalProgress,
  totalSize,
  setModifiedFileNameList,
  setIsAllSelected,
}) => {
  const hasFiles = stagedFileList ? stagedFileList.length : 0;

  // 파일 크기 단위 변환 함수
  const getByteSize = (size) => {
    const byteUnits = ["KB", "MB", "GB", "TB"];

    for (let i = 0; i < byteUnits.length; i++) {
      size = size / 1024;

      if (size < 1024) return size.toFixed(0) + byteUnits[i];
    }
  };

  // 삭제 버튼 클릭 이벤트 함수
  const handleDeleteBtn = (idx, file) => {
    fileRemove(file);
  };

  // 파일 삭제 함수
  const fileRemove = (targetFile) => {
    const tempFileList = stagedFileList.filter((file) => file !== targetFile);
    setStagedFileList(tempFileList);
  };

  return (
    <StageWrap>
      {hasFiles === 0 ? null : (
        <>
          <TotalProgressBarWrap>
            <TotalProgressBar
              progress={
                totalSize ? Math.round((totalProgress * 100) / totalSize) : 0
              }
            ></TotalProgressBar>
          </TotalProgressBarWrap>
          {stagedFileList.map((file, idx) => {
            return (
              <FileWrap key={file.name}>
                <PngIcon src={pdf} alt="pdf icon" />
                <StagedFileInfoWrap>
                  <StagedFileInfo>
                    <StagedFileInfoText>
                      <StagedFileName>{file.name}</StagedFileName>
                      <StagedFileSize>{getByteSize(file.size)}</StagedFileSize>
                    </StagedFileInfoText>
                    <DeleteStagedFileBtn
                      onClick={() => handleDeleteBtn(idx, file)}
                    >
                      X
                    </DeleteStagedFileBtn>
                  </StagedFileInfo>
                  <UploadProgressBarWrap>
                    {progressList && (
                      <UploadProgressBar progress={progressList[idx]} />
                    )}
                  </UploadProgressBarWrap>
                </StagedFileInfoWrap>
                <DropDownBox
                  fileIndex={idx}
                  setModifiedFileNameList={setModifiedFileNameList}
                  setIsAllSelected={setIsAllSelected}
                />
              </FileWrap>
            );
          })}
        </>
      )}
    </StageWrap>
  );
};

//중단(스테이지된 파일 리스트)
const StageWrap = styled.div`
  font-weight: 750;
  margin-bottom: 15px;
  width: 100%;
  max-width: 700px;
  min-width: 300px;
`;

const TotalProgressBarWrap = styled.div``;

const TotalProgressBar = styled(ProgressBar).attrs((props) => ({
  min: 0,
  max: 100,
  animated: true,
  now: props.progress,
  label: `${props.progress ? props.progress : 0}%`,
}))`
  height: 30px;
  .progress-bar {
    background-color: #006064;
    font-size: 17px;
    font-weight: 1000;
  }
`;

const FileWrap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr; /* 새로운 열 추가 */
  // grid-template-columns: 1fr 9fr;
  padding: 15px 0px;
  border-bottom: 1px solid #dcdcdc;
  @media (max-width: 400px) {
    padding: 5px 0px;
  }
`;

const StagedFileInfoWrap = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
`;

const PngIcon = styled.img`
  width: 100%;
  height: 100%;
  @media (max-width: 650px) {
    width: 30px;
    height: 30px;
  }
`;

const StagedFileInfoText = styled.div``;

const StagedFileInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StagedFileName = styled.div`
  font-size: 15px;
  font-weight: 750;
`;

const StagedFileSize = styled.div`
  padding-top: 2px;
  font-size: 12px;
  font-weight: 750;
`;

const UploadProgressBarWrap = styled.div`
  padding-top: 5px;
`;

const UploadProgressBar = styled(ProgressBar).attrs((props) => ({
  min: 0,
  max: 100,
  animated: true,
  now: props.progress,
  label: `${props.progress ? props.progress : 0}%`,
}))`
  height: 20px;
  .progress-bar {
    background-color: #006064;
    font-size: 17px;
    font-weight: 1000;
  }
`;

const DeleteStagedFileBtn = styled.button`
  justify-self: end; /* 오른쪽 끝으로 이동 */
  cursor: pointer;
  font-weight: 700;
`;

export default StageBox;
