// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import ResetPassword from "./pages/ResetPassword";
import Landing from "./pages/Landing";
import Drive from "./pages/Drive";
import Recent from "./pages/Recent";
import Starred from "./pages/Starred";
import Trash from "./pages/Trash";
import SearchResults from "./pages/SearchResults";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Protected / after login */}
      <Route path="/drive" element={<Drive />} />
      <Route path="/recent" element={<Recent />} />
      <Route path="/starred" element={<Starred />} />
      <Route path="/trash" element={<Trash />} />
      <Route path="/search" element={<SearchResults />} />
    </Routes>
  );
};

export default App;
