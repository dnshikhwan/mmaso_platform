import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout";

// Sample data - you can replace this with your actual data
const defaultEvents = [
    {
        id: 1,
        day: "Monday",
        startTime: "09:00",
        endTime: "10:30",
        title: "Mathematics",
        location: "Room 101",
    },
    {
        id: 2,
        day: "Monday",
        startTime: "10:45",
        endTime: "12:15",
        title: "Physics",
        location: "Lab 3",
    },
    {
        id: 3,
        day: "Tuesday",
        startTime: "09:00",
        endTime: "10:30",
        title: "Chemistry",
        location: "Lab 2",
    },
    {
        id: 4,
        day: "Tuesday",
        startTime: "13:00",
        endTime: "14:30",
        title: "Biology",
        location: "Room 105",
    },
    {
        id: 5,
        day: "Wednesday",
        startTime: "10:00",
        endTime: "11:30",
        title: "Computer Science",
        location: "IT Lab",
    },
    {
        id: 6,
        day: "Wednesday",
        startTime: "14:00",
        endTime: "15:30",
        title: "English",
        location: "Room 202",
    },
    {
        id: 7,
        day: "Thursday",
        startTime: "09:00",
        endTime: "10:30",
        title: "History",
        location: "Room 301",
    },
    {
        id: 8,
        day: "Thursday",
        startTime: "13:00",
        endTime: "14:30",
        title: "Geography",
        location: "Room 305",
    },
    {
        id: 9,
        day: "Friday",
        startTime: "11:00",
        endTime: "12:30",
        title: "Art",
        location: "Art Studio",
    },
    {
        id: 10,
        day: "Friday",
        startTime: "14:00",
        endTime: "15:30",
        title: "Music",
        location: "Music Room",
    },
];

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const timeSlots = [
    "09:00",
    "10:30",
    "10:45",
    "12:15",
    "13:00",
    "14:30",
    "14:45",
    "16:15",
    "16:30",
    "18:00",
    "19:45",
];

export default function Timetable() {
    const [events] = useState(defaultEvents);
    const [view, setView] = useState("week");

    // Filter events for a specific day
    const getEventsForDay = (day: string) => {
        return events.filter((event) => event.day === day);
    };

    // Check if there's an event at a specific day and time
    const getEventAt = (day: string, time: string) => {
        return events.find(
            (event) =>
                event.day === day &&
                event.startTime <= time &&
                event.endTime > time
        );
    };

    return (
        <Layout heading="Academic Resources" subheading="Timetable">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="container mx-auto px-12 py-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-xl font-bold">
                                Weekly Timetable
                            </h1>
                            <Select value={view} onValueChange={setView}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">
                                        Week View
                                    </SelectItem>
                                    <SelectItem value="day">
                                        Day View
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {view === "week" ? (
                            <div className="overflow-x-auto">
                                <div className="min-w-[800px]">
                                    <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-2 mb-4">
                                        <div className="font-medium text-muted-foreground">
                                            Time
                                        </div>
                                        {days.map((day) => (
                                            <div
                                                key={day}
                                                className="font-medium text-center"
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-2">
                                        {timeSlots.map((time) => (
                                            <>
                                                <div
                                                    key={time}
                                                    className="py-2 text-sm text-muted-foreground"
                                                >
                                                    {time}
                                                </div>
                                                {days.map((day) => {
                                                    const event = getEventAt(
                                                        day,
                                                        time
                                                    );
                                                    return (
                                                        <div
                                                            key={`${day}-${time}`}
                                                            className={`border rounded-md p-2 h-16 ${
                                                                event
                                                                    ? "bg-primary/10 border-primary/20"
                                                                    : "border-border"
                                                            }`}
                                                        >
                                                            {event &&
                                                                event.startTime ===
                                                                    time && (
                                                                    <div className="h-full">
                                                                        <p className="font-medium text-sm">
                                                                            {
                                                                                event.title
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {
                                                                                event.location
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {
                                                                                event.startTime
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                event.endTime
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {days.map((day) => (
                                    <Card key={day}>
                                        <CardHeader>
                                            <CardTitle>{day}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {getEventsForDay(day).length >
                                                0 ? (
                                                    getEventsForDay(day).map(
                                                        (event) => (
                                                            <div
                                                                key={event.id}
                                                                className="flex justify-between items-center p-3 border rounded-lg"
                                                            >
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            event.title
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            event.location
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {
                                                                        event.startTime
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        event.endTime
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <p className="text-muted-foreground text-center py-4">
                                                        No events scheduled
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
