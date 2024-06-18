import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./assets/css/app.css";
import { Flex } from "@chakra-ui/react";
import localforage from "localforage";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "dailyDust",
  storeName: "diaryImages",
});

function App() {
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().toLocaleDateString())
  );
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    return savedEntries ? JSON.parse(savedEntries) : {};
  });
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (entries[formattedDate]) {
      setText(entries[formattedDate].text || "");
      if (entries[formattedDate].imageKey) {
        localforage.getItem(entries[formattedDate].imageKey).then((data) => {
          setImage(data);
        });
      } else {
        setImage(null);
      }
    } else {
      setText("");
      setImage(null);
    }
  }, [selectedDate, entries]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSaveEntry = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (text.trim() === "") {
      const { [formattedDate]: value, ...remainingEntries } = entries;
      setEntries(remainingEntries);
      localStorage.setItem("diaryEntries", JSON.stringify(remainingEntries));
      if (value && value.imageKey) {
        await localforage.removeItem(value.imageKey);
      }
    } else {
      const imageKey = formattedDate + "-image";
      const updatedEntries = {
        ...entries,
        [formattedDate]: { text, imageKey: image ? imageKey : null },
      };
      setEntries(updatedEntries);
      localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries));
      if (image) {
        await localforage.setItem(imageKey, image);
      }
    }
    setIsEditing(false);
  };

  const handleEditEntry = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tileContent = ({ date, view }) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (
      view === "month" &&
      entries[formattedDate] &&
      entries[formattedDate].text.trim() !== ""
    ) {
      return <div className="entry-dot"></div>;
    }
    return null;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <h1>먼지의 하루</h1>
      <Flex>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
        />
        <Flex flexDirection="column">
          <h2>오늘의 일기</h2>
          <textarea
            value={text}
            readOnly={!isEditing}
            onChange={handleTextChange}
            placeholder="일기를 작성하세요..."
            spellCheck={false}
          />
          {image && (
            <img
              src={image}
              alt="일기 이미지"
              onClick={openModal}
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          )}
          <Flex>
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="file-input"
                  style={{ display: "none" }}
                />
                <label htmlFor="file-input" className="custom-file-upload">
                  이미지 업로드
                </label>
              </>
            )}

            {isEditing ? (
              <button class={"save_btn"} onClick={handleSaveEntry}>
                저장
              </button>
            ) : (
              <button class={"edit_btn"} onClick={handleEditEntry}>
                수정
              </button>
            )}
          </Flex>
        </Flex>
      </Flex>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <img src={image} alt="일기 이미지" />
          </div>
        </div>
      )}
      <div className={`intro ${showIntro ? "active" : "inactive"}`}>
        <h2>먼지의 하루</h2>
        <p>by Kim Dust</p>
      </div>
    </div>
  );
}

export default App;
