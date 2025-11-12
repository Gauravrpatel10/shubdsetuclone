import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Share2, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { RouteBlogDetails, RouteProfileView } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";
import LikeCount from "./LikeCount";
import ViewCount from "./ViewCount";
import SaveButton from "./SaveButton";
import { getEnv } from "@/helpers/getEnv";
import SummaryModal from "./SummaryModal";
import { decode } from "entities";

const BlogCard = ({ blog }) => {
  if (!blog) return null;

  const {
    _id,
    featuredImage,
    title,
    description,
    author,
    categories: categoriesFromApi,
    category,
    createdAt,
    slug,
  } = blog;

  const navigate = useNavigate();

  // Summary modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [summary, setSummary] = useState("");
  const [cachedSummary, setCachedSummary] = useState("");

  const abortControllerRef = useRef(null);

  const categories = Array.isArray(categoriesFromApi)
    ? categoriesFromApi.filter(Boolean)
    : category
    ? [category]
    : [];

  const primaryCategory = categories[0];

  const navigateToBlog = (showComments = false) => {
    const catSlug = primaryCategory?.slug || "category";
    navigate(
      RouteBlogDetails(catSlug, slug || _id) +
        (showComments ? "?comments=true" : "")
    );
  };

  // ------------------------------
  // Fetch Summary Logic
  // ------------------------------
  const fetchSummary = async (refresh = false) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setSummaryLoading(true);
      setSummaryError("");

      const query = refresh ? "?refresh=true" : "";
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/blog/summary/${_id}${query}`,
        { method: "get", credentials: "include", signal: controller.signal }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok)
        throw new Error(result?.message || "Failed to generate summary");

      const text = result?.summary || "";

      if (result?.cached || !refresh) {
        setCachedSummary(text);
        setSummary(text);
      } else {
        setSummary(text || cachedSummary);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setSummary(cachedSummary || "");
        setSummaryError(err.message || "Failed to generate summary");
      }
    } finally {
      setSummaryLoading(false);
    }
  };

  const openSummary = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
    if (!cachedSummary && !summaryLoading) fetchSummary(false);
    else setSummary(cachedSummary);
  };

  const refreshSummary = () => fetchSummary(true);

  const closeModal = () => setIsModalOpen(false);

  // ------------------------------
  // Share Handler
  // ------------------------------
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${RouteBlogDetails(
      category?.slug,
      slug || _id
    )}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description?.replace(/<[^>]*>/g, "").slice(0, 120),
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("success", "Link copied to clipboard");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      showToast("success", "Link copied to clipboard");
    }
  };

  // ------------------------------
  // Smart Excerpt
  // ------------------------------
  const getBlogExcerpt = (html) => {
    if (!html) return "No preview available.";

    try {
      let decoded = decode(html);

      decoded = decoded.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
      decoded = decoded.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");

      const blocks = decoded
        .split(/<\/?[^>]+>/g)
        .map((t) => t.replace(/\s+/g, " ").trim())
        .filter((t) => t.length > 0);

      if (!blocks.length) return "No preview available.";

      const best = blocks.find(
        (b) =>
          b.length > 40 &&
          !b.startsWith("{") &&
          !b.startsWith("[") &&
          !b.match(/^#/) &&
          !b.match(/^h\d/i)
      );

      const finalText = best || blocks[0];

      const clean = finalText
        .replace(/data-[^ ]+/g, "")
        .replace(/\s+/g, " ")
        .trim();

      return clean.length > 160 ? clean.slice(0, 157) + "..." : clean;
    } catch {
      return "No preview available.";
    }
  };

  // ------------------------------
  // RENDER
  // ------------------------------

  return (
    <>
      <div
        onClick={(e) => {
          if (!e.target.closest(".blog-actions")) navigateToBlog(false);
        }}
        className="
          group bg-white border border-gray-200 rounded-xl 
          shadow-sm hover:shadow-xl hover:border-gray-300 
          hover:scale-[1.01] transition-all duration-300 cursor-pointer
          flex flex-col overflow-hidden h-full
        "
      >
        {/* IMAGE */}
        <div className="w-full h-48 overflow-hidden flex-shrink-0">
          <img
            src={featuredImage || "/placeholder.jpg"}
            alt="image"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* CARD BODY */}
        <div className="p-5 flex flex-col flex-grow">

          {/* CATEGORIES */}
          <div className="flex flex-wrap gap-2 mb-3 flex-shrink-0">
            {categories.length > 0 ? (
              categories.slice(0, 2).map((item, i) => (
                <span
                  key={item?._id || item?.slug || item?.name || i}
                  className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium"
                >
                  {item?.name || "Uncategorized"}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                Uncategorized
              </span>
            )}
          </div>

          {/* TITLE */}
          <h2 className="text-lg sm:text-xl font-bold leading-snug mb-3 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
            {title}
          </h2>

          {/* EXCERPT */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
            {getBlogExcerpt(blog?.blogContent)}
          </p>

          {/* AUTHOR & ACTIONS - Always at bottom */}
          <div className="mt-auto flex-shrink-0">
            {/* AUTHOR */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (author?._id) navigate(RouteProfileView(author._id));
              }}
              className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 cursor-pointer"
            >
              <img
                src={author?.avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{author?.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{moment(createdAt).format("MMM D, YYYY")}</span>
                  <span>•</span>
                  <span className="text-green-600 font-semibold">
                    <ViewCount blogId={_id} />
                  </span>
                </p>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex justify-between items-center">
              <button
                onClick={openSummary}
                className="flex items-center gap-1.5 text-gray-600 hover:text-sky-600 transition-colors text-sm font-medium"
              >
                <Bot className="h-4 w-4" />
                <span>Summary</span>
              </button>

              <div className="blog-actions flex items-center gap-3 text-gray-500">
                <LikeCount blogid={_id} />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToBlog(true);
                  }}
                  className="hover:text-sky-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>

                <button onClick={handleShare} className="hover:text-sky-600 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>

                <SaveButton blogId={_id} size="sm" className="text-gray-600 hover:text-sky-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP */}
      <SummaryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        summary={summary}
        summaryLoading={summaryLoading}
        summaryError={summaryError}
        onRefresh={refreshSummary}
      />
    </>
  );
};

export default BlogCard;