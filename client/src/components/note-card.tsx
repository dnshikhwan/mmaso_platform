import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INote } from "@/interfaces/note.interface";
import { Link } from "react-router";

interface NoteCardProps {
  note: INote;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <Link to={`/dashboard/note/${note.id}`}>
            <CardTitle className="text-xl underline">{note.title}</CardTitle>
          </Link>
          <Badge variant="outline">{note.subject}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="whitespace-pre-wrap">
          {note.content.length > 100 ? (
            <span>{note.content.substring(0, 100)}...</span>
          ) : (
            note.content
          )}
        </p>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {formatDistanceToNow(note.created_at, { addSuffix: true })}
      </CardFooter>
    </Card>
  );
}
