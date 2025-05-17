import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Layout from "@/components/layout";
import { IStudent } from "@/interfaces/student.interface";
import { axiosConfig } from "@/axiosConfig";

// Type definitions for the timetable data
interface Lesson {
    subject: string;
    startTime: string;
    endTime: string;
    teacher: string;
    lessonType: string;
    room: string;
}

interface DaySchedule {
    date: string;
    lessons: Lesson[];
}

interface UpcomingWeek {
    start: string;
    days: Record<string, DaySchedule>;
}

interface TimetableData {
    group: {
        name: string;
    };
    upcomingWeek: UpcomingWeek;
}

// Map Russian day names to English
const dayNameMap: Record<string, string> = {
    Понедельник: "Monday",
    Вторник: "Tuesday",
    Среда: "Wednesday",
    Четверг: "Thursday",
    Пятница: "Friday",
    Суббота: "Saturday",
    Воскресенье: "Sunday",
};

// Map English day names to Russian
const dayNameMapReverse: Record<string, string> = {
    Monday: "Понедельник",
    Tuesday: "Вторник",
    Wednesday: "Среда",
    Thursday: "Четверг",
    Friday: "Пятница",
    Saturday: "Суббота",
    Sunday: "Воскресенье",
};

// Standard time slots to display in the week view

export default function Timetable() {
    const [timetableData, setTimetableData] = useState<TimetableData | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [groupCode, setGroupCode] = useState<string>("");

    useEffect(() => {
        // Get the student group from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const userData = JSON.parse(userStr) as IStudent;
            setGroupCode(userData.group);
        } else {
            setError("User data not found in localStorage");
        }
    }, []);

    useEffect(() => {
        // Fetch timetable data when groupCode is available
        if (groupCode) {
            fetchTimetableData(groupCode);
        }
    }, [groupCode]);

    const fetchTimetableData = async (groupCode: string) => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(
                `/timetable/${groupCode}/upcoming-week`
            );
            console.log(response.data.details);
            if (
                response.data.success &&
                response.data.details.upcomingWeekData
            ) {
                setTimetableData(response.data.details.upcomingWeekData);
            } else {
                setError(
                    response.data.message || "Failed to fetch timetable data"
                );
            }
        } catch (err) {
            setError("Error fetching timetable data");
            console.error("Failed to fetch timetable:", err);
        } finally {
            setLoading(false);
        }
    };

    // Get day names from the timetable data
    const getDays = () => {
        if (!timetableData) return [];

        return Object.keys(timetableData.upcomingWeek.days).map(
            (day) => dayNameMap[day] || day
        ); // Map Russian day names to English
    };

    // Get lessons for a specific day (in English format)
    const getLessonsForDay = (day: string) => {
        if (!timetableData) return [];

        const russianDay = dayNameMapReverse[day];
        return timetableData.upcomingWeek.days[russianDay]?.lessons || [];
    };

    // Check if there's a lesson at a specific day and time

    // Generate formatted date for display (e.g., "Monday, May 19")
    const getFormattedDate = (dayName: string) => {
        if (!timetableData) return "";

        const russianDay = dayNameMapReverse[dayName];
        const dateStr = timetableData.upcomingWeek.days[russianDay]?.date;

        if (!dateStr) return "";

        const [day, month, year] = dateStr.split(".");
        const date = new Date(`${year}-${month}-${day}`);

        return `${dayName}, ${date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        })}`;
    };

    if (loading) {
        return (
            <Layout heading="Academic Resources" subheading="Timetable">
                <div className="flex flex-1 flex-col items-center justify-center">
                    <p>Loading timetable...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout heading="Academic Resources" subheading="Timetable">
                <div className="flex flex-1 flex-col items-center justify-center">
                    <p className="text-red-500">Error: {error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-primary text-white rounded"
                        onClick={() =>
                            groupCode && fetchTimetableData(groupCode)
                        }
                    >
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    if (!timetableData) {
        return (
            <Layout heading="Academic Resources" subheading="Timetable">
                <div className="flex flex-1 flex-col items-center justify-center">
                    <p>No timetable data available.</p>
                </div>
            </Layout>
        );
    }

    const days = getDays();

    return (
        <Layout heading="Academic Resources" subheading="Timetable">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-xl font-bold">Timetable</h1>
                                <p className="text-muted-foreground">
                                    Group: {timetableData.group.name} • Week
                                    starting{" "}
                                    {timetableData.upcomingWeek.start
                                        .split(".")
                                        .reverse()
                                        .join("-")}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {days.map((day) => (
                                <Card key={day}>
                                    <CardHeader>
                                        <CardTitle>
                                            {getFormattedDate(day)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {getLessonsForDay(day).length >
                                            0 ? (
                                                getLessonsForDay(day)
                                                    .sort((a, b) =>
                                                        a.startTime.localeCompare(
                                                            b.startTime
                                                        )
                                                    )
                                                    .map((lesson, index) => (
                                                        <div
                                                            key={`${day}-${index}`}
                                                            className="flex justify-between items-center p-3 border rounded-lg"
                                                        >
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        lesson.subject
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        lesson.room
                                                                    }{" "}
                                                                    •{" "}
                                                                    {
                                                                        lesson.lessonType
                                                                    }
                                                                </p>
                                                                {lesson.teacher && (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            lesson.teacher
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    lesson.startTime
                                                                }{" "}
                                                                -{" "}
                                                                {lesson.endTime}
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="text-muted-foreground text-center py-4">
                                                    No classes scheduled
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
