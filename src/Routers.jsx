import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/home/Home";
import "./assets/css/app.css";

const Routers = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
