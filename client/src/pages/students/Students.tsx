import { axiosConfig } from "@/axiosConfig";
import AdminLayout from "@/components/admin-layout";
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

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <AdminLayout heading="Students" subheading="View Students">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="mx-10 my-5">
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
                                {students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.group}</TableCell>
                                        <TableCell>{student.email}</TableCell>
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
        </AdminLayout>
    );
};

export default Dashboard;
