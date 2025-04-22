import { axiosConfig } from "@/axiosConfig";
import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IStudent } from "@/interfaces/student.interface";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [search, setSearch] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");

    const fetchStudents = async () => {
        try {
            const response = await axiosConfig.get("/student/get-students");
            setStudents(response.data.details.students);
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        }
    };

    const foundStudent =
        search &&
        students.filter((student) =>
            student.name.toLowerCase().includes(search.toLowerCase())
        );

    const filteredStudents = selectedBatch
        ? students.filter(
              (student) => student.batch.toString() === selectedBatch
          )
        : students;

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <AdminLayout heading="Students" subheading="View Students">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="mx-5 my-5">
                        <div className="flex items-center pb-4">
                            <Input
                                placeholder="Find student..."
                                className="max-w-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="default">
                                            Filter By
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuRadioGroup
                                            value={selectedBatch}
                                            onValueChange={setSelectedBatch}
                                        >
                                            <DropdownMenuRadioItem value="16">
                                                PR 16
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="17">
                                                PR 17
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Group</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Batch</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {search
                                        ? foundStudent &&
                                          foundStudent.map((student) => (
                                              <TableRow key={student.id}>
                                                  <TableCell>
                                                      {student.name}
                                                  </TableCell>
                                                  <TableCell>
                                                      {student.group}
                                                  </TableCell>
                                                  <TableCell>
                                                      {student.email}
                                                  </TableCell>
                                                  <TableCell>
                                                      PR {student.batch}
                                                  </TableCell>
                                              </TableRow>
                                          ))
                                        : filteredStudents.map((student) => (
                                              <TableRow key={student.id}>
                                                  <TableCell>
                                                      {student.name}
                                                  </TableCell>
                                                  <TableCell>
                                                      {student.group}
                                                  </TableCell>
                                                  <TableCell>
                                                      {student.email}
                                                  </TableCell>
                                                  <TableCell>
                                                      PR {student.batch}
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
