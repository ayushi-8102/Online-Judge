// import styles from "./styles.module.css";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// const Main = () => {
// 	const handleLogout = () => {
// 		localStorage.removeItem("token");
// 		window.location.reload();
// 	};

// 	return (
// 		<div className={styles.main_container}>
// 			<nav className={styles.navbar}>
// 				<h1>Online Judge</h1>
// 				<button className={styles.white_btn} onClick={handleLogout}>
// 					Logout
// 				</button>
// 			</nav>
			
      
// 		</div>
// 	);
// };

// export default Main;

import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Main = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  let val=1;
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  const callProblems = async () => {
    try {
      const res = await fetch(`http://localhost:8080/problems`, {
        method: "GET",
        // headers: {
        //   Accept: "application/json",
        //   "Content-Type": "application/json",
        //   Authorization: localStorage.getItem("jwtToken"),
        // },
        // credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      setProblems(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    callProblems();
  });
 

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Online Judge</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className={styles.problem_list}>
	  <section className={styles.problemtable}>
  {problems ? (
	<table className={`${styles["content-table"]} animated fadeIn`}>
	  <thead>
		<tr>
		  <th align="center">Problem No.</th>
		  <th>Name</th>
		  <th>Topic Tag</th>
		  <th>Difficulty</th>
		</tr>
	  </thead>
	  <tbody>
		{problems?.map((i, index) => {
			let difficultyColor = "";
			if (problems.difficultyLevel === "Easy") {
				difficultyColor = styles.green;
			} else if (problems.difficultyLevel === "Medium") {
				difficultyColor = styles.yellow;
			} else if (problems.difficultyLevel === "Hard") {
				difficultyColor = styles.red;
			}
		  return (
			<tr>
			  <td align="center">{val+index}</td>
			  <NavLink to={`/problems/:${i.problemId}`}>
				<td>{i.title}</td>
			  </NavLink>
			  <td >{i.topicTag}</td>
			  <td className={i.difficultyLevel}>{i.difficultyLevel}</td>
			</tr>
		  );
		})}
	  </tbody>
	</table>
  ) : (
	<p className="text1">Loading...</p>
  )}
</section>
      </div>
    </div>
  );
};

export default Main;

