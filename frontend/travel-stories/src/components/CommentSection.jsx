import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const CommentSection = ({ storyId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/stories/${storyId}/comments`
        );
        setComments(response.data.comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [storyId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/stories/${storyId}/comments`,
        {
          content: newComment,
        }
      );

      setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      // Prevent multiple likes
      if (likedComments.includes(commentId)) return;

      const response = await axiosInstance.post(
        `/stories/${storyId}/comments/${commentId}/like`
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: response.data.likes }
            : comment
        )
      );

      // Track liked comments to prevent multiple likes
      setLikedComments([...likedComments, commentId]);
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleAddReply = async (commentId) => {
    const content = replyText[commentId];
    if (!content || !content.trim()) return;

    try {
      // Set loading state for this specific reply
      setReplyLoading((prev) => ({ ...prev, [commentId]: true }));

      const response = await axiosInstance.post(
        `/stories/${storyId}/comments/${commentId}/reply`,
        { content }
      );

      // Find the comment and add the reply
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, response.data.reply],
              }
            : comment
        )
      );

      // Clear the reply input
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Comments</h2>
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="mb-4 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="underline text-blue-400 text-xl">
                  {comment.user?.fullname || "User"}
                </p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
              <button
                onClick={() => handleLikeComment(comment._id)}
                className={`${
                  likedComments.includes(comment._id)
                    ? "text-blue-700"
                    : "text-blue-500"
                }`}
              >
                👍 {comment.likes}
              </button>
            </div>
            <div className="ml-4 mt-2">
              {comment.replies && comment.replies.length > 0 && (
                <div className="bg-gray-50 p-2 rounded mb-2">
                  {comment.replies.map((reply, index) => (
                    <div
                      key={reply._id || index}
                      className="mb-2 border-b border-gray-200 pb-2 last:border-0"
                    >
                      <p>
                        <strong className="text-red-300 text-xl underline pr-1">
                          {reply.user?.fullname || "User"}:
                        </strong>{" "}
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center mt-2">
                <textarea
                  className="flex-grow p-2 border rounded"
                  placeholder="Reply to this comment..."
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [comment._id]: e.target.value,
                    })
                  }
                />
                <button
                  onClick={() => handleAddReply(comment._id)}
                  className="bg-gray-300 text-sm px-3 py-1 ml-2 rounded hover:bg-gray-400"
                  disabled={replyLoading[comment._id]}
                >
                  {replyLoading[comment._id] ? "..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentSection;
