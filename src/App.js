import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./assets/css/app.css";
import { Flex } from "@chakra-ui/react";

function App() {
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().toLocaleDateString())
  );
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    return savedEntries ? JSON.parse(savedEntries) : {};
  });
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const savedEntries = localStorage.getItem("diaryEntries");
    const parsedEntries = savedEntries ? JSON.parse(savedEntries) : {};

    if (parsedEntries[formattedDate]) {
      setText(parsedEntries[formattedDate]);
    } else {
      setText("");
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSaveEntry = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const updatedEntries = {
      ...entries,
      [formattedDate]: text,
    };
    setEntries(updatedEntries);
    localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries));
    setIsEditing(false);
  };

  const handleEditEntry = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="App">
      <h1>먼지의 하루</h1>
      <Flex>
        <Calendar onChange={handleDateChange} value={selectedDate} />
        <Flex flexDirection="column">
          <h2>오늘의 일기</h2>
          <textarea
            value={text}
            readOnly={!isEditing}
            onChange={handleTextChange}
            placeholder="일기를 작성하세요..."
          />
          {isEditing ? (
            <button onClick={handleSaveEntry}>저장</button>
          ) : (
            <button onClick={handleEditEntry}>수정</button>
          )}
        </Flex>
      </Flex>
    </div>
  );
}

export default App;
