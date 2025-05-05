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
import { IEvent } from "@/interfaces/event.interface";
import { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditEvent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [venue, setVenue] = useState("");
  const [participantLimit, setParticipantLimit] = useState("0");
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<IEvent | undefined>(undefined);

  const fetchEvent = async () => {
    try {
      const response = await axiosConfig.get(`/event/get-event/${id}`);
      setEvent(response.data.details.event);

      const eventData = response.data.details.event;
      setName(eventData.name);
      setDescription(eventData.description);
      setDate(eventData.date);
      setVenue(eventData.venue);
      setParticipantLimit(eventData.participant_limit);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleEditEvent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name,
        description,
        date,
        venue,
        participant_limit: participantLimit,
      };

      console.log(data);

      const response = await axiosConfig.put(`/event/edit-event/${id}`, data);
      toast.success(response.data.message);
      return navigate(-1);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  return (
    <AdminLayout heading="Edit event" subheading={event?.name}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create events</CardTitle>
            </CardHeader>
            <form onSubmit={handleEditEvent}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Name of the event"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Description of the event"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="date">Date</Label>
                    <DatePicker date={date} setDate={setDate} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      placeholder="Venue of the event"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <ParticipantLimitSelector
                      participantLimit={participantLimit}
                      setParticipantLimit={setParticipantLimit}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditEvent;
