// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { Button } from "react-bootstrap";
// import { FaRegHeart, FaHeart } from "react-icons/fa";

// function Like({ pollId ,setLikepoll,likepoll}) {
//   const [likedPolls, setLikedPolls] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   // UserId from local storage
//   const UserId = localStorage.getItem("Id");

//   const handleCheckboxChange = async () => {
//     if (isLoading) return;
//     setIsLoading(true);
//     console.log(pollId)

//     try {
//       const response = await axios.post("http://49.204.232.254:84/polls/likeonpoll", {
//         poll_id: pollId,
//         user_id: UserId,
//       });
//       console.log(response.data)
//       setLikepoll(!likepoll)
//       if (response.status===200) {
//         setLikedPolls((prevLiked) => !prevLiked);
        
//         setIsError(true)
//       }
//     } catch (err) {
//       console.error("Error in liking poll", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Button
//         onClick={handleCheckboxChange}
//         style={{ backgroundColor: "inherit", border: "none" }}
//         disabled={isLoading}
//       >
//         {likedPolls && isError ? (
//           <FaHeart style={{ color: "red", fontSize: "24px" }} />
//         ) : (
          
         
//           <FaRegHeart style={{ color: "black", fontSize: "24px" }} />
//         )}
//       </Button>

     
//     </div>
//   );
// }

// export default Like;
