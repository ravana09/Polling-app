import axios from "axios";
import React from "react";
import { Button } from "react-bootstrap";

function Like({pollId}) {
    // const [likedPolls, setLikedPolls] = useState(false);
    // const [likeClikedPolls, setLikeClickPolls] = useState("");

    // const handleCheckboxChange= async()=>{
    //     try {
    //         const response = await axios.post(
    //           `http://localhost:5000/poll/like/${pollId}`,
    //           {
    //             userID: id,
    //           }
    //         );
    //         if (response.status === 200) {
    //         }
    //       } catch (err) {
    //         console.error("Error in Liking ", err);
    //       }
    //       try {
    //         const response = await axios.get(
    //           `http://localhost:5000/poll/getliked/${id}`
    //         );
    //         console.log(response);
    //       } catch (err) {
    //         console.error("Error in fetching liked polls", err);
    //       }
    // }
  return (
    <div>
      {/* <Button
        onClick={() => handleCheckboxChange(apiData.poll_id)}
        style={{ backgroundColor: "inherit", border: "none" }}
      >
        {likedPolls && likeClikedPolls === apiData.poll_id ? (
          <FaHeart style={{ color: "red", fontSize: "24px" }} />
        ) : (
          <FaRegHeart style={{ color: "black", fontSize: "24px" }} />
        )}
      </Button>
      <span>Like</span> */}
    </div>
  );
}

export default Like;
