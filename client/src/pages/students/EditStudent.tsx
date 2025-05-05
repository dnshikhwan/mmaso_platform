import { axiosConfig } from "@/axiosConfig";
import AdminLayout from "@/components/admin-layout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IStudent } from "@/interfaces/student.interface";
import { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditStudent = () => {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [email, setEmail] = useState("");
  const [batch, setBatch] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const setSelectedBatch = (value: string) => {
    setBatch(value);
  };

  const fetchStudent = async () => {
    try {
      const response = await axiosConfig.get(`/student/get-student/${id}`);
      const studentData = response.data.details.student as IStudent;
      setName(studentData.name);
      setEmail(studentData.email);
      setGroup(studentData.group);
      setBatch(String(studentData.batch));
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const handleEditStudent = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name,
        group,
        email,
        batch,
      };

      const response = await axiosConfig.put(
        `/student/edit-student/${id}`,
        data
      );
      toast.success(response.data.message);
      return navigate(-1);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  return (
    <AdminLayout heading="Students " subheading="Add Students">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <Card className="w-2/3">
            <CardHeader>
              <CardTitle>Edit Students</CardTitle>
            </CardHeader>
            <form onSubmit={handleEditStudent}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="group">Group</Label>
                    <Input
                      id="group"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="batch">Batch</Label>
                    <Select value={batch} onValueChange={setSelectedBatch}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16">Pre Russian 16</SelectItem>
                        <SelectItem value="17">Pre Russian 17</SelectItem>
                      </SelectContent>
                    </Select>
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

export default EditStudent;
