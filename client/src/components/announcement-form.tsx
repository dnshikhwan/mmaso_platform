import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosConfig } from "@/axiosConfig";

const AnnouncementForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const data = {
        title,
        content,
      };

      const response = await axiosConfig.post(
        "/announcement/add-announcement",
        data
      );
      toast.success(response.data.message);
      return navigate("/admin/view-announcements");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <Card className="md:col-span-3">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter announcement content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Announcement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Announcement Preview</h3>
            <div className="border rounded-md p-4 bg-muted/30">
              {title ? (
                <>
                  <h4 className="text-xl font-bold mb-2">{title}</h4>
                  <div className="prose prose-sm max-w-none">
                    {content ? (
                      content
                    ) : (
                      <span className="text-muted-foreground italic">
                        No content added yet
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Fill out the form to see a preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementForm;
