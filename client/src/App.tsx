import { Route, Routes } from "react-router";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/dashboard/Dashboard";
import Timetable from "./pages/dashboard/Timetable";

const App = () => {
  return (
    <Routes>
      <Route index element={<SignIn />} />
      <Route path="dashboard">
        <Route path="home" element={<Dashboard />} />

        <Route path="timetable" element={<Timetable />} />
      </Route>
    </Routes>
  );
};

export default App;
