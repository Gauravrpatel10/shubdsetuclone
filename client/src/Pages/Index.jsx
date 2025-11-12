import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";

const Index = () => {
  const { data: blogData, loading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/blogs`,
    { method: "get", credentials: "include" }
  );

  if (loading) return <Loading />;

  const blogs = blogData?.blog || [];

  return (
    <div className="w-full">
      {/* Latest Blogs Title */}
      <div className="pb-4 border-b mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Blogs</h2>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <div className="text-center py-16 text-gray-500 col-span-full">
            <p className="text-lg">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;