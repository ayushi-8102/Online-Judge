import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import styles from "./styles.module.css";
const Problem = () => {
  const { pid } = useParams();
  const cleanId = pid.substring(1);
  const [problems, setProblem] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [constr, setConstr] = useState("");
  const [descrip, setDescrip] = useState("");
  const [code, setCode] = useState("");
  const [codeout, setCodeout] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [ver, setVer] = useState("");
  const [userId, setUserId] = useState();
  let verdict = "";

  const callProblems = async () => {
    try {
      const res = await fetch(`http://localhost:8080/problem/${cleanId}`, {
        method: "GET",
        
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch problem data");
      }
  
      const probdata = await res.json();
      setProblem(probdata);
  
      const irows = probdata.sampleInput.split("~");
      const allirows = irows.join("\n");
      setInput(allirows);
      const orows = probdata.sampleOutput.split("~");
      const allorows = orows.join("\n");
      setOutput(allorows);
      const crows = probdata.problemConstraints.split("~");
      const allcrows = crows.join("\n");
      setConstr(allcrows);
      const drows = probdata.description.split("~");
      const alldrows = drows.join("\n");
      setDescrip(alldrows);
    } catch (err) {
      console.log(err);
    }
  };
  
  const callUserid = async () => {
    try {
      const res = await fetch(`http://localhost:8080/userdata`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          // "Content-Type": "application/json",
          // Authorization: localStorage.getItem("jwtToken"),
        },
        // credentials: "include",
      });

      const userData = await res.json();
      setUserId(userData.userid);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    callProblems();
    callUserid();
  });
  
  
  const handleRun = async (e) => {
    e.preventDefault();
    setVer("");
    if (selectedLanguage === "") {
      window.alert("Please select a language first");
      return;
    }
    if (code === "") {
      window.alert("First write some code");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang: selectedLanguage,
          code: code,
          input: input,
          type: "run",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setCodeout(errorData.error.stderr);
        return;
      }

      const data = await response.json();
      const newOut = data.output;
      const norows = newOut.split("\r\n");
      const allnorows = norows.join("\n");

      let modout = allnorows;
      if (modout.slice(-2) === "\r\n" || modout.slice(-1) === "\n") {
        modout = modout.slice(0, -2);
      }

      setCodeout(modout);
      if (modout === output) {
        console.log("yayyy");
      } else {
        console.log("nope");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVer("");
    if (selectedLanguage === "") {
      window.alert("Please select a language first");
      return;
    }
    if (code === "") {
      window.alert("First write some code");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang: selectedLanguage,
          code: code,
          input: problems.exampleInput,
          type: "submit",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        verdict = "Compilation Error";
        setCodeout(errorData.error.stderr);
        return;
      }

      const data = await response.json();
      const newOut = data.output;
      const norows = newOut.split("\r\n");
      const allnorows = norows.join("\n");

      let modout = allnorows;
      if (modout.slice(-2) === "\r\n" || modout.slice(-1) === "\n") {
        modout = modout.slice(0, -2);
      }

      if (modout === problems.exampleOutput) {
        verdict = "Accepted";
      } else {
        verdict = "Wrong Answer";
      }

      setCodeout("");
      setVer(verdict);

      const res = await fetch(`http://localhost:8080/addsubmission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId: cleanId,
          lang: selectedLanguage,
          code: code,
          verdict: verdict,
          userid: userId,
        }),
      });

      const subdata = await res.json();
      console.log(subdata);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.problempage}>
      {problems ? (
        <div className={styles["page-content"]}>
          <div className={styles.ques}>
            <p className={styles.problemname}>{problems.title}</p>
            <p className={styles.des}>Description</p>
            <pre>{descrip}</pre>
            <p className={styles.cons}>Constraints</p>
            <pre>{constr}</pre>
            <p className={styles.stc}>Sample Testcase</p>
            <div className={styles.flexforstc}>
              <div>
                <p className={styles.ini}>Input: </p>
                <pre>{input}</pre>
              </div>
              <div className={styles.out}>
                <p className={styles.outi}>Output: </p>
                <pre>{output}</pre>
              </div>
            </div>
          </div>

          <div className={styles.code}>
            <div className={styles.slang}>
              <label htmlFor="language" className={styles.label}>
                {" "}
              </label>
              <select
                value={selectedLanguage}
                className={styles.select}
                onChange={(event) => setSelectedLanguage(event.target.value)}
              >
                <option value="">Select</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="py">Python</option>
              </select>
            </div>

            <div>
              <textarea
                spellCheck="false"
                onChange={(e) => setCode(e.target.value)}
              ></textarea>
              <button type="submit" id="test" onClick={handleRun}>
                Run Code
              </button>
              <button type="submit" id="submit" onClick={handleSubmit}>
                Submit Code
              </button>
              <NavLink className={styles.submilink} to={`/submissions/${cleanId}`}>
                Submissions
              </NavLink>

              {codeout && (
                <div>
                  <p className={styles.yout}>Your Output</p>
                  <pre>{codeout}</pre>
                  <p className={styles.eout}>Expected Output</p>
                  <pre>{output}</pre>
                </div>
              )}

              {ver && (
                <div className={styles.verdiv}>
                  <span className={styles.vertext}>Verdict: </span>
                  {ver === "Wrong Answer" && (
                    <span className={styles.wa}>Wrong Answer</span>
                  )}
                  {ver === "Accepted" && <span className={styles.ac}>Accepted</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className={styles.text1}>Loading...</p>
      )}
    </section>
  );
};

export default Problem;
