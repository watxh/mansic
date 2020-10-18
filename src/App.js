import { isAbsolute } from "path";
import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import axios from "axios";

const App = () => {
  const [num, setNum] = useState(0);
  const [size, setSize] = useState(10);

  const [inter, setInter] = useState({ now: 0, j: 0 });

  const [data, setData] = useState("");

  const [mystr, setMystr] = useState("");

  const [login, setLogin] = useState(0);

  const [id, setId] = useState("");

  const [result, setResult] = useState(null);

  useEffect(() => {
    let testing = function test(pos) {
      let box = document.getElementById("box" + inter.j);
      let top = String(pos.y - (size * 12) / 2) + "px";
      let left = String(pos.x - (size * 18) / 2) + "px";
      box.style.top = top;
      box.style.left = left;
      box.style.position = "absolute";
      if (!inter.now) console.log("remove");
      window.addEventListener("mouseup", () => {
        this.removeEventListener("mousemove", testing);
      });
    };

    if (inter.now) {
      window.addEventListener("mousemove", testing);
    }
  }, [inter]);

  const randomStr = (m) => {
    var m = m || 9;
    var s = "";
    var r = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < m; i++) {
      s += r.charAt(Math.floor(Math.random() * r.length));
    }
    setMystr(s);
    return s;
  };

  const checkID = async () => {
    const idarray = (
      await axios.get("https://mansic-back.herokuapp.com/api/search")
    ).data;
    for (let i = 0; i < idarray.length; i++) {
      if (idarray[i].id === id) {
        setLogin(1);
      }
    }
  };

  const getImage = async () => {
    const img = (
      await axios.get("https://mansic-back.herokuapp.com/api/getimage")
    ).data;
    console.log(img[0].image);
    setData(img[0].image);
  };

  const changeNum = (e) => {
    setNum(e.target.value);
  };

  const changeSize = (e) => {
    setSize(e.target.value);
  };

  const getPos = async () => {
    const widthdata = document.getElementById("box" + 0).clientWidth;
    const heightdata = document.getElementById("box" + 0).clientHeight;

    const params = new URLSearchParams({
      id: id,
      deskWidth: widthdata,
      deskHeight: heightdata,
      deskNum: num,
    });

    for (let i = 0; i < num; i++) {
      const box = document.getElementById("box" + i);

      let Boxwidth = document.getElementById("mainimage").clientWidth;
      let Boxheight = document.getElementById("mainimage").clientHeight;

      let top = window.getComputedStyle(box).top;
      let left = window.getComputedStyle(box).left;

      let x = parseInt((parseFloat(left) / parseFloat(Boxwidth)) * 640);
      let y = parseInt((parseFloat(top) / parseFloat(Boxheight)) * 480);

      params.append("deskX", x);
      params.append("deskY", y);
    }

    const posting = await axios.patch(
      `https://mansic-back.herokuapp.com/api/change/${id}`,
      params
    );
  };

  const getResult = async () => {
    const result = (
      await axios.get(`https://mansic-back.herokuapp.com/api/search`)
    ).data;
    let data = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].id === id) {
        data = result[i].result;
      }
    }
    setResult(data);
  };

  return (
    <Container>
      <Container1>
        <DeskImage
          src="/image/test2.jpg"
          width="100%"
          height="auto"
          id="mainimage"
        />
        <BoxContainer>
          {(function () {
            let rows = [];
            for (let j = 0; j < num; j++) {
              rows.push(
                <Box
                  size={size}
                  num={num + 3}
                  id={"box" + j}
                  onMouseDown={() => {
                    setInter({ now: 1, j: j });
                  }}
                  onMouseUp={() => {
                    setInter({ now: 0, j: j });
                  }}
                />
              );
            }
            return rows;
          })()}
        </BoxContainer>
      </Container1>

      <Container2>
        <ResultButton onClick={getPos}>책상 위치 변경하기</ResultButton> <br />
        <ResultButton onClick={getResult}>이전 책상 위치 사용하기</ResultButton>
        <input type="number" value={num} onChange={changeNum} />
        <input type="number" value={size} onChange={changeSize} />
        {login && result ? (
          <ResultContainer>
            {result.map((data, num) => {
              return (
                <>
                  {num + 1}번 학생
                  {data ? <> 자습 중</> : <> 미아</>}
                  <br />
                </>
              );
            })}
          </ResultContainer>
        ) : (
          <>fgh</>
        )}
      </Container2>
      {!login ? (
        <Login>
          <LoginBox>
            <LoginInput
              type="text"
              placeholder="제품 번호를 입력하세요"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
              }}
            />
            <button onClick={checkID}>완료</button>
          </LoginBox>
        </Login>
      ) : (
        <></>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Container1 = styled.div`
  width: 70%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

const Container2 = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Login = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  position: fixed;
`;

const LoginBox = styled.div`
  position: fixed;
  margin-left: 50%;
  top: 200px;
  left: -150px;
  width: 300px;
  height: 200px;
  border-radius: 10px;
  background-color: white;
`;

const LoginInput = styled.input`
  margin-top: 80px;
  margin-left: 50px;
  width: 200px;
  height: 30px;
`;

const ResultButton = styled.button`
  width: 100px;
  height: 40px;
`;

const DeskImage = styled.img`
  position: absolute;
  pointer-events: none;
`;

const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Box = styled.div`
  width: 180px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 3;
  position: absolute;
  top: 300px;
  left: 1000px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;

  ${({ num }) =>
    num &&
    css`
      z-index: ${num};
    `};

  ${({ size }) =>
    size &&
    css`
      width: ${size * 18}px;
      height: ${size * 12}px;
    `};
`;

export default App;
