import { axiosConfig } from "@/axiosConfig";
import AdminLayout from "@/components/admin-layout";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { IEvent } from "@/interfaces/event.interface";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const Event = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const response = await axiosConfig.get(`/event/get-event/${id}`);
      setEvent(response.data.details.event);
      setCount(response.data.details.count);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleDeleteEvent = async () => {
    try {
      const response = await axiosConfig.delete(`/event/delete-event/${id}`);
      toast.success(response.data.message);
      navigate(-1);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <AdminLayout heading="Events" subheading={event?.name}>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex-1 rounded-xl bg-muted/50 md:min-h-min">
              <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <div className="mb-6">
                      <div className="flex justify-between">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                          {event?.name}
                        </h1>
                        <div className="flex gap-x-2">
                          <Link to={`/admin/edit-event/${id}`}>
                            <Button
                              variant={"outline"}
                              className="text-primary"
                            >
                              <Pencil />
                            </Button>
                          </Link>
                          <Button
                            onClick={handleDeleteEvent}
                            variant={"outline"}
                            className="text-destructive"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {event?.date &&
                              format(new Date(event.date), "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event?.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8">
                      <img
                        className="w-full"
                        src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="rounded-lg border p-4 sticky top-4">
                      <h2 className="text-xl font-semibold mb-4">
                        Event Details
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Description
                          </h3>
                          <p>{event?.description}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Date and Time
                          </h3>
                          <p>
                            {event?.date &&
                              format(new Date(event.date), "dd/MM/yyyy")}
                          </p>
                          <p></p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Location
                          </h3>
                          <p>{event?.venue}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Participants Limit
                          </h3>
                          <p>
                            {count} / {String(event?.participant_limit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      )}
    </div>
  );
};

export default Event;
