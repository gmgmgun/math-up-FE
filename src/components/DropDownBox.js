import React, {useEffect, useState, useCallback, useRef} from "react";
import styled from "styled-components";
import dropdown from "../assets/images/dropdown.png";

const DropDownBox = ({
  fileIndex,
  setModifiedFileNameList,
  setIsAllSelected,
}) => {
  const [isBtnOpen, setIsBtnOpen] = useState({});
  const [isInputOpen, setIsInputOpen] = useState({});
  const [userInput, setUserInput] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedFilterList, setSelectedFilterList] = useState({
    0: BASIC_DATA[0].name,
    1: BASIC_DATA[1].name,
    2: BASIC_DATA[2].name,
    3: "",
  });

  const schoolSearchNamesRef = useRef([]);
  const currentIndexRef = useRef(0);
  const schoolSearchBoxRef = useRef(null);

  // 드롭다운 아이템 선택 시 호출, 선택한 아이템을 상태에 저장하고 드롭다운을 닫음. isBtnOpen은 객체로 관리하는데, 정상 작동 확인 요망.
  const onClickSelected = useCallback(
    (e, idx) => {
      setSelectedFilterList({
        ...selectedFilterList,
        [idx]: e.target.innerHTML,
      });
      setIsBtnOpen({});
    },
    [selectedFilterList]
  );

  // 학교 선택 시 호출, 학교 이름을 상태에 저장.
  const handleSearch = (e) => {
    setUserInput(e.target.value);
  };

  // userInput의 값에 따라 필터링된 학교를 드롭다운 리스트에 렌더링.
  const filteredSchoolList = schoolList.filter((school) => {
    if (userInput) return school.name.includes(userInput);
  });

  // 학교 검색창에서 키보드 입력 시 호출, 키보드 입력에 따라 학교 목록을 필터링하고, 위아래 방향키를 누르면 선택된 학교가 바뀜. 엔터를 누르면 선택된 학교가 상태에 저장됨.
  // 추가 구현 사항: 다른 필터에도 키보드 이벤트 적용해야함.
  // 추가 구현 사항: 마운트 시 첫 이벤트 동작에 이슈가 있음. 이슈 해결 필요.
  const handleKeyDown = (e) => {
    if (!userInput || !e || !filteredSchoolList.length) return;

    e.stopPropagation();
    switch (e.key) {
      case "ArrowUp":
        const prevIndex =
          currentIndexRef.current > 0
            ? currentIndexRef.current - 1
            : filteredSchoolList.length - 1;
        setSelectedSchool(filteredSchoolList[prevIndex].name);
        currentIndexRef.current = prevIndex;
        break;
      case "ArrowDown":
        const nextIndex =
          currentIndexRef.current < filteredSchoolList.length - 1
            ? currentIndexRef.current + 1
            : 0;
        setSelectedSchool(filteredSchoolList[nextIndex].name);
        currentIndexRef.current = nextIndex;
        console.log(currentIndexRef.current);
        break;
      case "Enter":
        e.preventDefault();
        if (currentIndexRef.current > -1) {
          setSelectedFilterList({
            ...selectedFilterList,
            3: filteredSchoolList[currentIndexRef.current].name,
          });
          console.log(filteredSchoolList[currentIndexRef.current].name);
          setUserInput(filteredSchoolList[currentIndexRef.current].name);
          setIsInputOpen(false);
        }
        break;
      default:
        break;
    }

    if (schoolSearchNamesRef.current[currentIndexRef.current]) {
      schoolSearchNamesRef.current[currentIndexRef.current].scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  // 학교 목록을 불러옴. 추가 구현 사항: 동명의 학교의 경우는 어떻게 처리해야할지? 목데이터 구조를 바꿔야할 수도 있음.
  useEffect(() => {
    fetch("/data/school_list.json")
      .then((res) => res.json())
      .then((res) => {
        setSchoolList(res);
      });
  }, []);

  // 선택한 필터가 모두 선택되었는지 확인. 모두 선택되었을 경우에만 isAllSelected를 true로 변경.
  useEffect(() => {
    setIsAllSelected(false);
    if (
      selectedFilterList[1] === BASIC_DATA[0].name ||
      selectedFilterList[2] === BASIC_DATA[1].name ||
      selectedFilterList[3] === ""
    )
      return;
    setIsAllSelected(true);
  }, [selectedFilterList]);

  // userInput이 변경되면 드롭다운을 열고 selectedFilterList[3]에 userInput을 저장.
  useEffect(() => {
    setSelectedFilterList((prevSelected) => ({
      ...prevSelected,
      3: userInput,
    }));
    setIsInputOpen(true);
  }, [userInput]);

  // 선택한 필터를 기반으로 파일명을 수정.
  useEffect(() => {
    const modifiedFileName = `${selectedFilterList[0]}_${selectedFilterList[1]}_${selectedFilterList[2]}_${selectedFilterList[3]}`;
    setModifiedFileNameList((prev) => ({
      ...prev,
      [fileIndex]: modifiedFileName,
    }));
  }, [selectedFilterList]);

  return (
    <DropDownWrap>
      <BasicDropDownWrap>
        {BASIC_DATA.map((option, idx) => {
          return (
            <OptionWrap
              key={option.name}
              onMouseEnter={() => setIsBtnOpen({[option.name]: true})}
              onMouseLeave={() => setIsBtnOpen({[option.name]: false})}
              name={option.name}
              width={option.width}
              paddingLeft={option.paddingLeft}
            >
              <p>{selectedFilterList[idx]}</p>
              {isBtnOpen[option.name] && (
                <BasicItemsWrap>
                  {option.options.map((data) => {
                    return (
                      <BasicItemsBox key={data.id}>
                        <BasicItemsName
                          onClick={(e) => onClickSelected(e, idx)}
                        >
                          {data.option}
                        </BasicItemsName>
                      </BasicItemsBox>
                    );
                  })}
                </BasicItemsWrap>
              )}
              <OptionIconWrap>
                <OptionIcon src={dropdown} />
              </OptionIconWrap>
            </OptionWrap>
          );
        })}
      </BasicDropDownWrap>

      <SearchWrap
        onMouseEnter={() => setIsInputOpen(true)}
        onMouseLeave={() => setIsInputOpen(false)}
      >
        <SearchInput
          onChange={handleSearch}
          placeholder="학교명"
          value={userInput}
          onKeyDown={handleKeyDown}
        />
        {filteredSchoolList.length > 1
          ? isInputOpen && (
              <SchoolSearchWrap>
                <SchoolSearchBox ref={schoolSearchBoxRef}>
                  {filteredSchoolList.length !== schoolList.length &&
                    filteredSchoolList.map((schoolList, idx) => {
                      return (
                        <SchoolSearchName
                          ref={(el) => (schoolSearchNamesRef.current[idx] = el)}
                          value={selectedSchool}
                          key={schoolList.id}
                          onClick={onClickSelected}
                          {...(idx === currentIndexRef.current
                            ? {tabIndex: 0}
                            : {})}
                        >
                          {schoolList.name}
                        </SchoolSearchName>
                      );
                    })}
                </SchoolSearchBox>
              </SchoolSearchWrap>
            )
          : !isBtnOpen}
      </SearchWrap>
    </DropDownWrap>
  );
};

//Stage Box 내 드롭다운 리스트
const DropDownWrap = styled.div`
  ${({theme}) => theme.mixin.flex("flex", "center", "center")};
  padding-left: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-left: 15px;
`;

const BasicDropDownWrap = styled.div`
  display: flex;
`;

const OptionWrap = styled.button`
  ${({theme}) => theme.mixin.flex("flex", "space-between", "center")};
  position: relative;
  height: 40px;
  margin-left: 5px;
  border: 1px solid #006064;
  border-radius: 10px;
  background-color: white;
  color: #006064;
  font-size: 15px;
  font-weight: 720;
  cursor: pointer;
  width: ${({width}) => width};
  padding-left: ${({paddingLeft}) => paddingLeft};
`;

const OptionIconWrap = styled.div``;

const OptionIcon = styled.img`
  width: 11px;
  height: 9px;
`;

const BasicItemsWrap = styled.div`
  width: 100%;
  display: grid;
  position: absolute;
  padding: 8px;
  top: 30px;
  left: 0px;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #ededed;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  z-index: 1;
`;

const BasicItemsBox = styled.div`
  padding: 0px;
  z-index: 2;
`;

const BasicItemsName = styled.div`
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #006064;
  font-weight: 600;
  cursor: pointer;
  :hover {
    background-color: #006064;
    color: white;
  }
`;

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  padding: 0px 3px;
  height: 40px;
  border: 1px solid #006064;
  border-radius: 10px;
  color: #006064;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 140px;
  height: 20px;
  padding: 3px;
  border: none;
  color: #006064;
  font-size: 15px;
  font-weight: 720;
  ::placeholder {
    color: #006064;
    font-size: 15px;
    font-weight: 720;
  }
  :focus {
    outline: none;
  }
`;

const SchoolSearchWrap = styled.div`
  display: grid;
  position: absolute;
  padding: 8px;
  width: 100%;
  top: 30px;
  left: 0px;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #ededed;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  z-index: 1;
`;

const SchoolSearchBox = styled.ul`
  overflow-y: scroll;
  max-height: 100px;
  padding: 0px;
  ::-webkit-scrollbar {
    // width: 10px; /* 스크롤바의 너비 */
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    height: 50%; /* 스크롤바의 길이 */
    background: #006064; /* 스크롤바의 색상 */
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: white; /*스크롤바 뒷 배경 색상*/
  }
`;

const SchoolSearchName = styled.li`
  margin: 6px 0px;
  color: #006064;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  /* 드래그 안되도록 설정 */
  :hover {
    background-color: #006064;
    color: white;
  }
  ${({tabIndex}) =>
    tabIndex === 0 &&
    `
    background-color: #006064;
    color: white;
  `};
`;

const BASIC_DATA = [
  {
    id: "1",
    name: "2023",
    width: "63px",
    paddingLeft: "6px",
    options: [
      {
        id: "1",
        option: "2023",
      },
      {
        id: "2",
        option: "2022",
      },
      {
        id: "3",
        option: "2021",
      },
    ],
  },
  {
    id: "2",
    name: "학년",
    width: "55px",
    paddingLeft: "10px",
    options: [
      {
        id: "1",
        option: "고1",
      },
      {
        id: "2",
        option: "고2",
      },
      {
        id: "3",
        option: "고3",
      },
    ],
  },
  {
    id: "2",
    name: "과목",
    width: "95px",
    paddingLeft: "10px",
    options: [
      {
        id: "1",
        option: "수학(상)",
      },
      {
        id: "2",
        option: "수학(하)",
      },
      {
        id: "3",
        option: "수학 1",
      },
      {
        id: "4",
        option: "수학 2",
      },
      {
        id: "5",
        option: "확률과통계",
      },
      {
        id: "6",
        option: "미적분",
      },
      {
        id: "7",
        option: "기하",
      },
    ],
  },
];

export default DropDownBox;
