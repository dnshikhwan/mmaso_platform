import { Calendar, GraduationCap, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminDashboard() {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-background p-4">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6" />
                        <h1 className="text-xl font-bold">
                            Student Platform Admin
                        </h1>
                    </div>
                </div>
            </header>

            <main className="p-4">
                <div className="mx-auto max-w-6xl space-y-6">
                    <h2 className="text-2xl font-bold">Dashboard Overview</h2>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Students
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2,853</div>
                                <p className="text-xs text-muted-foreground">
                                    Across all courses and programs
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Scheduled Events
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">
                                    Upcoming this week
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 border-b pb-4 last:border-0"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <p className="font-medium">
                                                    {event.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {event.date}
                                                </p>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {event.description}
                                            </p>

                                            {event.attendees && (
                                                <div className="mt-2">
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        Attendees:
                                                    </p>
                                                    <div className="flex -space-x-2">
                                                        {event.attendees.map(
                                                            (attendee, i) => (
                                                                <Avatar
                                                                    key={i}
                                                                    className="h-6 w-6 border-2 border-background"
                                                                >
                                                                    <AvatarImage
                                                                        src={
                                                                            attendee.avatar ||
                                                                            "/placeholder.svg?height=24&width=24"
                                                                        }
                                                                        alt={
                                                                            attendee.name
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="text-[10px]">
                                                                        {
                                                                            attendee.initials
                                                                        }
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            )
                                                        )}
                                                        {event.attendeeCount >
                                                            event.attendees
                                                                .length && (
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                                                                +
                                                                {event.attendeeCount -
                                                                    event
                                                                        .attendees
                                                                        .length}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

// Sample data
const upcomingEvents = [
    {
        title: "Introduction to Programming Workshop",
        date: "Today, 2:00 PM",
        description:
            "Beginner-friendly workshop covering programming fundamentals",
        attendees: [
            {
                name: "Emma Thompson",
                initials: "ET",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Michael Chen",
                initials: "MC",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Sarah Johnson",
                initials: "SJ",
                avatar: "/placeholder.svg?height=24&width=24",
            },
        ],
        attendeeCount: 24,
    },
    {
        title: "End of Semester Exam: Web Development",
        date: "Tomorrow, 10:00 AM",
        description: "Final examination for the Web Development course",
        attendees: [
            {
                name: "David Wilson",
                initials: "DW",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Lisa Brown",
                initials: "LB",
                avatar: "/placeholder.svg?height=24&width=24",
            },
        ],
        attendeeCount: 35,
    },
    {
        title: "Student Council Meeting",
        date: "May 8, 4:30 PM",
        description:
            "Monthly meeting to discuss student affairs and upcoming events",
        attendees: [
            {
                name: "James Taylor",
                initials: "JT",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Olivia Martinez",
                initials: "OM",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Noah Garcia",
                initials: "NG",
                avatar: "/placeholder.svg?height=24&width=24",
            },
        ],
        attendeeCount: 12,
    },
    {
        title: "Career Fair: Tech Industry",
        date: "May 10, 1:00 PM",
        description:
            "Networking event with representatives from leading tech companies",
        attendees: [
            {
                name: "Sophia Lee",
                initials: "SL",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Ethan Clark",
                initials: "EC",
                avatar: "/placeholder.svg?height=24&width=24",
            },
        ],
        attendeeCount: 150,
    },
    {
        title: "Guest Lecture: AI and the Future of Education",
        date: "May 12, 3:00 PM",
        description:
            "Special lecture by Dr. Rebecca Johnson on artificial intelligence in education",
        attendees: [
            {
                name: "William Davis",
                initials: "WD",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Ava Rodriguez",
                initials: "AR",
                avatar: "/placeholder.svg?height=24&width=24",
            },
            {
                name: "Benjamin White",
                initials: "BW",
                avatar: "/placeholder.svg?height=24&width=24",
            },
        ],
        attendeeCount: 75,
    },
];
