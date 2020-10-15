import { isAbsolute } from "path";
import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import axios from "axios";

const App = () => {
  const [num, setNum] = useState(0);
  const [size, setSize] = useState(10);

  const [inter, setInter] = useState({ now: 0, j: 0 });

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

  const changeNum = (e) => {
    setNum(e.target.value);
  };

  const changeSize = (e) => {
    setSize(e.target.value);
  };

  const getPos = async () => {
    const widthdata = document.getElementById("box" + 0).clientWidth;
    const heightdata = document.getElementById("box" + 0).clientHeight;
    const Xrows = [];
    const Yrows = [];
    for (let i = 0; i < num; i++) {
      const box = document.getElementById("box" + i);

      let Boxwidth = document.getElementById("mainimage").clientWidth;
      let Boxheight = document.getElementById("mainimage").clientHeight;

      let top = window.getComputedStyle(box).top;
      let left = window.getComputedStyle(box).left;

      let x = parseInt((parseFloat(left) / parseFloat(Boxwidth)) * 640);
      let y = parseInt((parseFloat(top) / parseFloat(Boxheight)) * 480);

      Xrows.push({ x });
      Yrows.push({ y });
    }
    console.log(Xrows, Yrows, widthdata, heightdata);

    const params = new URLSearchParams({
      deskWidth: widthdata,
      deskHeight: heightdata,
    });

    for (let j = 0; j < num; j++) {
      params.append("deskX", Xrows[j]);
      params.append("deskY", Yrows[j]);
    }

    const posting = await axios.post(
      "https://mansic-back.herokuapp.com/api/plus",
      params
    );
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
        <input type="number" value={num} onChange={changeNum} />
        <input type="number" value={size} onChange={changeSize} />
        <br />
        <button onClick={getPos}>완료</button>
      </Container2>
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
`;

const DeskImage = styled.img`
  position: absolute;
  z-index: 2;
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
