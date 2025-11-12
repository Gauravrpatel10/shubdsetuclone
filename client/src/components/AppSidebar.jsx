import { useMemo } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import {
    RouteIndex,
    RouteFollowing,
    RouteSaved,
    RouteCategoryFeed,
    RouteCategoryDetails,
    RouteBlog,
    RouteCommentDetails,
    RouteUser,
} from "@/helpers/RouteName";
import { useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";

function AppSidebar({ className }) {
    const user = useSelector((state) => state.user);
    const location = useLocation();

    const baseUrl = getEnv("VITE_API_BASE_URL");
    const { data: categoryData } = useFetch(
        baseUrl ? `${baseUrl}/category/all-category` : null,
        { method: "get", credentials: "include" },
        [baseUrl]
    );

    const categories = useMemo(() => {
        if (!Array.isArray(categoryData?.category)) return [];
        return categoryData.category.filter(Boolean);
    }, [categoryData]);

    const isActive = (path) => location.pathname === path;

    return (
        <Sidebar
            className={`bg-white pt-18 h-full border-r border-gray-200 ${className || ""}`}
            collapsible="offcanvas"
        >
            {/* ✅ REMOVED HEADER — sidebar starts immediately */}

            <SidebarContent className="bg-white">

                {/* ✅ MAIN MENU (Not Scrollable) */}
                <SidebarGroup>
                    <SidebarMenu>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link
                                    to={RouteIndex}
                                    className={`
                                        flex items-center gap-3 px-4 py-2 text-[15px]
                                        hover:bg-gray-100 transition
                                        ${isActive(RouteIndex)
                                            ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                            : "text-gray-700"}
                                    `}
                                >
                                    <IoHomeOutline size={18} />
                                    Home
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {user?.isLoggedIn && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={RouteBlog}
                                            className={`
                                                flex items-center gap-3 px-4 py-2 text-[15px]
                                                hover:bg-gray-100 transition
                                                ${isActive(RouteBlog)
                                                    ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                                    : "text-gray-700"}
                                            `}
                                        >
                                            <GrBlog size={18} />
                                            My Blogs
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={RouteCommentDetails}
                                            className={`
                                                flex items-center gap-3 px-4 py-2 text-[15px]
                                                hover:bg-gray-100 transition
                                                ${isActive(RouteCommentDetails)
                                                    ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                                    : "text-gray-700"}
                                            `}
                                        >
                                            <FaRegComments size={18} />
                                            Comments
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={RouteSaved}
                                            className={`
                                                flex items-center gap-3 px-4 py-2 text-[15px]
                                                hover:bg-gray-100 transition
                                                ${isActive(RouteSaved)
                                                    ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                                    : "text-gray-700"}
                                            `}
                                        >
                                            <Bookmark size={18} />
                                            Saved
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={RouteFollowing}
                                            className={`
                                                flex items-center gap-3 px-4 py-2 text-[15px]
                                                hover:bg-gray-100 transition
                                                ${isActive(RouteFollowing)
                                                    ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                                    : "text-gray-700"}
                                            `}
                                        >
                                            <LuUsers size={18} />
                                            Following
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}

                        {/* ✅ ADMIN ITEMS */}
                        {user?.isLoggedIn && user?.user?.role === "admin" && (
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={RouteCategoryDetails}
                                            className={`
                                                flex items-center gap-3 px-4 py-2 text-[15px]
                                                hover:bg-gray-100 transition
                                                ${isActive(RouteCategoryDetails)
                                                    ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                                    : "text-gray-700"}
                                            `}
                                        >
                                            <BiCategoryAlt size={18} />
                                            Manage Categories
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={RouteUser}
                                            className={`
                                                flex items-center gap-3 px-4 py-2 text-[15px]
                                                hover:bg-gray-100 transition
                                                ${isActive(RouteUser)
                                                    ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                                    : "text-gray-700"}
                                            `}
                                        >
                                            <LuUsers size={18} />
                                            Manage Users
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarGroup>

                {/* ✅ CATEGORY SECTION — ONLY THIS PART SCROLLS */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Popular Categories
                    </SidebarGroupLabel>

                    <div className="max-h-[55vh] overflow-y-auto scrollbar-hide">

                        <SidebarMenu>
                            {categories.map((cat) => {
                                const path = RouteCategoryFeed(cat.slug);
                                const active = location.pathname === path;

                                return (
                                    <SidebarMenuItem key={cat._id}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={path}
                                                className={`
                                                    flex items-center px-4 py-2 text-[14px]
                                                    hover:bg-gray-100 transition
                                                    ${active
                                                        ? "text-blue-600 font-semibold bg-blue-50 border-r-4 border-blue-600"
                                                        : "text-gray-700"}
                                                `}
                                            >
                                                {/* ✅ long category names scroll horizontally */}
                                                <span className="overflow-x-auto whitespace-nowrap block w-full pr-4 scrollbar-hide">
                                                    {cat.name}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>

                    </div>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;
