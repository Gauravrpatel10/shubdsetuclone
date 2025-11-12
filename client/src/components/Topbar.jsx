// Topbar.jsx
import React, { useEffect, useState } from 'react';
import logo from "@/assets/images/logo-white.svg";
import NotificationBell from './Notifications/NotificationBell.jsx'; // safe to keep
import { Button } from "./ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { MdLogin } from "react-icons/md";
import SearchBox from "./SearchBox";
import {
  RouteBlogAdd,
  RouteFollowers,
  RouteFollowing,
  RouteIndex,
  RouteProfile,
  RouteSignIn
} from "@/helpers/RouteName";
import { SidebarTrigger } from "@/components/ui/sidebar";
import usericon from '@/assets/images/user.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { Users, UserPlus, Sun, Moon, Pencil } from "lucide-react";
import { removeUser } from '@/redux/user/user.slice';
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const loggedInUser = user?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkToggle, setDarkToggle] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const avatarSrc = loggedInUser?.avatar || usericon;
  const displayName = loggedInUser?.name || 'User';
  const displayEmail = loggedInUser?.email || '';
  const initials = (displayName || 'U').charAt(0).toUpperCase();
  const roleLabel = loggedInUser?.role === "admin" ? "Admin" : "Member";

  // fetch followers when dropdown opens
  useEffect(() => {
    if (!menuOpen || !loggedInUser?._id) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${getEnv('VITE_API_BASE_URL')}/follow/followers/${loggedInUser._id}`,
          { method: 'GET', credentials: 'include', signal: controller.signal }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Failed to fetch followers');
        setFollowerCount(Array.isArray(data?.followers) ? data.followers.length : 0);
      } catch (e) {
        if (e.name !== 'AbortError') setFollowerCount(0);
      }
    })();

    return () => controller.abort();
  }, [menuOpen, loggedInUser?._id]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/logout`, {
        method: 'get',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) return showToast('error', data?.message || 'Logout failed');
      dispatch(removeUser());
      navigate(RouteIndex);
      showToast('success', data?.message || 'Logged out');
    } catch (e) {
      showToast('error', e.message);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white border-b shadow-sm">
      <div className="mx-auto h-full px-4 md:px-10 flex items-center justify-between gap-3">

        {/* Left: Sidebar trigger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <Link to={RouteIndex} className="block">
            <img src={logo} alt="ShabdSetu" className="h-8 sm:h-9" />
          </Link>
        </div>

        {/* Middle: Search (desktop only) */}
        <div className="hidden md:flex flex-1 max-w-lg">
          <SearchBox />
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">

          {/* Write Blog */}
          {user?.isLoggedIn ? (
            <>
              <Button
                asChild
                className="hidden md:flex items-center gap-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Link to={RouteBlogAdd}>
                  <Pencil className="h-4 w-4" />
                  Write Blog
                </Link>
              </Button>

              <Button
                asChild
                size="icon"
                className="md:hidden rounded-full h-9 w-9 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link to={RouteBlogAdd}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : null}

          {/* Notifications (only render if logged in) */}
          {user?.isLoggedIn ? <NotificationBell /> : null}

          {/* Dummy dark-mode toggle (no side-effects) */}
          <button
            onClick={() => setDarkToggle(v => !v)}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
            aria-label="Toggle dark"
            type="button"
          >
            {darkToggle ? <Sun className="h-5 w-5 text-blue-600" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>

          {/* Auth / Profile */}
          {!user?.isLoggedIn ? (
            <Button
              asChild
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
            >
              <Link to={RouteSignIn}>
                <MdLogin className="text-lg" />
              </Link>
            </Button>
          ) : (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger>
                <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-200 shadow">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="text-base">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 overflow-hidden rounded-xl border p-0 shadow-xl">
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-5 text-white">
                  <Avatar className="h-12 w-12 border-2 border-white/70 shadow-md">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{displayName}</p>
                    <p className="truncate text-xs text-white/80">{displayEmail}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wide">
                      <span className="rounded-full border border-white/40 px-2 py-0.5 font-semibold text-white/90">{roleLabel}</span>
                      <span className="rounded-full border border-white/30 px-2 py-0.5 font-semibold text-white/80 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {followerCount} follower{followerCount === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3">
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-100">
                    <Link to={RouteProfile} className="flex items-center gap-2">
                      <FaRegUser className="text-slate-500" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-100">
                    <Link to={RouteFollowing} className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      Following
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-100">
                    <Link to={RouteFollowers} className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-slate-500" />
                      Followers
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0">
                    <Link
                      to={RouteBlogAdd}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                      <FaPlus />
                      Write Blog
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <IoLogOutOutline />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
