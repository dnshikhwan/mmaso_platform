import { axiosConfig } from "@/axiosConfig";
import AdminLayout from "@/components/admin-layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IEvent } from "@/interfaces/event.interface";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const Events = () => {
    const [events, setEvents] = useState<IEvent[]>([]);

    const fetchEvents = async () => {
        try {
            const response = await axiosConfig.get("/event/all-events");
            setEvents(response.data.details.events);
            console.log(response.data.details);
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        }
    };

    const url = "http://localhost:5000/uploads/";

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <AdminLayout heading="Events" subheading="View Events">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="grid lg:grid-cols-4 gap-4">
                        {events.map((event) => (
                            <Card key={event.id}>
                                <CardHeader>
                                    <Link to={`/dashboard/event/${event.id}`}>
                                        <CardTitle>
                                            <img
                                                src={url + "/" + event.image}
                                            />
                                        </CardTitle>
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between">
                                        <div>
                                            <Link
                                                to={`/dashboard/event/${event.id}`}
                                            >
                                                {" "}
                                                <CardTitle>
                                                    {event.name}
                                                </CardTitle>
                                            </Link>
                                            <CardDescription className="mt-3 flex gap-x-1 items-center">
                                                <MapPin className="h-4 w-4" />
                                                {event.venue}
                                            </CardDescription>
                                            <CardDescription className="flex gap-x-1 items-center">
                                                <Calendar className="h-4 w-4" />
                                                {format(
                                                    new Date(event.date),
                                                    "dd/MM/yyyy"
                                                )}
                                            </CardDescription>
                                            <CardDescription className="flex gap-x-1 items-center">
                                                <Users className="h-4 w-4" />
                                                {event.participant_limit !==
                                                0 ? (
                                                    <div>
                                                        0 /{" "}
                                                        {String(
                                                            event.participant_limit
                                                        )}{" "}
                                                        participants
                                                    </div>
                                                ) : (
                                                    "No limit"
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Events;
