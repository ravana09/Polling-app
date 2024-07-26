import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Polling from "../Polling";

function Search() {
  const [multiplePolls, setMultiplePolls] = useState([]);
  const location = useLocation();
  const { searchResult } = location.state || {};
  
  
  useEffect(() => {
    if (searchResult && searchResult.poll_ids) {
      const fetchMultiplePolls = async () => {
        try {
          const res = await axios.post(
            "http://49.204.232.254:84/polls/multipoll",
            {
              poll_ids: searchResult.poll_ids,
            }
          );
          console.log(res.data, "Multiple Polls UserDetails");
          setMultiplePolls([])
          setMultiplePolls(res.data);
        } catch (error) {
          console.error("Error fetching multiple polls:", error);
        }
      };

      fetchMultiplePolls();
    }
  }, [searchResult]);

  return (
    <>
      {multiplePolls && multiplePolls.length > 0 && (
        <Polling searchPoll={multiplePolls} />
      )}
    </>
  );
  
}

export default Search;
