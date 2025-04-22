import type React from "react";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/interfaces/note.interface";

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddNote: (note: Omit<Note, "id" | "createdAt">) => void;
}

export function AddNoteModal({
    isOpen,
    onClose,
    onAddNote,
}: AddNoteModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [subject, setSubject] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!content.trim()) {
            newErrors.content = "Content is required";
        }

        if (!subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onAddNote({
                title,
                content,
                subject,
            });

            // Reset form
            setTitle("");
            setContent("");
            setSubject("");
            setErrors({});
        }
    };

    const handleClose = () => {
        setTitle("");
        setContent("");
        setSubject("");
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Study Note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title"
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter subject"
                            className={errors.subject ? "border-red-500" : ""}
                        />
                        {errors.subject && (
                            <p className="text-red-500 text-sm">
                                {errors.subject}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your notes here..."
                            rows={5}
                            className={errors.content ? "border-red-500" : ""}
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save Note</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
