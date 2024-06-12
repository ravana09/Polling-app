import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaRegHeart, FaHeart } from "react-icons/fa";

function Like({ pollId }) {
  const [liked, setLiked] = useState(false);
  const userId = localStorage.getItem("Id");

  useEffect(() => {
    // Fetch the initial like status when the component mounts
    const fetchLikedStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/poll/getliked/${userId}`);
        // Assuming the response contains a list of liked poll IDs and checking if the current poll is liked
        const likedPolls = response.data.likedPolls; // Adjust this according to your actual response structure
        setLiked(likedPolls.includes(pollId));
      } catch (error) {
        console.error("Error fetching liked status:", error);
      }
    };

    if (userId && pollId) {
      fetchLikedStatus();
    }
  }, [userId, pollId]);

  const handleCheckboxChange = async () => {
    const newLikedStatus = !liked;

    try {
      await axios.post(`http://localhost:5000/poll/like/${pollId}`, {
        userID: userId,
        liked: newLikedStatus,
      });
      setLiked(newLikedStatus);
    } catch (error) {
      console.error("Error updating liked status:", error);
      console.error("Detailed error information:", error.response || error.message);
    }
  };

  return (
    <Row>
      <Col>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleCheckboxChange}
          style={{ display: "none" }}
          id="like-checkbox"
        />
        <label htmlFor="like-checkbox" style={{ cursor: "pointer" }}>
          {liked ? (
            <FaHeart style={{ color: "red", fontSize: "24px" }} />
          ) : (
            <FaRegHeart style={{ fontSize: "24px" }} />
          )}
        </label>
        <span style={{ marginLeft: "8px" }}>Like</span>
      </Col>
    </Row>
  );
}

export default Like;
