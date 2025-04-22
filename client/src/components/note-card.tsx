import { formatDistanceToNow } from "date-fns";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/interfaces/note.interface";

interface NoteCardProps {
    note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl">{note.title}</CardTitle>
                    <Badge variant="outline">{note.subject}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="whitespace-pre-wrap">{note.content}</p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                {formatDistanceToNow(note.createdAt, { addSuffix: true })}
            </CardFooter>
        </Card>
    );
}
