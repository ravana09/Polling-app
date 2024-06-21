import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaRegHeart, FaHeart } from "react-icons/fa";

function Like({ pollId }) {
  const [userLikedpolls, setUserLikedPolls] = useState([]);
  const [likedPolls, setLikedPolls] = useState(false);
  const [likeClickedPolls, setLikeClickPolls] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // UserId from local storage
  const UserId = localStorage.getItem("Id");

  // Fetch the liked polls when the component mounts
  useEffect(() => {
    const fetchLikedPolls = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/poll/getliked/${UserId}`
        );
        setUserLikedPolls(response.data);
        setLikedPolls(response.data.includes(pollId));
      } catch (err) {
        console.error("Error in fetching liked polls", err);
      }
    };
    fetchLikedPolls();
  }, [UserId, pollId]);

  const handleCheckboxChange = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/poll/like/${pollId}`,
        {
          userID: UserId,
        }
      );
      if (response.status === 200) {
        setLikedPolls(!likedPolls);
        setLikeClickPolls(pollId);
      }
    } catch (err) {
      console.error("Error in liking poll", err);
    }

    // Re-fetch the liked polls after a change
    try {
      const response = await axios.get(
        `http://localhost:5000/poll/getliked/${UserId}`
      );
      setUserLikedPolls(response.data);
    } catch (err) {
      console.error("Error in fetching liked polls", err);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <Button
        onClick={handleCheckboxChange}
        style={{ backgroundColor: "inherit", border: "none" }}
        disabled={isLoading}
      >
        {likedPolls && likeClickedPolls === pollId ? (
          <FaHeart style={{ color: "red", fontSize: "24px" }} />
        ) : (
          <FaRegHeart style={{ color: "black", fontSize: "24px" }} />
        )}
      </Button>
      <span>Like</span>
    </div>
  );
}

export default Like;
