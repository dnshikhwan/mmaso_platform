import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddNoteModal } from "@/components/add-note-modal";
import { Note } from "@/interfaces/note.interface";
import { NoteCard } from "./note-card";

export function StudyNotesPage() {
    const [notes, setNotes] = useState<Note[]>([
        {
            id: "1",
            title: "React Hooks",
            content:
                "useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef",
            subject: "Web Development",
            createdAt: new Date("2023-05-15"),
        },
        {
            id: "2",
            title: "Data Structures",
            content:
                "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hash Tables",
            subject: "Computer Science",
            createdAt: new Date("2023-05-10"),
        },
        {
            id: "3",
            title: "CSS Grid vs Flexbox",
            content:
                "Grid is 2D, Flexbox is 1D. Grid is for layout, Flexbox is for alignment.",
            subject: "Web Development",
            createdAt: new Date("2023-05-05"),
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const addNote = (note: Omit<Note, "id" | "createdAt">) => {
        const newNote: Note = {
            ...note,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date(),
        };
        setNotes([newNote, ...notes]);
        setIsModalOpen(false);
    };

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
                onAddNote={addNote}
            />
        </div>
    );
}
