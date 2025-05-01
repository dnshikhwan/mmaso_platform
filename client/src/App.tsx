import { Route, Routes } from "react-router";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/dashboard/Dashboard";
import Timetable from "./pages/dashboard/Timetable";
import Students from "./pages/students/Students";
import Events from "./pages/events/Events";
import AddEvents from "./pages/events/AddEvents";
import AdminSignIn from "./pages/auth/AdminSignIn";
import { Toaster } from "./components/ui/sonner";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Event from "./pages/events/Event";
import EditEvent from "./pages/events/EditEvent";
import Announcements from "./pages/announcements/Announcements";
import NotFound from "./pages/errors/NotFound";
import AddStudents from "./pages/students/AddStudents";
import Profile from "./pages/profile/Profile";
import Notes from "./pages/material/Notes";
import ChangePassword from "./pages/auth/ChangePassword";

const App = () => {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route index element={<SignIn />} />
                <Route
                    path="/auth/change-password"
                    element={<ChangePassword />}
                />
                <Route path="dashboard">
                    <Route path="home" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />

                    <Route path="notes" element={<Notes />} />

                    <Route path="timetable" element={<Timetable />} />
                    <Route path="event/:id" element={<Event />} />
                </Route>

                <Route path="admin">
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="sign-in" element={<AdminSignIn />} />

                    <Route path="view-students" element={<Students />} />
                    <Route path="add-students" element={<AddStudents />} />

                    <Route path="events" element={<Events />} />
                    <Route path="add-events" element={<AddEvents />} />
                    <Route path="edit-event/:id" element={<EditEvent />} />
                    <Route
                        path="view-announcements"
                        element={<Announcements />}
                    />
                </Route>
            </Routes>
        </>
    );
};

export default App;
