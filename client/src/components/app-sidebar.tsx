import mmaso from "../assets/mmaso.png";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Link } from "react-router";

const data = {
    user: {
        name: "Ahmad Danish Ikhwan",
        email: "danishikhwn03@gmail.com",
        group: "M30-308BKi-22",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Overview",
            url: "#",
            items: [
                {
                    title: "Home",
                    url: "/dashboard/home",
                    isActive: true,
                },
                {
                    title: "Profile",
                    url: "#",
                },
            ],
        },
        {
            title: "Academic Resources",
            url: "#",
            items: [
                {
                    title: "Timetable",
                    url: "/dashboard/timetable",
                },

                {
                    title: "Study Materials",
                    url: "#",
                },
            ],
        },
        {
            title: "Communication",
            url: "#",
            items: [
                {
                    title: "Announcements",
                    url: "#",
                },
                {
                    title: "Events",
                    url: "#",
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                                    <img src={mmaso} alt="mmaso" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">MMASO</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.isActive}
                                        >
                                            <Link to={item.url}>
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
