import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddNoteModal } from "@/components/add-note-modal";
import { INote } from "@/interfaces/note.interface";
import { NoteCard } from "./note-card";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosConfig } from "@/axiosConfig";

export function StudyNotesPage() {
  const [notes, setNotes] = useState<INote[]>([]);

  const handleFetchNotes = async () => {
    try {
      const response = await axiosConfig.get("/notes/all-notes");
      setNotes(response.data.details.notes);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    handleFetchNotes();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Study Notes</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No notes yet. Create your first note!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
