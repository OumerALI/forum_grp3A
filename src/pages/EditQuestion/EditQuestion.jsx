import React, { useRef, useState } from "react";
import classes from "./editQuestion.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Api/axiosConfig";

const EditQuestion = () => {
  const navigate = useNavigate();
  const { questionid } = useParams();

  // State to handle messages for edit question
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const titleDom = useRef();
  const questionDom = useRef();

  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();
    const titleValue = titleDom.current.value;
    const questionValue = questionDom.current.value;

    try {
      const { data, status } = await axios.put(
        `/questions/edit-question/${questionid}`,
        {
          title: titleValue,
          description: questionValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (status === 200 && data?.msg) {
        // Check if response is OK and then set success message
        setMessage(data?.msg || "Updated successfully, redirecting to home");
        setMessageType("success");

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        // If response is not successful, set error message
        setMessage(data?.msg || "Updating failed. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg || "Login failed. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  }

  return (
    <section>
      <div className={classes["post-question"]}>
        <h2>Edit Your Question</h2>
        <div className={classes.successMessage}>
          {message && (
            <p
              style={{
                color: messageType === "error" ? "red" : "green",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={titleDom}
            type="text"
            name="title"
            placeholder="Updated question title"
            className={classes["input-field"]}
          />
          <textarea
            ref={questionDom}
            name="details"
            placeholder="Updated question detail ..."
            className={classes["textarea-field"]}
          ></textarea>
          <button type="submit" className={classes["post-btn"]}>
            Post Question
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditQuestion;
