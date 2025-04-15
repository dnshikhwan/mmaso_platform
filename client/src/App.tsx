import { Route, Routes } from "react-router";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/dashboard/Dashboard";
import Timetable from "./pages/dashboard/Timetable";
import Students from "./pages/admin/Students";
import Events from "./pages/admin/Events";
import AddEvents from "./pages/admin/AddEvents";
import AdminSignIn from "./pages/auth/AdminSignIn";
import { Toaster } from "./components/ui/sonner";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Event from "./pages/admin/Event";
import EditEvent from "./pages/admin/EditEvent";

const App = () => {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                <Route index element={<SignIn />} />
                <Route path="dashboard">
                    <Route path="home" element={<Dashboard />} />

                    <Route path="timetable" element={<Timetable />} />
                    <Route path="event/:id" element={<Event />} />
                </Route>

                <Route path="admin">
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="sign-in" element={<AdminSignIn />} />
                    <Route path="students" element={<Students />} />
                    <Route path="events" element={<Events />} />
                    <Route path="add-events" element={<AddEvents />} />
                    <Route path="edit-event/:id" element={<EditEvent />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
