import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

function SearchingPoll() {
  const [searchingPoll, setSearchingPoll] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  async function searchPoll(event) {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.get(
        `http://localhost:5000/poll/getbyid/${searchingPoll}`
      );
      setSearchResults(response.data);
      console.log(response.data); // Set search results in state
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Form onSubmit={searchPoll}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Enter Poll ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a Poll ID"
            value={searchingPoll}
            onChange={(e) => setSearchingPoll(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>

      {/* Display search results */}
      {searchResults && (
        <div>
          <h2>Search Results</h2>
          <ul>
            {/* Check if searchResults is an array. Adjust accordingly if it's an object */}
            {Array.isArray(searchResults) ? (
              searchResults.map((result, index) => (
                <li key={index}>
                  {result.poll_id}: {result.title}
                </li>
              ))
            ) : (
              <li>
                {searchResults.poll_id}: {searchResults.title}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchingPoll;
