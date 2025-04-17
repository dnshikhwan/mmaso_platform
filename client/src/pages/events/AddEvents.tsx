import { axiosConfig } from "@/axiosConfig";
import AdminLayout from "@/components/admin-layout";
import { DatePicker } from "@/components/date-picket";
import ParticipantLimitSelector from "@/components/participants-limit";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const AddEvents = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [venue, setVenue] = useState("");
    const [participantLimit, setParticipantLimit] = useState("0");
    const navigate = useNavigate();

    const handleCreateEvents = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                name,
                description,
                date,
                venue,
                participant_limit: participantLimit,
            };

            const response = await axiosConfig.post("event/create-event", data);
            toast.success(response.data.message);
            return navigate("/admin/events");
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        }
    };

    return (
        <AdminLayout heading="Events " subheading="Add Events">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Create events</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleCreateEvents}>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Name of the event"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            placeholder="Description of the event"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="picture">Picture</Label>
                                        <Input id="picture" type="file" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="date">Date</Label>
                                        <DatePicker
                                            date={date}
                                            setDate={setDate}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="venue">Venue</Label>
                                        <Input
                                            id="venue"
                                            placeholder="Venue of the event"
                                            value={venue}
                                            onChange={(e) =>
                                                setVenue(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <ParticipantLimitSelector
                                            participantLimit={participantLimit}
                                            setParticipantLimit={
                                                setParticipantLimit
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button>Create</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddEvents;
