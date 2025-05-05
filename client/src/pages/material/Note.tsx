import { axiosConfig } from "@/axiosConfig";
import { EditNoteModal } from "@/components/edit-note-modal";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { INote } from "@/interfaces/note.interface";
import { AxiosError } from "axios";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const Note = () => {
  const [note, setNote] = useState<INote | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchNote = async () => {
    try {
      const response = await axiosConfig.get(`/notes/get-note/${id}`);
      setNote(response.data.details.note);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleDeleteNote = async (id: number) => {
    try {
      const response = await axiosConfig.delete(`/notes/delete-note/${id}`);
      toast.success(response.data.message);
      return navigate(-1);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  const handleBack = () => {
    return navigate(-1);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout heading="Note" subheading={note?.title || ""}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Notes
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteNote(note?.id || 0)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">{note?.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Created{" "}
                      {formatDistanceToNow(note?.created_at || Date.now(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {note?.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EditNoteModal
        isOpen={isModalOpen}
        note={note}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default Note;
